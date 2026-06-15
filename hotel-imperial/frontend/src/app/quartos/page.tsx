'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import { api } from '@/services/api';
import { useToast } from '@/components/Toast';
import { Plus, Edit2, Trash2 } from 'lucide-react';

interface Quarto {
  id: number;
  numero: string;
  tipo: string;
  capacidadeAdultos: number;
  capacidadeCriancas: number;
  valorDiaria: number;
  status: 'DISPONIVEL' | 'OCUPADO' | 'MANUTENCAO';
}

export default function QuartosLista() {
  const { showToast } = useToast();
  const [quartos, setQuartos] = useState<Quarto[]>([]);
  const [loading, setLoading] = useState(true);

  const carregarQuartos = async () => {
    try {
      const res = await api.get<Quarto[]>('/quartos');
      setQuartos(res.data);
    } catch (e) {
      showToast('Erro ao carregar quartos', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarQuartos();
  }, []);

  const deletarQuarto = async (id: number) => {
    if (confirm('Deseja realmente excluir este quarto?')) {
      try {
        await api.delete(`/quartos/${id}`);
        showToast('Quarto excluído com sucesso!', 'success');
        carregarQuartos();
      } catch (e) {
        showToast('Erro ao excluir quarto', 'error');
      }
    }
  };

  const formatarMoeda = (valor: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(valor);
  };

  return (
    <div className="fade-in-up">
      <Header titulo="Quartos">
        <Link
          href="/quartos/novo"
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2.5 rounded-xl shadow-lg shadow-blue-600/20 transition-all duration-200 text-sm flex items-center gap-2"
        >
          <Plus size={16} /> Novo Quarto
        </Link>
      </Header>

      <div className="glass-card p-6 rounded-2xl shadow-sm">
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600"></div>
          </div>
        ) : quartos.length === 0 ? (
          <p className="text-sm text-slate-500 text-center py-8">Nenhum quarto cadastrado.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-slate-400 text-xs font-bold uppercase tracking-wider">
                  <th className="py-4 px-4">ID</th>
                  <th className="py-4 px-4">Número</th>
                  <th className="py-4 px-4">Tipo</th>
                  <th className="py-4 px-4">Capacidade (Ad / Cr)</th>
                  <th className="py-4 px-4">Valor Diária</th>
                  <th className="py-4 px-4">Status</th>
                  <th className="py-4 px-4 text-center">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {quartos.map((q) => {
                  let badgeClass = '';
                  let badgeText = '';
                  if (q.status === 'DISPONIVEL') {
                    badgeClass = 'bg-emerald-100 text-emerald-850';
                    badgeText = 'Disponível';
                  } else if (q.status === 'OCUPADO') {
                    badgeClass = 'bg-red-100 text-red-850';
                    badgeText = 'Ocupado';
                  } else {
                    badgeClass = 'bg-amber-100 text-amber-850';
                    badgeText = 'Manutenção';
                  }

                  return (
                    <tr key={q.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-4 px-4 font-semibold text-slate-500">#{q.id}</td>
                      <td className="py-4 px-4 font-bold text-slate-900">{q.numero}</td>
                      <td className="py-4 px-4">{q.tipo}</td>
                      <td className="py-4 px-4">
                        {q.capacidadeAdultos} Adultos / {q.capacidadeCriancas} Crianças
                      </td>
                      <td className="py-4 px-4 font-semibold text-slate-800">{formatarMoeda(q.valorDiaria)}</td>
                      <td className="py-4 px-4">
                        <span className={`inline-flex items-center text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${badgeClass}`}>
                          {badgeText}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center justify-center gap-2">
                          <Link
                            href={`/quartos/${q.id}/editar`}
                            className="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
                            title="Editar"
                          >
                            <Edit2 size={16} />
                          </Link>
                          <button
                            onClick={() => deletarQuarto(q.id)}
                            className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-xl transition-all"
                            title="Excluir"
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
