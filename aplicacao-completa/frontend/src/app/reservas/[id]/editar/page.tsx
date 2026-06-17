'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import Header from '@/components/Header';
import { api } from '@/services/api';
import { useToast } from '@/components/Toast';
import { ArrowLeft, Search, Calendar } from 'lucide-react';

interface Hospede {
  id: number;
  nome: string;
  cpf: string;
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
}

interface PoliticaCancelamento {
  id: number;
  descricao: string;
}

interface Reserva {
  id: number;
  hospede: Hospede;
  quarto: Quarto;
  dataEntrada: string;
  dataSaida: string;
  checkinRealizado: boolean;
  noShow: boolean;
  qtdAdultos: number;
  qtdCriancas: number;
  valorTotal: number;
  promocao: Promocao | null;
  politicaCancelamento: PoliticaCancelamento;
  status: string;
}

interface ReservaMock {
  id: number;
  quartoId: number;
  dataEntrada: string;
  dataSaida: string;
  status: string;
}

export default function EditarReserva() {
  const router = useRouter();
  const params = useParams();
  const { showToast } = useToast();
  const id = params.id ? parseInt(params.id as string) : undefined;

  // Collections
  const [hospedes, setHospedes] = useState<Hospede[]>([]);
  const [quartos, setQuartos] = useState<Quarto[]>([]);
  const [promocoes, setPromocoes] = useState<Promocao[]>([]);
  const [politicas, setPoliticas] = useState<PoliticaCancelamento[]>([]);
  const [todasReservas, setTodasReservas] = useState<ReservaMock[]>([]);

  // Form State
  const [hospedeSelecionado, setHospedeSelecionado] = useState<Hospede | null>(null);
  const [dataEntrada, setDataEntrada] = useState('');
  const [dataSaida, setDataSaida] = useState('');
  const [qtdAdultos, setQtdAdultos] = useState(1);
  const [qtdCriancas, setQtdCriancas] = useState(0);
  const [quartosDisponiveis, setQuartosDisponiveis] = useState<Quarto[]>([]);
  const [quartoSelecionado, setQuartoSelecionado] = useState<Quarto | null>(null);
  const [promocaoSelecionada, setPromocaoSelecionada] = useState<Promocao | null>(null);
  const [politicaId, setPoliticaId] = useState('');
  const [status, setStatus] = useState('CONFIRMADA');
  const [checkinRealizado, setCheckinRealizado] = useState(false);

  const [loading, setLoading] = useState(true);
  const [diarias, setDiarias] = useState(0);
  const [valorBruto, setValorBruto] = useState(0);
  const [desconto, setDesconto] = useState(0);
  const [valorTotal, setValorTotal] = useState(0);

  useEffect(() => {
    if (!id) return;
    const carregarConfiguracoes = async () => {
      try {
        const [hRes, qRes, pRes, polRes, resRes, rRes] = await Promise.all([
          api.get<Hospede[]>('/hospedes'),
          api.get<Quarto[]>('/quartos'),
          api.get<Promocao[]>('/promocoes'),
          api.get<PoliticaCancelamento[]>('/politicas'),
          api.get<ReservaMock[]>('/reservas'),
          api.get<Reserva>(`/reservas/${id}`)
        ]);
        setHospedes(hRes.data.filter(h => !h.inativo || h.id === rRes.data.hospede?.id));
        setQuartos(qRes.data);
        setPromocoes(pRes.data.filter(p => !p.inativo || p.id === rRes.data.promocao?.id));
        setPoliticas(polRes.data.filter(p => !p.inativo || p.id === rRes.data.politicaCancelamento?.id));
        setTodasReservas(resRes.data);

        // Populate Form
        const r = rRes.data;
        setHospedeSelecionado(r.hospede);
        setDataEntrada(r.dataEntrada);
        setDataSaida(r.dataSaida);
        setQtdAdultos(r.qtdAdultos);
        setQtdCriancas(r.qtdCriancas);
        setQuartoSelecionado(r.quarto ? qRes.data.find(q => q.id === r.quarto.id) || null : null);
        setPromocaoSelecionada(r.promocao);
        setPoliticaId(r.politicaCancelamento?.id?.toString() || '');
        setStatus(r.status);
        setCheckinRealizado(r.checkinRealizado);

      } catch (e) {
        showToast('Erro ao carregar dados da reserva', 'error');
      } finally {
        setLoading(false);
      }
    };
    carregarConfiguracoes();
  }, [id]);

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

  useEffect(() => {
    if (loading) return;
    if (!dataEntrada || !dataSaida || new Date(dataSaida) <= new Date(dataEntrada)) {
      setQuartosDisponiveis([]);
      return;
    }

    let livres = quartos.filter(q => q.status !== 'MANUTENCAO' || q.id === quartoSelecionado?.id);
    livres = livres.filter(q => q.capacidadeAdultos >= qtdAdultos && q.capacidadeCriancas >= qtdCriancas);

    livres = livres.filter(q => {
      const conflito = todasReservas.find(r => 
        r.quartoId === q.id &&
        r.id !== id &&
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
  }, [dataEntrada, dataSaida, qtdAdultos, qtdCriancas, quartos, todasReservas, loading]);

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

  const formatarMoeda = (valor: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(valor);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!hospedeSelecionado) return;
    if (!quartoSelecionado) return;
    if (!politicaId) return;

    setLoading(true);
    const body = {
      id,
      hospede: { id: hospedeSelecionado.id },
      quarto: { id: quartoSelecionado.id },
      dataEntrada,
      dataSaida,
      qtdAdultos,
      qtdCriancas,
      valorTotal,
      promocao: promocaoSelecionada ? { id: promocaoSelecionada.id } : null,
      politicaCancelamento: { id: parseInt(politicaId) },
      checkinRealizado,
      noShow: false,
      status,
    };

    try {
      await api.put(`/reservas/${id}`, body);
      showToast('Reserva atualizada com sucesso!', 'success');
      router.push('/reservas');
    } catch (err: any) {
      const errMsg = err.response?.data?.erro || 'Erro ao atualizar reserva';
      showToast(errMsg, 'error');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="fade-in-up">
      <Header titulo="Editar Reserva">
        <Link
          href="/reservas"
          className="text-blue-600 hover:text-blue-800 font-semibold text-sm flex items-center gap-1.5"
        >
          <ArrowLeft size={16} /> Voltar para Lista
        </Link>
      </Header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <form onSubmit={handleSubmit} className="lg:col-span-2 glass-card p-8 rounded-2xl shadow-sm space-y-6">
          
          <div>
            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-3">1. Hóspede</h3>
            <div className="p-3 bg-slate-100 text-slate-800 rounded-xl text-sm font-semibold">
              {hospedeSelecionado?.nome} (CPF: {hospedeSelecionado?.cpf})
            </div>
          </div>

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

          <div>
            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-3">3. Selecionar Quarto Disponível *</h3>
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
          </div>

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
                {politicas.map(p => (
                  <option key={p.id} value={p.id}>{p.descricao}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-100">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Status da Reserva</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full border border-slate-200 rounded-xl p-3 bg-slate-50 text-slate-800 text-sm focus:ring-blue-500 focus:border-blue-500 outline-none"
              >
                <option value="PENDENTE">PENDENTE</option>
                <option value="CONFIRMADA">CONFIRMADA</option>
                <option value="CANCELADA">CANCELADA</option>
                <option value="CONCLUIDA">CONCLUIDA</option>
              </select>
            </div>
            <div className="flex items-center pt-6">
              <label className="flex items-center cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={checkinRealizado}
                  onChange={(e) => setCheckinRealizado(e.target.checked)}
                  className="w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-slate-700 font-semibold ml-2">Check-in Realizado</span>
              </label>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-6 border-t border-slate-100">
            <button
              type="button"
              onClick={() => router.push('/reservas')}
              className="px-6 py-3 border border-slate-200 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-sm shadow-lg shadow-blue-600/15"
            >
              Salvar Alterações
            </button>
          </div>
        </form>

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
