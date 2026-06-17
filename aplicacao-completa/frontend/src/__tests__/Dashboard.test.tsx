import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import Dashboard from '../app/page';

// Mock API calls
jest.mock('../../src/services/api', () => ({
  api: {
    get: jest.fn((url: string) => {
      if (url.includes('/dashboard/kpis')) {
        return Promise.resolve({
          data: {
            activeGuests: 5,
            occupancyRate: 50,
            occupiedRooms: 3,
            totalRooms: 6,
            checkinsToday: 2,
            approvedRevenue: 1500.0,
          }
        });
      }
      if (url.includes('/quartos')) {
        return Promise.resolve({
          data: [
            { id: 1, numero: '101', tipo: 'Standard Casal', capacidadeAdultos: 2, capacidadeCriancas: 1, valorDiaria: 150.0, status: 'DISPONIVEL' }
          ]
        });
      }
      if (url.includes('/dashboard/atividades')) {
        return Promise.resolve({
          data: [
            { tipo: 'hospede', texto: 'Hóspede João foi cadastrado no sistema.', data: 'Hoje', icone: '👥', corIcone: 'bg-blue-100 text-blue-600' }
          ]
        });
      }
      return Promise.resolve({ data: [] });
    }),
    patch: jest.fn(() => Promise.resolve({ data: { sucesso: true } }))
  }
}));

// Mock useToast
jest.mock('../../src/components/Toast', () => ({
  useToast: () => ({
    showToast: jest.fn(),
  }),
  ToastProvider: ({ children }: any) => <div>{children}</div>,
}));

describe('Dashboard Page', () => {
  it('renders loading spin then loads page metrics and items', async () => {
    render(<Dashboard />);
    
    // Wait for elements to appear after resolve
    await waitFor(() => {
      expect(screen.getByText('Hóspedes Ativos')).toBeInTheDocument();
      expect(screen.getByText('5')).toBeInTheDocument(); // Active guests count
      expect(screen.getByText('50%')).toBeInTheDocument(); // Occupancy rate
      expect(screen.getByText('R$ 1.500,00')).toBeInTheDocument(); // Approved revenue
      expect(screen.getByText('101')).toBeInTheDocument(); // Room number
      expect(screen.getByText('Standard Casal')).toBeInTheDocument(); // Room type
    });
  });
});
