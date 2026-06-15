'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, KeyRound, Users, Bed, CreditCard, Tag, ScrollText, RotateCcw } from 'lucide-react';

export default function Sidebar() {
  const pathname = usePathname();

  const menuItems = [
    { name: 'Painel Geral', href: '/', icon: LayoutDashboard, category: 'Principal' },
    { name: 'Reservas', href: '/reservas', icon: KeyRound, category: 'Operações' },
    { name: 'Hóspedes', href: '/hospedes', icon: Users, category: 'Operações' },
    { name: 'Quartos', href: '/quartos', icon: Bed, category: 'Operações' },
    { name: 'Pagamentos', href: '/pagamentos', icon: CreditCard, category: 'Operações' },
    { name: 'Promoções', href: '/promocoes', icon: Tag, category: 'Configurações' },
    { name: 'Políticas Cancel.', href: '/politicas', icon: ScrollText, category: 'Configurações' },
  ];

  const resetDB = () => {
    if (confirm('Deseja reiniciar todo o banco de dados local para os valores originais de teste?')) {
      localStorage.removeItem('hotel_imperial_fallback_db');
      window.location.reload();
    }
  };

  const categories = ['Principal', 'Operações', 'Configurações'];

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <aside className="w-64 dark-glass-sidebar text-slate-300 flex flex-col shrink-0 min-h-screen z-20">
      <div className="h-20 flex items-center px-6 border-b border-slate-800 gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white text-xl font-black shadow-lg shadow-blue-500/20">
          H
        </div>
        <div>
          <h1 className="text-lg font-bold text-white leading-tight">Hotel Imperial</h1>
          <span className="text-xs text-slate-500 font-medium">Painel de Controle</span>
        </div>
      </div>
      
      <nav className="flex-1 px-4 py-6 space-y-4 overflow-y-auto">
        {categories.map((cat) => (
          <div key={cat} className="space-y-1">
            <span className="px-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-2">
              {cat}
            </span>
            {menuItems
              .filter((item) => item.category === cat)
              .map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-3 py-2.5 px-3 rounded-xl transition-all duration-200 text-sm font-medium ${
                      active
                        ? 'bg-blue-600 text-white shadow-md shadow-blue-600/15'
                        : 'hover:bg-slate-800/60 hover:text-white'
                    }`}
                  >
                    <Icon size={18} className={active ? 'text-white' : 'text-slate-400'} />
                    {item.name}
                  </Link>
                );
              })}
          </div>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-800 flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-white text-sm">
          AD
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-white truncate">Admin Imperial</p>
          <p className="text-xs text-slate-500 truncate">admin@imperial.com</p>
        </div>
        <button
          onClick={resetDB}
          title="Reiniciar Banco de Dados"
          className="text-slate-500 hover:text-red-400 p-1 transition-colors"
        >
          <RotateCcw size={16} />
        </button>
      </div>
    </aside>
  );
}
