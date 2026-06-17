'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/components/Toast';
import { api } from '@/services/api';

interface Quarto {
  id?: number;
  numero: string;
  tipo: string;
  capacidadeAdultos: number;
  capacidadeCriancas: number;
  valorDiaria: number;
  status: 'DISPONIVEL' | 'OCUPADO' | 'MANUTENCAO';
}

interface QuartoFormProps {
  id?: number;
}

export default function QuartoForm({ id }: QuartoFormProps) {
  const router = useRouter();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<Quarto>({
    numero: '',
    tipo: 'Standard Casal',
    capacidadeAdultos: 2,
    capacidadeCriancas: 1,
    valorDiaria: 150.00,
    status: 'DISPONIVEL',
  });

  useEffect(() => {
    if (id) {
      setLoading(true);
      api.get<Quarto>(`/quartos/${id}`)
        .then((res) => {
          setFormData(res.data);
        })
        .catch(() => {
          showToast('Erro ao carregar quarto para edição', 'error');
        })
        .finally(() => setLoading(false));
    }
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'capacidadeAdultos' || name === 'capacidadeCriancas' || name === 'valorDiaria'
        ? parseFloat(value) || 0
        : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (id) {
        await api.put(`/quartos/${id}`, formData);
        showToast('Quarto atualizado com sucesso!', 'success');
      } else {
        await api.post('/quartos', formData);
        showToast('Quarto cadastrado com sucesso!', 'success');
      }
      router.push('/quartos');
    } catch (err: any) {
      const errMsg = err.response?.data?.erro || 'Erro ao salvar quarto';
      showToast(errMsg, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto glass-card p-8 rounded-2xl shadow-sm fade-in-up">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-2">Número do Quarto *</label>
          <input
            type="text"
            name="numero"
            required
            value={formData.numero}
            onChange={handleChange}
            className="w-full border border-slate-200 rounded-xl p-3 bg-slate-50 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none"
            placeholder="Ex: 101, 204..."
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-2">Tipo de Quarto *</label>
          <select
            name="tipo"
            required
            value={formData.tipo}
            onChange={handleChange}
            className="w-full border border-slate-200 rounded-xl p-3 bg-slate-50 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none"
          >
            <option value="Standard Casal">Standard Casal</option>
            <option value="Standard Solteiro">Standard Solteiro</option>
            <option value="Luxo Casal">Luxo Casal</option>
            <option value="Luxo Duplo">Luxo Duplo</option>
            <option value="Suíte Master">Suíte Master</option>
            <option value="Suíte Premium">Suíte Premium</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-2">Capacidade Adultos *</label>
          <input
            type="number"
            name="capacidadeAdultos"
            min="1"
            required
            value={formData.capacidadeAdultos}
            onChange={handleChange}
            className="w-full border border-slate-200 rounded-xl p-3 bg-slate-50 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-2">Capacidade Crianças</label>
          <input
            type="number"
            name="capacidadeCriancas"
            min="0"
            required
            value={formData.capacidadeCriancas}
            onChange={handleChange}
            className="w-full border border-slate-200 rounded-xl p-3 bg-slate-50 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-2">Valor da Diária (R$) *</label>
          <input
            type="number"
            name="valorDiaria"
            min="0.01"
            step="0.01"
            required
            value={formData.valorDiaria}
            onChange={handleChange}
            className="w-full border border-slate-200 rounded-xl p-3 bg-slate-50 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-2">Status Operacional *</label>
          <select
            name="status"
            required
            value={formData.status}
            onChange={handleChange}
            className="w-full border border-slate-200 rounded-xl p-3 bg-slate-50 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none"
          >
            <option value="DISPONIVEL">Disponível</option>
            <option value="OCUPADO">Ocupado</option>
            <option value="MANUTENCAO">Manutenção</option>
          </select>
        </div>
      </div>

      <div className="flex justify-end gap-3 border-t border-slate-100 pt-6">
        <button
          type="button"
          onClick={() => router.push('/quartos')}
          className="px-6 py-3 border border-slate-200 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-all"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold rounded-xl text-sm shadow-lg shadow-blue-600/15 transition-all"
        >
          {loading ? 'Salvando...' : 'Salvar Quarto'}
        </button>
      </div>
    </form>
  );
}
