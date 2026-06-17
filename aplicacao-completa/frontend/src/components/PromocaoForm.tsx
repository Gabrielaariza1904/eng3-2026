'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/components/Toast';
import { api } from '@/services/api';

interface Promocao {
  id?: number;
  codigo: string;
  descricao: string;
  descontoPercentual: number;
  inativo: boolean;
}

interface PromocaoFormProps {
  id?: number;
}

export default function PromocaoForm({ id }: PromocaoFormProps) {
  const router = useRouter();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<Promocao>({
    codigo: '',
    descricao: '',
    descontoPercentual: 10,
    inativo: false,
  });

  useEffect(() => {
    if (id) {
      setLoading(true);
      api.get<Promocao>(`/promocoes/${id}`)
        .then((res) => {
          setFormData(res.data);
        })
        .catch(() => {
          showToast('Erro ao carregar promoção para edição', 'error');
        })
        .finally(() => setLoading(false));
    }
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'descontoPercentual' ? parseFloat(value) || 0 : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (id) {
        await api.put(`/promocoes/${id}`, formData);
        showToast('Promoção atualizada com sucesso!', 'success');
      } else {
        await api.post('/promocoes', formData);
        showToast('Promoção cadastrada com sucesso!', 'success');
      }
      router.push('/promocoes');
    } catch (err: any) {
      const errMsg = err.response?.data?.erro || 'Erro ao salvar promoção';
      showToast(errMsg, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-xl mx-auto glass-card p-8 rounded-2xl shadow-sm fade-in-up">
      <div className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-2">Código do Cupom *</label>
          <input
            type="text"
            name="codigo"
            required
            value={formData.codigo}
            onChange={handleChange}
            className="w-full border border-slate-200 rounded-xl p-3 bg-slate-50 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none uppercase"
            placeholder="Ex: CUPOM10"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-2">Descrição da Promoção *</label>
          <input
            type="text"
            name="descricao"
            required
            value={formData.descricao}
            onChange={handleChange}
            className="w-full border border-slate-200 rounded-xl p-3 bg-slate-50 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none"
            placeholder="Ex: Desconto de Primavera..."
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-2">Desconto (%) *</label>
          <input
            type="number"
            name="descontoPercentual"
            min="0.1"
            max="100"
            step="0.1"
            required
            value={formData.descontoPercentual}
            onChange={handleChange}
            className="w-full border border-slate-200 rounded-xl p-3 bg-slate-50 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none"
          />
        </div>
      </div>

      <div className="flex justify-end gap-3 border-t border-slate-100 pt-6">
        <button
          type="button"
          onClick={() => router.push('/promocoes')}
          className="px-6 py-3 border border-slate-200 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-all"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold rounded-xl text-sm shadow-lg shadow-blue-600/15 transition-all"
        >
          {loading ? 'Salvando...' : 'Salvar Promoção'}
        </button>
      </div>
    </form>
  );
}
