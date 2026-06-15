'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import { api } from '@/services/api';
import { useToast } from '@/components/Toast';
import { ArrowLeft, Search, Calendar, ChevronRight } from 'lucide-react';

interface Hospede {
  id: number;
  nome: string;
  cpf: string;
  inativo: boolean;
}

interface Quarto {
  id: number;
  numero: string;
  tipo: string;
  capacidadeAdultos: number;
  capacidadeCriancas: number;
  valorDiaria: number;
  status: 'DISPONIVEL' | 'OCUPADO' | 'MANUTENCAO';
}

interface Promocao {
  id: number;
  codigo: string;
  descricao: string;
  descontoPercentual: number;
  inativo: boolean;
}

interface PoliticaCancelamento {
  id: number;
  descricao: string;
  inativo: boolean;
}

interface ReservaMock {
  quartoId: number;
  dataEntrada: string;
  dataSaida: string;
  status: string;
}

export default function CriarReserva() {
  const router = useRouter();
  const { showToast } = useToast();

  // Collections
  const [hospedes, setHospedes] = useState<Hospede[]>([]);
  const [quartos, setQuartos] = useState<Quarto[]>([]);
  const [promocoes, setPromocoes] = useState<Promocao[]>([]);
  const [politicas, setPoliticas] = useState<PoliticaCancelamento[]>([]);
  const [todasReservas, setTodasReservas] = useState<ReservaMock[]>([]);

  // Form State
  const [hospedeBusca, setHospedeBusca] = useState('');
  const [resultadosBusca, setResultadosBusca] = useState<Hospede[]>([]);
  const [hospedeSelecionado, setHospedeSelecionado] = useState<Hospede | null>(null);

  const [dataEntrada, setDataEntrada] = useState('');
  const [dataSaida, setDataSaida] = useState('');
  const [qtdAdultos, setQtdAdultos] = useState(1);
  const [qtdCriancas, setQtdCriancas] = useState(0);

  const [quartosDisponiveis, setQuartosDisponiveis] = useState<Quarto[]>([]);
  const [quartoSelecionado, setQuartoSelecionado] = useState<Quarto | null>(null);

  const [promocaoSelecionada, setPromocaoSelecionada] = useState<Promocao | null>(null);
  const [politicaId, setPoliticaId] = useState('');

  const [loading, setLoading] = useState(true);

  // Pricing
  const [diarias, setDiarias] = useState(0);
  const [valorBruto, setValorBruto] = useState(0);
  const [desconto, setDesconto] = useState(0);
  const [valorTotal, setValorTotal] = useState(0);

  useEffect(() => {
    const carregarConfiguracoes = async () => {
      try {
        const [hRes, qRes, pRes, polRes, resRes] = await Promise.all([
          api.get<Hospede[]>('/hospedes'),
          api.get<Quarto[]>('/quartos'),
          api.get<Promocao[]>('/promocoes'),
          api.get<PoliticaCancelamento[]>('/politicas'),
          api.get<ReservaMock[]>('/reservas')
        ]);
        setHospedes(hRes.data.filter(h => !h.inativo));
        setQuartos(qRes.data);
        setPromocoes(pRes.data.filter(p => !p.inativo));
        setPoliticas(polRes.data.filter(p => !p.inativo));
        setTodasReservas(resRes.data);

        // Standard Dates
        const hoje = new Date();
        const amanha = new Date();
        amanha.setDate(hoje.getDate() + 1);

        setDataEntrada(hoje.toISOString().split('T')[0]);
        setDataSaida(amanha.toISOString().split('T')[0]);
      } catch (e) {
        showToast('Erro ao carregar configurações de reservas', 'error');
      } finally {
        setLoading(false);
      }
    };
    carregarConfiguracoes();
  }, []);

  // Recalculate Period and Available Rooms
  useEffect(() => {
    if (dataEntrada && dataSaida) {
      const d1 = new Date(dataEntrada);
      const d2 = new Date(dataSaida);
      if (d2 > d1) {
        const diff = Math.abs(d2.getTime() - d1.getTime());
        const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
        setDiarias(days);
      } else {
        setDiarias(0);
      }
    }
  }, [dataEntrada, dataSaida]);

  // Query Available Rooms when search inputs change
  useEffect(() => {
    if (loading) return;
    if (!dataEntrada || !dataSaida || new Date(dataSaida) <= new Date(dataEntrada)) {
      setQuartosDisponiveis([]);
      return;
    }

    // Capacity & Status Check
    let livres = quartos.filter(q => q.status !== 'MANUTENCAO');
    livres = livres.filter(q => q.capacidadeAdultos >= qtdAdultos && q.capacidadeCriancas >= qtdCriancas);

    // Overlaps Check
    livres = livres.filter(q => {
      const conflito = todasReservas.find(r => 
        r.quartoId === q.id &&
        r.status !== 'CANCELADA' &&
        (
          (dataEntrada >= r.dataEntrada && dataEntrada < r.dataSaida) ||
          (dataSaida > r.dataEntrada && dataSaida <= r.dataSaida) ||
          (dataEntrada <= r.dataEntrada && dataSaida >= r.dataSaida)
        )
      );
      return !conflito;
    });

    setQuartosDisponiveis(livres);

    // If selected room is no longer in list, deselect
    if (quartoSelecionado && !livres.some(q => q.id === quartoSelecionado.id)) {
      setQuartoSelecionado(null);
    }
  }, [dataEntrada, dataSaida, qtdAdultos, qtdCriancas, quartos, todasReservas]);

  // Recalculate Price
  useEffect(() => {
    if (diarias > 0 && quartoSelecionado) {
      const bruto = diarias * quartoSelecionado.valorDiaria;
      setValorBruto(bruto);

      if (promocaoSelecionada) {
        const desc = bruto * (promocaoSelecionada.descontoPercentual / 100);
        setDesconto(desc);
        setValorTotal(bruto - desc);
      } else {
        setDesconto(0);
        setValorTotal(bruto);
      }
    } else {
      setValorBruto(0);
      setDesconto(0);
      setValorTotal(0);
    }
  }, [diarias, quartoSelecionado, promocaoSelecionada]);

  // Handle Autocomplete
  const buscarHospede = (val: string) => {
    setHospedeBusca(val);
    if (val.length < 2) {
      setResultadosBusca([]);
      return;
    }
    const filtered = hospedes.filter(h => 
      h.nome.toLowerCase().includes(val.toLowerCase()) || 
      h.cpf.includes(val)
    );
    setResultadosBusca(filtered);
  };

  const selecionarHospede = (h: Hospede) => {
    setHospedeSelecionado(h);
    setHospedeBusca(h.nome);
    setResultadosBusca([]);
  };

  const limparHospede = () => {
    setHospedeSelecionado(null);
    setHospedeBusca('');
  };

  const formatarMoeda = (valor: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(valor);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!hospedeSelecionado) {
      showToast('Selecione um hóspede ativo!', 'error');
      return;
    }
    if (!quartoSelecionado) {
      showToast('Selecione um quarto disponível!', 'error');
      return;
    }
    if (!politicaId) {
      showToast('Selecione uma política de cancelamento!', 'error');
      return;
    }

    setLoading(true);
    const body = {
      hospede: { id: hospedeSelecionado.id },
      quarto: { id: quartoSelecionado.id },
      dataEntrada,
      dataSaida,
      qtdAdultos,
      qtdCriancas,
      valorTotal,
      promocao: promocaoSelecionada ? { id: promocaoSelecionada.id } : null,
      politicaCancelamento: { id: parseInt(politicaId) },
      checkinRealizado: false,
      noShow: false,
      status: 'CONFIRMADA',
    };

    try {
      await api.post('/reservas', body);
      showToast('Reserva confirmada com sucesso!', 'success');
      router.push('/reservas');
    } catch (err: any) {
      const errMsg = err.response?.data?.erro || 'Erro ao criar reserva';
      showToast(errMsg, 'error');
    } finally {
      setLoading(false);
    }
  };

  if (loading && hospedes.length === 0) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="fade-in-up">
      <Header titulo="Criar Reserva">
        <Link
          href="/reservas"
          className="text-blue-600 hover:text-blue-800 font-semibold text-sm flex items-center gap-1.5"
        >
          <ArrowLeft size={16} /> Voltar para Lista
        </Link>
      </Header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Form panel */}
        <form onSubmit={handleSubmit} className="lg:col-span-2 glass-card p-8 rounded-2xl shadow-sm space-y-6">
          
          {/* Passo 1: Selecionar Hóspede */}
          <div className="relative">
            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-3">1. Selecionar Hóspede *</h3>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  required={!hospedeSelecionado}
                  disabled={!!hospedeSelecionado}
                  value={hospedeBusca}
                  onChange={(e) => buscarHospede(e.target.value)}
                  className="w-full border border-slate-200 rounded-xl p-3 bg-slate-50 text-slate-800 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all disabled:bg-slate-100 disabled:text-slate-500"
                  placeholder="Digite o nome ou CPF do hóspede..."
                />
                <span className="absolute inset-y-0 right-3 flex items-center text-slate-400">
                  <Search size={18} />
                </span>
              </div>
              {hospedeSelecionado && (
                <button
                  type="button"
                  onClick={limparHospede}
                  className="px-4 py-3 bg-red-50 text-red-600 border border-red-200 rounded-xl text-sm font-bold hover:bg-red-100 transition-all"
                >
                  Limpar
                </button>
              )}
            </div>

            {/* Dropdown Results */}
            {resultadosBusca.length > 0 && (
              <div className="absolute left-0 right-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-lg z-30 max-h-48 overflow-y-auto">
                {resultadosBusca.map(h => (
                  <div
                    key={h.id}
                    onClick={() => selecionarHospede(h)}
                    className="p-3 text-sm hover:bg-slate-50 cursor-pointer border-b border-slate-100 last:border-0 flex justify-between items-center"
                  >
                    <span>
                      <strong>{h.nome}</strong>
                    </span>
                    <span className="text-xs text-slate-400">({h.cpf})</span>
                  </div>
                ))}
              </div>
            )}

            {hospedeSelecionado && (
              <div className="mt-2 p-3 bg-blue-50 text-blue-900 rounded-xl text-xs font-semibold flex justify-between items-center">
                <span>Hóspede selecionado: {hospedeSelecionado.nome} (CPF: {hospedeSelecionado.cpf})</span>
              </div>
            )}
          </div>

          {/* Passo 2: Período e Ocupantes */}
          <div>
            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-3">2. Período e Hóspedes</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-slate-600 mb-1">Check-in *</label>
                <input
                  type="date"
                  required
                  value={dataEntrada}
                  onChange={(e) => setDataEntrada(e.target.value)}
                  className="w-full border border-slate-200 rounded-xl p-2.5 bg-slate-50 text-slate-800 text-sm focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-slate-600 mb-1">Check-out *</label>
                <input
                  type="date"
                  required
                  value={dataSaida}
                  onChange={(e) => setDataSaida(e.target.value)}
                  className="w-full border border-slate-200 rounded-xl p-2.5 bg-slate-50 text-slate-800 text-sm focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Adultos *</label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  required
                  value={qtdAdultos}
                  onChange={(e) => setQtdAdultos(parseInt(e.target.value) || 1)}
                  className="w-full border border-slate-200 rounded-xl p-2.5 bg-slate-50 text-slate-800 text-sm focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Crianças</label>
                <input
                  type="number"
                  min="0"
                  max="10"
                  required
                  value={qtdCriancas}
                  onChange={(e) => setQtdCriancas(parseInt(e.target.value) || 0)}
                  className="w-full border border-slate-200 rounded-xl p-2.5 bg-slate-50 text-slate-800 text-sm focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
              </div>
            </div>
          </div>

          {/* Passo 3: Selecionar Quarto Disponível */}
          <div>
            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-3">3. Selecionar Quarto Disponível *</h3>
            <p className="text-xs text-slate-400 mb-2">Insira as datas e ocupantes acima para carregar quartos livres e compatíveis.</p>
            
            {quartosDisponiveis.length === 0 ? (
              <p className="text-sm text-red-500 font-semibold py-4 text-center bg-red-50 rounded-xl">
                Nenhuma acomodação livre ou compatível no período.
              </p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-60 overflow-y-auto p-1">
                {quartosDisponiveis.map(q => {
                  const active = quartoSelecionado?.id === q.id;
                  return (
                    <div
                      key={q.id}
                      onClick={() => setQuartoSelecionado(q)}
                      className={`border p-4 rounded-xl cursor-pointer hover:bg-slate-50 transition-all ${
                        active
                          ? 'border-2 border-blue-600 bg-blue-50/50 hover:bg-blue-50'
                          : 'border-slate-200 bg-white'
                      }`}
                    >
                      <div className="flex justify-between items-start mb-1">
                        <span className="text-lg font-bold text-slate-800">Quarto {q.numero}</span>
                        <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">{q.tipo}</span>
                      </div>
                      <div className="text-[11px] text-slate-400">Capacidade: {q.capacidadeAdultos} Ad / {q.capacidadeCriancas} Cr</div>
                      <div className="text-sm font-extrabold text-slate-900 mt-2">{formatarMoeda(q.valorDiaria)}/dia</div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Passo 4: Promoções e Políticas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-3">4. Cupom de Promoção</h3>
              <select
                value={promocaoSelecionada?.id || ''}
                onChange={(e) => {
                  const val = e.target.value;
                  setPromocaoSelecionada(promocoes.find(p => p.id === parseInt(val)) || null);
                }}
                className="w-full border border-slate-200 rounded-xl p-3 bg-slate-50 text-slate-800 text-sm focus:ring-blue-500 focus:border-blue-500 outline-none"
              >
                <option value="">Sem Cupom</option>
                {promocoes.map(p => (
                  <option key={p.id} value={p.id}>{p.codigo} ({p.descontoPercentual}% Off)</option>
                ))}
              </select>
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-3">5. Política de Cancelamento *</h3>
              <select
                required
                value={politicaId}
                onChange={(e) => setPoliticaId(e.target.value)}
                className="w-full border border-slate-200 rounded-xl p-3 bg-slate-50 text-slate-800 text-sm focus:ring-blue-500 focus:border-blue-500 outline-none"
              >
                <option value="">Selecione...</option>
                {politicas.map(p => (
                  <option key={p.id} value={p.id}>{p.descricao}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Botão de envio */}
          <div className="flex justify-end border-t border-slate-100 pt-6">
            <button
              type="submit"
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-sm shadow-lg shadow-blue-600/15 transition-all w-full md:w-auto"
            >
              Criar e Confirmar Reserva
            </button>
          </div>
        </form>

        {/* Resumo da Reserva Card */}
        <div className="glass-card p-6 rounded-2xl shadow-sm space-y-6 lg:sticky lg:top-8">
          <h3 className="text-lg font-bold text-slate-800 border-b border-slate-100 pb-3">Resumo da Reserva</h3>
          
          <div className="space-y-3 text-sm text-slate-600">
            <div className="flex justify-between">
              <span>Hóspede:</span>
              <span className="font-semibold text-slate-800 truncate max-w-[150px]">
                {hospedeSelecionado?.nome || '-'}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Check-in:</span>
              <span className="font-semibold text-slate-800">
                {dataEntrada ? dataEntrada.split('-').reverse().join('/') : '-'}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Check-out:</span>
              <span className="font-semibold text-slate-800">
                {dataSaida ? dataSaida.split('-').reverse().join('/') : '-'}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Diárias:</span>
              <span className="font-semibold text-slate-800">{diarias}</span>
            </div>
            <div className="flex justify-between">
              <span>Quarto Selecionado:</span>
              <span className="font-semibold text-slate-800">
                {quartoSelecionado ? `Quarto ${quartoSelecionado.numero}` : '-'}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Valor Diária:</span>
              <span className="font-semibold text-slate-800">
                {quartoSelecionado ? formatarMoeda(quartoSelecionado.valorDiaria) : 'R$ 0,00'}
              </span>
            </div>
            {desconto > 0 && (
              <div className="flex justify-between text-blue-600 font-semibold">
                <span>Desconto Promo:</span>
                <span>-{formatarMoeda(desconto)}</span>
              </div>
            )}
          </div>

          <div className="border-t border-slate-100 pt-4 flex justify-between items-baseline">
            <span className="text-base font-bold text-slate-800">Total Estimado:</span>
            <span className="text-2xl font-black text-blue-600">{formatarMoeda(valorTotal)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
