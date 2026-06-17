'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import { api } from '@/services/api';
import { useToast } from '@/components/Toast';
import { Plus, Users, Bed, Key, CreditCard, HelpCircle, Activity } from 'lucide-react';

interface KPIs {
  activeGuests: number;
  occupancyRate: number;
  occupiedRooms: number;
  totalRooms: number;
  checkinsToday: number;
  approvedRevenue: number;
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

interface Atividade {
  tipo: string;
  texto: string;
  data: string;
  icone: string;
  corIcone: string;
}

export default function Dashboard() {
  const { showToast } = useToast();
  const [kpis, setKpis] = useState<KPIs>({
    activeGuests: 0,
    occupancyRate: 0,
    occupiedRooms: 0,
    totalRooms: 0,
    checkinsToday: 0,
    approvedRevenue: 0,
  });
  const [quartos, setQuartos] = useState<Quarto[]>([]);
  const [atividades, setAtividades] = useState<Atividade[]>([]);
  const [modalAberto, setModalAberto] = useState(false);
  const [quartoSelecionado, setQuartoSelecionado] = useState<Quarto | null>(null);
  const [novoStatus, setNovoStatus] = useState<'DISPONIVEL' | 'OCUPADO' | 'MANUTENCAO'>('DISPONIVEL');
  const [loading, setLoading] = useState(true);

  const carregarDados = async () => {
    try {
      const [kpisRes, quartosRes, atividadesRes] = await Promise.all([
        api.get<KPIs>('/dashboard/kpis'),
        api.get<Quarto[]>('/quartos'),
        api.get<Atividade[]>('/dashboard/atividades'),
      ]);
      setKpis(kpisRes.data);
      setQuartos(quartosRes.data);
      setAtividades(atividadesRes.data);
    } catch (e) {
      showToast('Erro ao carregar os dados do dashboard', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarDados();
  }, []);

  const abrirModal = (quarto: Quarto) => {
    setQuartoSelecionado(quarto);
    setNovoStatus(quarto.status);
    setModalAberto(true);
  };

  const fecharModal = () => {
    setModalAberto(false);
    setQuartoSelecionado(null);
  };

  const salvarStatusQuarto = async () => {
    if (!quartoSelecionado) return;
    try {
      await api.patch(`/quartos/${quartoSelecionado.id}/status?valor=${novoStatus}`);
      showToast(`Status do quarto ${quartoSelecionado.numero} atualizado com sucesso!`, 'success');
      fecharModal();
      carregarDados();
    } catch (e) {
      showToast('Falha ao atualizar status do quarto', 'error');
    }
  };

  const formatarMoeda = (valor: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(valor);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="fade-in-up">
      <Header titulo="Painel Geral">
        <Link
          href="/reservas/novo"
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2.5 rounded-xl shadow-lg shadow-blue-600/20 transition-all duration-200 text-sm flex items-center gap-2"
        >
          <Plus size={16} /> Nova Reserva
        </Link>
      </Header>

      {/* Seção de Métricas (KPIs) */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Hóspedes Ativos */}
        <div className="glass-card p-6 rounded-2xl shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Hóspedes Ativos</span>
            <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
              <Users size={20} />
            </div>
          </div>
          <h3 className="text-3xl font-extrabold text-slate-900">{kpis.activeGuests}</h3>
          <p className="text-xs text-slate-400 mt-2">Cadastrados no sistema</p>
        </div>

        {/* Taxa de Ocupação */}
        <div className="glass-card p-6 rounded-2xl shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Taxa de Ocupação</span>
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
              <Bed size={20} />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <h3 className="text-3xl font-extrabold text-slate-900">{kpis.occupancyRate}%</h3>
            <span className="text-xs font-semibold text-slate-400">
              ({kpis.occupiedRooms}/{kpis.totalRooms} quartos)
            </span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-2 mt-4 overflow-hidden">
            <div
              className="bg-indigo-600 h-full rounded-full transition-all duration-500"
              style={{ width: `${kpis.occupancyRate}%` }}
            ></div>
          </div>
        </div>

        {/* Check-ins Hoje */}
        <div className="glass-card p-6 rounded-2xl shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Entradas Hoje</span>
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
              <Key size={20} />
            </div>
          </div>
          <h3 className="text-3xl font-extrabold text-slate-900">{kpis.checkinsToday}</h3>
          <p className="text-xs text-slate-400 mt-2">Reservas iniciando hoje</p>
        </div>

        {/* Receita Total Aprovada */}
        <div className="glass-card p-6 rounded-2xl shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Receita Aprovada</span>
            <div className="p-2 bg-green-50 text-green-600 rounded-xl">
              <CreditCard size={20} />
            </div>
          </div>
          <h3 className="text-3xl font-extrabold text-slate-900">{formatarMoeda(kpis.approvedRevenue)}</h3>
          <p className="text-xs text-slate-400 mt-2">Pagamentos confirmados</p>
        </div>
      </section>

      {/* Grid e Conteúdo Principal */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Status dos Quartos */}
        <div className="lg:col-span-2 glass-card p-6 rounded-2xl shadow-sm">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-6">
            <div>
              <h3 className="text-xl font-bold text-slate-900">Status dos Quartos</h3>
              <p className="text-xs text-slate-400">Clique em um quarto para alterar seu estado operacional</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <span className="inline-flex items-center text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                Disponível
              </span>
              <span className="inline-flex items-center text-xs font-semibold px-2.5 py-0.5 rounded-full bg-red-100 text-red-800">
                Ocupado
              </span>
              <span className="inline-flex items-center text-xs font-semibold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800">
                Manutenção
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {quartos.map((quarto) => {
              let statusClasses = '';
              let badgeText = '';
              let badgeClass = '';

              if (quarto.status === 'DISPONIVEL') {
                statusClasses = 'bg-emerald-50 border-emerald-200 hover:bg-emerald-100/70 hover:border-emerald-300 text-emerald-900';
                badgeText = 'Disponível';
                badgeClass = 'bg-emerald-200 text-emerald-950';
              } else if (quarto.status === 'OCUPADO') {
                statusClasses = 'bg-red-50 border-red-200 hover:bg-red-100/70 hover:border-red-300 text-red-900';
                badgeText = 'Ocupado';
                badgeClass = 'bg-red-200 text-red-950';
              } else {
                statusClasses = 'bg-amber-50 border-amber-200 hover:bg-amber-100/70 hover:border-amber-300 text-amber-900';
                badgeText = 'Manutenção';
                badgeClass = 'bg-amber-200 text-amber-950';
              }

              return (
                <div
                  key={quarto.id}
                  onClick={() => abrirModal(quarto)}
                  className={`border p-5 rounded-2xl cursor-pointer transition-all duration-200 flex flex-col justify-between h-40 ${statusClasses}`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-2xl font-black">{quarto.numero}</span>
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${badgeClass}`}>
                      {badgeText}
                    </span>
                  </div>
                  <div>
                    <p className="text-xs font-semibold opacity-70">{quarto.tipo}</p>
                    <p className="text-[10px] opacity-60 mt-0.5">
                      Capacidade: {quarto.capacidadeAdultos} Ad / {quarto.capacidadeCriancas} Cr
                    </p>
                    <p className="text-sm font-bold mt-2">{formatarMoeda(quarto.valorDiaria)}/dia</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Feed de Atividades */}
        <div className="glass-card p-6 rounded-2xl shadow-sm h-fit">
          <div className="flex items-center gap-2 mb-6">
            <Activity size={20} className="text-blue-600" />
            <h3 className="text-xl font-bold text-slate-900">Atividades Recentes</h3>
          </div>
          <div className="space-y-4">
            {atividades.length === 0 ? (
              <p className="text-sm text-slate-400 text-center py-4">Sem atividades recentes.</p>
            ) : (
              atividades.map((at, idx) => (
                <div key={idx} className="flex gap-3 items-start text-sm border-b border-slate-100 pb-3 last:border-0 last:pb-0">
                  <div className={`w-8 h-8 rounded-xl ${at.corIcone} flex items-center justify-center text-base shrink-0`}>
                    {at.icone}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p
                      className="text-slate-700 leading-snug"
                      dangerouslySetInnerHTML={{ __html: at.texto }}
                    />
                    <span className="text-[10px] text-slate-400 font-medium">{at.data}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Modal de Alteração de Status */}
      {modalAberto && quartoSelecionado && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-xl transform scale-100 transition-all duration-300">
            <h3 className="text-lg font-bold text-slate-900 mb-2">Alterar Status do Quarto</h3>
            <p className="text-sm text-slate-500 mb-4">
              Quarto {quartoSelecionado.numero} - {quartoSelecionado.tipo}
            </p>

            <div className="space-y-2 mb-6">
              <label className="block text-sm font-semibold text-slate-700">Selecione o Novo Status:</label>
              <select
                value={novoStatus}
                onChange={(e) => setNovoStatus(e.target.value as any)}
                className="w-full border border-slate-300 rounded-xl p-2.5 focus:ring-blue-500 focus:border-blue-500 bg-slate-50 text-sm"
              >
                <option value="DISPONIVEL">Disponível</option>
                <option value="OCUPADO">Ocupado</option>
                <option value="MANUTENCAO">Manutenção</option>
              </select>
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={fecharModal}
                className="px-4 py-2 border border-slate-200 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-50"
              >
                Cancelar
              </button>
              <button
                onClick={salvarStatusQuarto}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold shadow-lg shadow-blue-600/15"
              >
                Salvar Status
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
