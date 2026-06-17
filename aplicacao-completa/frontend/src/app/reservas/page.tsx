'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import { api } from '@/services/api';
import { useToast } from '@/components/Toast';
import { Plus, Edit2, Calendar, Check, X, Ban, Trash2 } from 'lucide-react';

interface Hospede {
  id: number;
  nome: string;
  cpf: string;
}

interface Quarto {
  id: number;
  numero: string;
  tipo: string;
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
  status: 'PENDENTE' | 'CONFIRMADA' | 'CANCELADA' | 'CONCLUIDA';
}

export default function ReservasLista() {
  const { showToast } = useToast();
  const [reservas, setReservas] = useState<Reserva[]>([]);
  const [loading, setLoading] = useState(true);

  const carregarReservas = async () => {
    try {
      const res = await api.get<Reserva[]>('/reservas');
      setReservas(res.data);
    } catch (e) {
      showToast('Erro ao carregar reservas', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarReservas();
  }, []);

  const toggleCheckin = async (reserva: Reserva) => {
    try {
      const novoValor = !reserva.checkinRealizado;
      await api.patch(`/reservas/${reserva.id}/checkin?valor=${novoValor}`);
      showToast(
        novoValor ? 'Check-in realizado com sucesso!' : 'Check-in desfeito!',
        'success'
      );
      carregarReservas();
    } catch (e) {
      showToast('Erro ao atualizar check-in', 'error');
    }
  };

  const cancelarReserva = async (id: number) => {
    if (confirm('Deseja realmente cancelar esta reserva?')) {
      try {
        await api.patch(`/reservas/${id}/cancelar`);
        showToast('Reserva cancelada!', 'success');
        carregarReservas();
      } catch (e) {
        showToast('Erro ao cancelar reserva', 'error');
      }
    }
  };

  const deletarReserva = async (id: number) => {
    if (confirm('Deseja realmente remover esta reserva do histórico?')) {
      try {
        await api.delete(`/reservas/${id}`);
        showToast('Reserva removida!', 'success');
        carregarReservas();
      } catch (e) {
        showToast('Erro ao remover reserva', 'error');
      }
    }
  };

  const formatarData = (dataStr: string) => {
    if (!dataStr) return '';
    const [ano, mes, dia] = dataStr.split('-');
    return `${dia}/${mes}/${ano}`;
  };

  const formatarMoeda = (valor: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(valor);
  };

  return (
    <div className="fade-in-up">
      <Header titulo="Reservas">
        <Link
          href="/reservas/novo"
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2.5 rounded-xl shadow-lg shadow-blue-600/20 transition-all duration-200 text-sm flex items-center gap-2"
        >
          <Plus size={16} /> Criar Reserva
        </Link>
      </Header>

      <div className="glass-card p-6 rounded-2xl shadow-sm">
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600"></div>
          </div>
        ) : reservas.length === 0 ? (
          <p className="text-sm text-slate-500 text-center py-8">Nenhuma reserva criada no sistema.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-slate-400 text-xs font-bold uppercase tracking-wider">
                  <th className="py-4 px-4">ID</th>
                  <th className="py-4 px-4">Hóspede</th>
                  <th className="py-4 px-4">Acomodação</th>
                  <th className="py-4 px-4">Período</th>
                  <th className="py-4 px-4">Check-in</th>
                  <th className="py-4 px-4">Total</th>
                  <th className="py-4 px-4">Status</th>
                  <th className="py-4 px-4 text-center">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {reservas.map((r) => {
                  let badgeClass = 'bg-slate-100 text-slate-800';
                  if (r.status === 'CONFIRMADA') badgeClass = 'bg-blue-100 text-blue-800';
                  else if (r.status === 'CONCLUIDA') badgeClass = 'bg-emerald-100 text-emerald-800';
                  else if (r.status === 'CANCELADA') badgeClass = 'bg-red-100 text-red-800';

                  return (
                    <tr key={r.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-4 px-4 font-semibold text-slate-500">#{r.id}</td>
                      <td className="py-4 px-4">
                        <div className="font-bold text-slate-900">{r.hospede?.nome || 'Desconhecido'}</div>
                        <span className="text-[10px] text-slate-400 font-medium">{r.hospede?.cpf}</span>
                      </td>
                      <td className="py-4 px-4">
                        <div className="font-semibold text-slate-800">Quarto {r.quarto?.numero}</div>
                        <span className="text-[10px] text-slate-400">{r.quarto?.tipo}</span>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-1 text-slate-700">
                          <Calendar size={14} className="text-slate-400" />
                          <span>
                            {formatarData(r.dataEntrada)} a {formatarData(r.dataSaida)}
                          </span>
                        </div>
                        <span className="text-[10px] text-slate-400 block mt-0.5">
                          {r.qtdAdultos} Ad / {r.qtdCriancas} Cr
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        {r.status !== 'CANCELADA' ? (
                          <label className="relative flex items-center cursor-pointer select-none">
                            <input
                              type="checkbox"
                              checked={r.checkinRealizado}
                              onChange={() => toggleCheckin(r)}
                              className="w-5 h-5 rounded-lg border-slate-300 text-blue-600 focus:ring-blue-500 focus:ring-2 cursor-pointer transition-all"
                            />
                            <span className="text-xs text-slate-500 font-semibold ml-2">
                              {r.checkinRealizado ? 'Realizado' : 'Pendente'}
                            </span>
                          </label>
                        ) : (
                          <span className="text-xs text-slate-400 italic">Cancelada</span>
                        )}
                      </td>
                      <td className="py-4 px-4 font-extrabold text-blue-600">{formatarMoeda(r.valorTotal)}</td>
                      <td className="py-4 px-4">
                        <span className={`inline-flex items-center text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${badgeClass}`}>
                          {r.status}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center justify-center gap-2">
                          <Link
                            href={`/reservas/${r.id}/editar`}
                            className="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
                            title="Editar"
                          >
                            <Edit2 size={16} />
                          </Link>
                          {r.status !== 'CANCELADA' && r.status !== 'CONCLUIDA' && (
                            <button
                              onClick={() => cancelarReserva(r.id)}
                              className="p-2 text-amber-500 hover:text-amber-700 hover:bg-amber-50 rounded-xl transition-all"
                              title="Cancelar Reserva"
                            >
                              <Ban size={16} />
                            </button>
                          )}
                          <button
                            onClick={() => deletarReserva(r.id)}
                            className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-xl transition-all"
                            title="Remover"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
