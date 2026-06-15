'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import { api } from '@/services/api';
import { useToast } from '@/components/Toast';
import { ArrowLeft, CreditCard } from 'lucide-react';

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
  valorTotal: number;
  status: string;
}

interface PagamentoForm {
  reserva: { id: number } | null;
  valor: number;
  formaPagamento: string;
  status: string;
}

export default function LancarPagamento() {
  const router = useRouter();
  const { showToast } = useToast();

  const [reservas, setReservas] = useState<Reserva[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState<PagamentoForm>({
    reserva: null,
    valor: 0,
    formaPagamento: 'Pix',
    status: 'APROVADO',
  });

  useEffect(() => {
    const carregarReservas = async () => {
      try {
        const res = await api.get<Reserva[]>('/reservas');
        // Filter out cancelled ones
        setReservas(res.data.filter(r => r.status !== 'CANCELADA'));
      } catch (e) {
        showToast('Erro ao carregar reservas', 'error');
      } finally {
        setLoading(false);
      }
    };
    carregarConfiguracoes();
  }, []);

  // To support compilation
  const carregarConfiguracoes = async () => {
    try {
      const res = await api.get<Reserva[]>('/reservas');
      setReservas(res.data.filter(r => r.status !== 'CANCELADA'));
    } catch (e) {
      showToast('Erro ao carregar reservas', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleReservaChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const rId = parseInt(e.target.value);
    if (!rId) {
      setFormData(prev => ({ ...prev, reserva: null, valor: 0 }));
      return;
    }
    const res = reservas.find(r => r.id === rId);
    setFormData(prev => ({
      ...prev,
      reserva: { id: rId },
      valor: res ? res.valorTotal : 0
    }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'valor' ? parseFloat(value) || 0 : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.reserva) {
      showToast('Por favor, selecione uma reserva!', 'error');
      return;
    }
    if (formData.valor <= 0) {
      showToast('O valor do pagamento deve ser maior que zero!', 'error');
      return;
    }

    setSubmitting(true);
    try {
      await api.post('/pagamentos', formData);
      showToast('Pagamento registrado com sucesso!', 'success');
      router.push('/pagamentos');
    } catch (err: any) {
      const errMsg = err.response?.data?.erro || 'Erro ao registrar pagamento';
      showToast(errMsg, 'error');
    } finally {
      setSubmitting(false);
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
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="fade-in-up">
      <Header titulo="Registrar Pagamento">
        <Link
          href="/pagamentos"
          className="text-blue-600 hover:text-blue-800 font-semibold text-sm flex items-center gap-1.5"
        >
          <ArrowLeft size={16} /> Voltar para Lista
        </Link>
      </Header>

      <form onSubmit={handleSubmit} className="space-y-6 max-w-xl mx-auto glass-card p-8 rounded-2xl shadow-sm">
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-2">Reserva Relacionada *</label>
            <select
              required
              onChange={handleReservaChange}
              value={formData.reserva?.id || ''}
              className="w-full border border-slate-200 rounded-xl p-3 bg-slate-50 text-slate-800 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
            >
              <option value="">Selecione a Reserva...</option>
              {reservas.map(r => (
                <option key={r.id} value={r.id}>
                  Reserva #{r.id} - {r.hospede?.nome} (Quarto {r.quarto?.numero} - Valor: {formatarMoeda(r.valorTotal)})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-2">Valor Pago (R$) *</label>
            <input
              type="number"
              name="valor"
              min="0.01"
              step="0.01"
              required
              value={formData.valor || ''}
              onChange={handleChange}
              className="w-full border border-slate-200 rounded-xl p-3 bg-slate-50 text-slate-800 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
              placeholder="Digite o valor pago..."
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-2">Forma de Pagamento *</label>
            <select
              name="formaPagamento"
              required
              value={formData.formaPagamento}
              onChange={handleChange}
              className="w-full border border-slate-200 rounded-xl p-3 bg-slate-50 text-slate-800 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
            >
              <option value="Pix">Pix</option>
              <option value="Cartão de Crédito">Cartão de Crédito</option>
              <option value="Cartão de Débito">Cartão de Débito</option>
              <option value="Dinheiro">Dinheiro</option>
              <option value="Transferência Bancária">Transferência Bancária</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-2">Status da Transação *</label>
            <select
              name="status"
              required
              value={formData.status}
              onChange={handleChange}
              className="w-full border border-slate-200 rounded-xl p-3 bg-slate-50 text-slate-800 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
            >
              <option value="APROVADO">Aprovado (Confirmado)</option>
              <option value="PENDENTE">Pendente</option>
              <option value="NEGADO">Negado / Recusado</option>
            </select>
          </div>
        </div>

        <div className="flex justify-end gap-3 border-t border-slate-100 pt-6">
          <button
            type="button"
            onClick={() => router.push('/pagamentos')}
            className="px-6 py-3 border border-slate-200 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-all"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white font-semibold rounded-xl text-sm shadow-lg shadow-emerald-600/15 transition-all flex items-center gap-2"
          >
            <CreditCard size={16} /> {submitting ? 'Registrando...' : 'Registrar Pagamento'}
          </button>
        </div>
      </form>
    </div>
  );
}
