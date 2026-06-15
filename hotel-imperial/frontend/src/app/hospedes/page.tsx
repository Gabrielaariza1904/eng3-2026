'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import { api } from '@/services/api';
import { useToast } from '@/components/Toast';
import { Plus, Search, Edit2, ToggleLeft, ToggleRight, Trash2 } from 'lucide-react';

interface Estado {
  nome: string;
  uf: string;
}

interface Cidade {
  nome: string;
  estado: Estado;
}

interface Endereco {
  logradouro: string;
  numero: string;
  cep: string;
  bairro: string;
  complemento: string;
  cidade: Cidade;
}

interface Hospede {
  id: number;
  nome: string;
  cpf: string;
  email: string;
  telefone: string;
  inativo: boolean;
  endereco?: Endereco;
}

export default function HospedesLista() {
  const { showToast } = useToast();
  const [hospedes, setHospedes] = useState<Hospede[]>([]);
  const [busca, setBusca] = useState('');
  const [loading, setLoading] = useState(true);

  const carregarHospedes = async () => {
    try {
      const res = await api.get<Hospede[]>('/hospedes');
      setHospedes(res.data);
    } catch (e) {
      showToast('Erro ao carregar hóspedes', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarHospedes();
  }, []);

  const alternarStatus = async (hospede: Hospede) => {
    try {
      if (hospede.inativo) {
        await api.patch(`/hospedes/${hospede.id}/reativar`);
        showToast(`Hóspede ${hospede.nome} reativado!`, 'success');
      } else {
        await api.delete(`/hospedes/${hospede.id}`);
        showToast(`Hóspede ${hospede.nome} inativado!`, 'success');
      }
      carregarHospedes();
    } catch (e) {
      showToast('Erro ao alternar status do hóspede', 'error');
    }
  };

  const deletarHospede = async (id: number) => {
    if (confirm('Deseja realmente remover este hóspede?')) {
      try {
        // Concrete delete from DB if fallback handles or deletes
        await api.delete(`/hospedes/${id}`);
        showToast('Hóspede removido com sucesso!', 'success');
        carregarHospedes();
      } catch (e) {
        showToast('Erro ao remover hóspede', 'error');
      }
    }
  };

  const hospedesFiltrados = hospedes.filter(
    (h) =>
      h.nome.toLowerCase().includes(busca.toLowerCase()) ||
      h.cpf.includes(busca)
  );

  return (
    <div className="fade-in-up">
      <Header titulo="Hóspedes">
        <Link
          href="/hospedes/novo"
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2.5 rounded-xl shadow-lg shadow-blue-600/20 transition-all duration-200 text-sm flex items-center gap-2"
        >
          <Plus size={16} /> Novo Hóspede
        </Link>
      </Header>

      <div className="glass-card p-6 rounded-2xl shadow-sm mb-6">
        {/* Barra de Busca */}
        <div className="relative mb-6">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
            <Search size={18} />
          </span>
          <input
            type="text"
            placeholder="Buscar por nome ou CPF..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className="w-full border border-slate-200 rounded-xl p-3 pl-10 bg-slate-50 text-slate-800 text-sm transition-all focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
          />
        </div>

        {/* Tabela de Hóspedes */}
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600"></div>
          </div>
        ) : hospedesFiltrados.length === 0 ? (
          <p className="text-sm text-slate-500 text-center py-8">Nenhum hóspede cadastrado ou correspondente encontrado.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-slate-400 text-xs font-bold uppercase tracking-wider">
                  <th className="py-4 px-4">ID</th>
                  <th className="py-4 px-4">Nome</th>
                  <th className="py-4 px-4">CPF</th>
                  <th className="py-4 px-4">E-mail</th>
                  <th className="py-4 px-4">Telefone</th>
                  <th className="py-4 px-4">Cidade / UF</th>
                  <th className="py-4 px-4">Status</th>
                  <th className="py-4 px-4 text-center">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {hospedesFiltrados.map((h) => (
                  <tr key={h.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-4 px-4 font-semibold text-slate-500">#{h.id}</td>
                    <td className="py-4 px-4 font-bold text-slate-900">{h.nome}</td>
                    <td className="py-4 px-4">{h.cpf}</td>
                    <td className="py-4 px-4">{h.email}</td>
                    <td className="py-4 px-4">{h.telefone}</td>
                    <td className="py-4 px-4">
                      {h.endereco?.cidade?.nome ? `${h.endereco.cidade.nome} - ${h.endereco.cidade.estado.uf}` : '-'}
                    </td>
                    <td className="py-4 px-4">
                      <button
                        onClick={() => alternarStatus(h)}
                        title={h.inativo ? 'Reativar' : 'Inativar'}
                        className={`inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${
                          h.inativo
                            ? 'bg-red-100 text-red-800'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {h.inativo ? 'Inativo ❌' : 'Ativo ✅'}
                      </button>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center justify-center gap-2">
                        <Link
                          href={`/hospedes/${h.id}/editar`}
                          className="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
                          title="Editar"
                        >
                          <Edit2 size={16} />
                        </Link>
                        <button
                          onClick={() => alternarStatus(h)}
                          className={`p-2 rounded-xl transition-all ${
                            h.inativo ? 'text-emerald-500 hover:bg-emerald-50' : 'text-amber-500 hover:bg-amber-50'
                          }`}
                          title={h.inativo ? 'Reativar' : 'Inativar'}
                        >
                          {h.inativo ? <ToggleLeft size={20} /> : <ToggleRight size={20} />}
                        </button>
                        <button
                          onClick={() => deletarHospede(h.id)}
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
