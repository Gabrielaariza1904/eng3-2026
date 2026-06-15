'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import { api } from '@/services/api';
import { useToast } from '@/components/Toast';
import { Plus, CreditCard, Check, X, Calendar, Trash2 } from 'lucide-react';

interface Hospede {
  nome: string;
}

interface Quarto {
  numero: string;
}

interface Reserva {
  id: number;
  hospede: Hospede;
  quarto: Quarto;
}

interface Pagamento {
  id: number;
  reserva: Reserva;
  dataPagamento: string;
  valor: number;
  status: 'PENDENTE' | 'APROVADO' | 'NEGADO' | 'ESTORNADO';
  formaPagamento: string;
}

export default function PagamentosLista() {
  const { showToast } = useToast();
  const [pagamentos, setPagamentos] = useState<Pagamento[]>([]);
  const [loading, setLoading] = useState(true);

  const carregarPagamentos = async () => {
    try {
      const res = await api.get<Pagamento[]>('/pagamentos');
      setPagamentos(res.data);
    } catch (e) {
      showToast('Erro ao carregar pagamentos', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarPagamentos();
  }, []);

  const deletarPagamento = async (id: number) => {
    if (confirm('Deseja realmente excluir este registro de pagamento?')) {
      try {
        await api.delete(`/pagamentos/${id}`);
        showToast('Registro de pagamento excluído!', 'success');
        carregarPagamentos();
      } catch (e) {
        showToast('Erro ao excluir pagamento', 'error');
      }
    }
  };

  const estornarPagamento = async (pagamento: Pagamento) => {
    if (confirm('Deseja estornar este pagamento?')) {
      try {
        await api.put(`/pagamentos/${pagamento.id}`, {
          ...pagamento,
          status: 'ESTORNADO',
        });
        showToast('Pagamento estornado com sucesso!', 'success');
        carregarPagamentos();
      } catch (e) {
        showToast('Erro ao estornar pagamento', 'error');
      }
    }
  };

  const formatarData = (dataStr: string) => {
    if (!dataStr) return '';
    const date = new Date(dataStr);
    return date.toLocaleString('pt-BR');
  };

  const formatarMoeda = (valor: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(valor);
  };

  return (
    <div className="fade-in-up">
      <Header titulo="Pagamentos">
        <Link
          href="/pagamentos/novo"
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2.5 rounded-xl shadow-lg shadow-blue-600/20 transition-all duration-200 text-sm flex items-center gap-2"
        >
          <Plus size={16} /> Lançar Pagamento
        </Link>
      </Header>

      <div className="glass-card p-6 rounded-2xl shadow-sm">
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600"></div>
          </div>
        ) : pagamentos.length === 0 ? (
          <p className="text-sm text-slate-500 text-center py-8">Nenhum pagamento registrado.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-slate-400 text-xs font-bold uppercase tracking-wider">
                  <th className="py-4 px-4">ID</th>
                  <th className="py-4 px-4">Reserva Vinculada</th>
                  <th className="py-4 px-4">Data / Hora</th>
                  <th className="py-4 px-4">Valor</th>
                  <th className="py-4 px-4">Forma de Pagamento</th>
                  <th className="py-4 px-4">Status</th>
                  <th className="py-4 px-4 text-center">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {pagamentos.map((p) => {
                  let badgeClass = 'bg-slate-100 text-slate-800';
                  if (p.status === 'APROVADO') badgeClass = 'bg-emerald-100 text-emerald-800';
                  else if (p.status === 'ESTORNADO') badgeClass = 'bg-amber-100 text-amber-800';
                  else if (p.status === 'NEGADO') badgeClass = 'bg-red-100 text-red-800';

                  return (
                    <tr key={p.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-4 px-4 font-semibold text-slate-500">#{p.id}</td>
                      <td className="py-4 px-4">
                        <div className="font-bold text-slate-900">
                          Reserva #{p.reserva?.id}
                        </div>
                        <span className="text-[10px] text-slate-400 font-medium">
                          Hóspede: {p.reserva?.hospede?.nome} (Quarto {p.reserva?.quarto?.numero})
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-1 text-slate-700">
                          <Calendar size={14} className="text-slate-400" />
                          <span>{formatarData(p.dataPagamento)}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4 font-extrabold text-emerald-600">{formatarMoeda(p.valor)}</td>
                      <td className="py-4 px-4 font-medium">{p.formaPagamento}</td>
                      <td className="py-4 px-4">
                        <span className={`inline-flex items-center text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${badgeClass}`}>
                          {p.status}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center justify-center gap-2">
                          {p.status === 'APROVADO' && (
                            <button
                              onClick={() => estornarPagamento(p)}
                              className="px-2.5 py-1.5 text-xs font-semibold bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200 rounded-xl transition-all"
                              title="Estornar Pagamento"
                            >
                              Estornar
                            </button>
                          )}
                          <button
                            onClick={() => deletarPagamento(p.id)}
                            className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-xl transition-all"
                            title="Remover Registro"
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
