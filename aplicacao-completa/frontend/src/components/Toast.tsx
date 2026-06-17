'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, XCircle, Info, X } from 'lucide-react';

type ToastType = 'success' | 'error' | 'info';

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((message: string, type: ToastType = 'success') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  }, []);

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed top-6 right-6 z-50 flex flex-col gap-3 pointer-events-none">
        {toasts.map((toast) => {
          let bgClass = 'bg-gradient-to-r from-emerald-500 to-emerald-600 border-emerald-700';
          let Icon = CheckCircle2;
          if (toast.type === 'error') {
            bgClass = 'bg-gradient-to-r from-red-500 to-red-600 border-red-700';
            Icon = XCircle;
          } else if (toast.type === 'info') {
            bgClass = 'bg-gradient-to-r from-blue-500 to-blue-600 border-blue-700';
            Icon = Info;
          }

          return (
            <div
              key={toast.id}
              style={{
                animation: 'slideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards',
              }}
              className={`min-w-[300px] max-w-[450px] p-4 rounded-xl shadow-lg border-l-4 text-white text-sm font-medium flex items-center justify-between gap-3 pointer-events-auto ${bgClass}`}
            >
              <div className="flex items-center gap-3">
                <Icon size={20} className="shrink-0" />
                <span>{toast.message}</span>
              </div>
              <button onClick={() => removeToast(toast.id)} className="text-white/80 hover:text-white shrink-0">
                <X size={16} />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}
