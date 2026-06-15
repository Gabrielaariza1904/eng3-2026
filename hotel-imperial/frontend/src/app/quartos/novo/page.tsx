'use client';

import React from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import QuartoForm from '@/components/QuartoForm';
import { ArrowLeft } from 'lucide-react';

export default function NovoQuarto() {
  return (
    <div className="fade-in-up">
      <Header titulo="Cadastrar Quarto">
        <Link
          href="/quartos"
          className="text-blue-600 hover:text-blue-800 font-semibold text-sm flex items-center gap-1.5"
        >
          <ArrowLeft size={16} /> Voltar para Lista
        </Link>
      </Header>
      
      <QuartoForm />
    </div>
  );
}
