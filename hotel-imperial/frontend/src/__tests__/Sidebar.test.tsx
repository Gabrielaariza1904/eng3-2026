import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Sidebar from '../components/Sidebar';

// Mock window.confirm
const originalConfirm = window.confirm;
beforeAll(() => {
  window.confirm = jest.fn(() => true);
});
afterAll(() => {
  window.confirm = originalConfirm;
});

describe('Sidebar Component', () => {
  it('renders Sidebar menu items and brand name', () => {
    render(<Sidebar />);
    expect(screen.getByText('Hotel Imperial')).toBeInTheDocument();
    expect(screen.getByText('Painel Geral')).toBeInTheDocument();
    expect(screen.getByText('Reservas')).toBeInTheDocument();
    expect(screen.getByText('Hóspedes')).toBeInTheDocument();
  });

  it('triggers confirmation on reset button click', () => {
    render(<Sidebar />);
    const resetBtn = screen.getByTitle('Reiniciar Banco de Dados');
    fireEvent.click(resetBtn);
    expect(window.confirm).toHaveBeenCalled();
  });
});
