'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import { api } from '@/services/api';
import { useToast } from '@/components/Toast';
import { Plus, Edit2, ToggleLeft, ToggleRight, Trash2 } from 'lucide-react';

interface Promocao {
  id: number;
  codigo: string;
  descricao: string;
  descontoPercentual: number;
  inativo: boolean;
}

export default function PromocoesLista() {
  const { showToast } = useToast();
  const [promocoes, setPromocoes] = useState<Promocao[]>([]);
  const [loading, setLoading] = useState(true);

  const carregarPromocoes = async () => {
    try {
      const res = await api.get<Promocao[]>('/promocoes');
      setPromocoes(res.data);
    } catch (e) {
      showToast('Erro ao carregar promoções', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarPromocoes();
  }, []);

  const alternarStatus = async (promo: Promocao) => {
    try {
      if (promo.inativo) {
        await api.patch(`/promocoes/${promo.id}/reativar`);
        showToast(`Promoção ${promo.codigo} reativada!`, 'success');
      } else {
        await api.delete(`/promocoes/${promo.id}`);
        showToast(`Promoção ${promo.codigo} inativada!`, 'success');
      }
      carregarPromocoes();
    } catch (e) {
      showToast('Erro ao alternar status da promoção', 'error');
    }
  };

  const deletarPromo = async (id: number) => {
    if (confirm('Deseja realmente remover esta promoção?')) {
      try {
        await api.delete(`/promocoes/${id}`);
        showToast('Promoção removida com sucesso!', 'success');
        carregarPromocoes();
      } catch (e) {
        showToast('Erro ao remover promoção', 'error');
      }
    }
  };

  return (
    <div className="fade-in-up">
      <Header titulo="Promoções">
        <Link
          href="/promocoes/novo"
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2.5 rounded-xl shadow-lg shadow-blue-600/20 transition-all duration-200 text-sm flex items-center gap-2"
        >
          <Plus size={16} /> Novo Cupom
        </Link>
      </Header>

      <div className="glass-card p-6 rounded-2xl shadow-sm">
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600"></div>
          </div>
        ) : promocoes.length === 0 ? (
          <p className="text-sm text-slate-500 text-center py-8">Nenhuma promoção cadastrada.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-slate-400 text-xs font-bold uppercase tracking-wider">
                  <th className="py-4 px-4">ID</th>
                  <th className="py-4 px-4">Código</th>
                  <th className="py-4 px-4">Descrição</th>
                  <th className="py-4 px-4">Desconto (%)</th>
                  <th className="py-4 px-4">Status</th>
                  <th className="py-4 px-4 text-center">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {promocoes.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-4 px-4 font-semibold text-slate-500">#{p.id}</td>
                    <td className="py-4 px-4 font-black text-blue-600 text-base">{p.codigo}</td>
                    <td className="py-4 px-4 font-medium text-slate-900">{p.descricao}</td>
                    <td className="py-4 px-4 font-bold text-slate-800">{p.descontoPercentual}% Off</td>
                    <td className="py-4 px-4">
                      <button
                        onClick={() => alternarStatus(p)}
                        title={p.inativo ? 'Reativar' : 'Inativar'}
                        className={`inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${
                          p.inativo ? 'bg-red-100 text-red-800' : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {p.inativo ? 'Inativo ❌' : 'Ativo ✅'}
                      </button>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center justify-center gap-2">
                        <Link
                          href={`/promocoes/${p.id}/editar`}
                          className="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
                          title="Editar"
                        >
                          <Edit2 size={16} />
                        </Link>
                        <button
                          onClick={() => alternarStatus(p)}
                          className={`p-2 rounded-xl transition-all ${
                            p.inativo ? 'text-emerald-500 hover:bg-emerald-50' : 'text-amber-500 hover:bg-amber-50'
                          }`}
                          title={p.inativo ? 'Reativar' : 'Inativar'}
                        >
                          {p.inativo ? <ToggleLeft size={20} /> : <ToggleRight size={20} />}
                        </button>
                        <button
                          onClick={() => deletarPromo(p.id)}
                          className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-xl transition-all"
                          title="Excluir"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
