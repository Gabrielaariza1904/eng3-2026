'use client';

import React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import Header from '@/components/Header';
import PromocaoForm from '@/components/PromocaoForm';
import { ArrowLeft } from 'lucide-react';

export default function EditarPromocao() {
  const params = useParams();
  const id = params.id ? parseInt(params.id as string) : undefined;

  return (
    <div className="fade-in-up">
      <Header titulo="Editar Promoção">
        <Link
          href="/promocoes"
          className="text-blue-600 hover:text-blue-800 font-semibold text-sm flex items-center gap-1.5"
        >
          <ArrowLeft size={16} /> Voltar para Lista
        </Link>
      </Header>
      
      <PromocaoForm id={id} />
    </div>
  );
}
