'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/components/Toast';
import { api } from '@/services/api';

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
  id?: number;
  nome: string;
  cpf: string;
  email: string;
  telefone: string;
  inativo: boolean;
  endereco: Endereco;
}

interface HospedeFormProps {
  id?: number;
}

export default function HospedeForm({ id }: HospedeFormProps) {
  const router = useRouter();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<Hospede>({
    nome: '',
    cpf: '',
    email: '',
    telefone: '',
    inativo: false,
    endereco: {
      logradouro: '',
      numero: '',
      cep: '',
      bairro: '',
      complemento: '',
      cidade: {
        nome: '',
        estado: {
          nome: '',
          uf: ''
        }
      }
    }
  });

  useEffect(() => {
    if (id) {
      setLoading(true);
      api.get<Hospede>(`/hospedes/${id}`)
        .then((res) => {
          setFormData(res.data);
        })
        .catch(() => {
          showToast('Erro ao carregar hóspede para edição', 'error');
        })
        .finally(() => setLoading(false));
    }
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name.startsWith('endereco.cidade.estado.')) {
      const field = name.split('.').pop() || '';
      setFormData((prev) => ({
        ...prev,
        endereco: {
          ...prev.endereco,
          cidade: {
            ...prev.endereco.cidade,
            estado: {
              ...prev.endereco.cidade.estado,
              [field]: value,
              // Auto fill state name if standard UF
              ...(field === 'uf' ? { nome: getNomeEstado(value) } : {})
            }
          }
        }
      }));
    } else if (name.startsWith('endereco.cidade.')) {
      const field = name.split('.').pop() || '';
      setFormData((prev) => ({
        ...prev,
        endereco: {
          ...prev.endereco,
          cidade: {
            ...prev.endereco.cidade,
            [field]: value
          }
        }
      }));
    } else if (name.startsWith('endereco.')) {
      const field = name.split('.').pop() || '';
      setFormData((prev) => ({
        ...prev,
        endereco: {
          ...prev.endereco,
          [field]: value
        }
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const getNomeEstado = (uf: string) => {
    const states: Record<string, string> = {
      SP: 'São Paulo',
      RJ: 'Rio de Janeiro',
      MG: 'Minas Gerais',
      PR: 'Paraná',
      SC: 'Santa Catarina',
      RS: 'Rio Grande do Sul',
      ES: 'Espírito Santo',
      BA: 'Bahia'
    };
    return states[uf] || '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (id) {
        await api.put(`/hospedes/${id}`, formData);
        showToast('Hóspede atualizado com sucesso!', 'success');
      } else {
        await api.post('/hospedes', formData);
        showToast('Hóspede cadastrado com sucesso!', 'success');
      }
      router.push('/hospedes');
    } catch (err: any) {
      const errMsg = err.response?.data?.erro || 'Erro ao salvar hóspede';
      showToast(errMsg, 'error');
    } finally {
      setLoading(false);
    }
  };

  if (loading && id) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl mx-auto glass-card p-8 rounded-2xl shadow-sm fade-in-up">
      {/* Dados Pessoais */}
      <div>
        <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4 border-b border-slate-100 pb-2">
          Dados Pessoais
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-2">Nome Completo *</label>
            <input
              type="text"
              name="nome"
              required
              value={formData.nome}
              onChange={handleChange}
              className="w-full border border-slate-200 rounded-xl p-3 bg-slate-50 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none"
              placeholder="Digite o nome completo..."
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-2">CPF *</label>
            <input
              type="text"
              name="cpf"
              required
              value={formData.cpf}
              onChange={handleChange}
              className="w-full border border-slate-200 rounded-xl p-3 bg-slate-50 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none"
              placeholder="000.000.000-00"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-2">E-mail *</label>
            <input
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="w-full border border-slate-200 rounded-xl p-3 bg-slate-50 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none"
              placeholder="exemplo@email.com"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-2">Telefone *</label>
            <input
              type="text"
              name="telefone"
              required
              value={formData.telefone}
              onChange={handleChange}
              className="w-full border border-slate-200 rounded-xl p-3 bg-slate-50 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none"
              placeholder="(00) 00000-0000"
            />
          </div>
        </div>
      </div>

      {/* Endereço */}
      <div>
        <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4 border-b border-slate-100 pb-2">
          Endereço Residencial
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-2">CEP *</label>
            <input
              type="text"
              name="endereco.cep"
              required
              value={formData.endereco.cep}
              onChange={handleChange}
              className="w-full border border-slate-200 rounded-xl p-3 bg-slate-50 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none"
              placeholder="00000-000"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-slate-600 mb-2">Logradouro *</label>
            <input
              type="text"
              name="endereco.logradouro"
              required
              value={formData.endereco.logradouro}
              onChange={handleChange}
              className="w-full border border-slate-200 rounded-xl p-3 bg-slate-50 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none"
              placeholder="Rua, Avenida, Praça..."
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-2">Número *</label>
            <input
              type="text"
              name="endereco.numero"
              required
              value={formData.endereco.numero}
              onChange={handleChange}
              className="w-full border border-slate-200 rounded-xl p-3 bg-slate-50 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none"
              placeholder="Nº"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-2">Bairro *</label>
            <input
              type="text"
              name="endereco.bairro"
              required
              value={formData.endereco.bairro}
              onChange={handleChange}
              className="w-full border border-slate-200 rounded-xl p-3 bg-slate-50 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none"
              placeholder="Digite o bairro..."
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-2">Complemento</label>
            <input
              type="text"
              name="endereco.complemento"
              value={formData.endereco.complemento}
              onChange={handleChange}
              className="w-full border border-slate-200 rounded-xl p-3 bg-slate-50 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none"
              placeholder="Apto, Sala, Bloco..."
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-slate-600 mb-2">Cidade *</label>
            <input
              type="text"
              name="endereco.cidade.nome"
              required
              value={formData.endereco.cidade.nome}
              onChange={handleChange}
              className="w-full border border-slate-200 rounded-xl p-3 bg-slate-50 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none"
              placeholder="Digite a cidade..."
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-2">Estado (UF) *</label>
            <select
              name="endereco.cidade.estado.uf"
              required
              value={formData.endereco.cidade.estado.uf}
              onChange={handleChange}
              className="w-full border border-slate-200 rounded-xl p-3 bg-slate-50 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none"
            >
              <option value="">Selecione...</option>
              <option value="SP">SP</option>
              <option value="RJ">RJ</option>
              <option value="MG">MG</option>
              <option value="PR">PR</option>
              <option value="SC">SC</option>
              <option value="RS">RS</option>
              <option value="ES">ES</option>
              <option value="BA">BA</option>
            </select>
          </div>
        </div>
      </div>

      {/* Ações */}
      <div className="flex justify-end gap-3 border-t border-slate-100 pt-6">
        <button
          type="button"
          onClick={() => router.push('/hospedes')}
          className="px-6 py-3 border border-slate-200 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-all"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold rounded-xl text-sm shadow-lg shadow-blue-600/15 transition-all"
        >
          {loading ? 'Salvando...' : 'Salvar Hóspede'}
        </button>
      </div>
    </form>
  );
}
