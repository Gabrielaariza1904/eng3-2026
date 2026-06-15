import React from 'react';

interface HeaderProps {
  titulo: string;
  subtitulo?: string;
  children?: React.ReactNode;
}

export default function Header({ titulo, subtitulo = 'Protótipo Funcional • Simulação Completa', children }: HeaderProps) {
  return (
    <header className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-8 border-b border-slate-200 pb-5">
      <div>
        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">{titulo}</h2>
        <p className="text-slate-500 text-sm mt-1">{subtitulo}</p>
      </div>
      <div className="flex items-center gap-3">
        {children}
      </div>
    </header>
  );
}
