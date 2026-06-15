import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import { ToastProvider } from "@/components/Toast";

const inter = Inter({ 
  subsets: ["latin"], 
  variable: "--font-sans" 
});

const outfit = Outfit({ 
  subsets: ["latin"], 
  variable: "--font-heading" 
});

export const metadata: Metadata = {
  title: "Hotel Imperial - Painel de Controle",
  description: "Sistema de gerenciamento de reservas, hóspedes e pagamentos.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`${inter.variable} ${outfit.variable}`}>
      <body className="bg-slate-50 min-h-screen flex font-sans">
        <ToastProvider>
          <Sidebar />
          <main className="flex-1 p-8 overflow-y-auto max-h-screen bg-slate-50">
            {children}
          </main>
        </ToastProvider>
      </body>
    </html>
  );
}
