import React from 'react';
import { render, screen } from '@testing-library/react';
import Header from '../components/Header';

describe('Header Component', () => {
  it('renders the title and default subtitle', () => {
    render(<Header titulo="Teste de Título" />);
    expect(screen.getByText('Teste de Título')).toBeInTheDocument();
    expect(screen.getByText('Protótipo Funcional • Simulação Completa')).toBeInTheDocument();
  });

  it('renders a custom subtitle and children buttons', () => {
    render(
      <Header titulo="Painel" subtitulo="Custom Subtitle">
        <button data-testid="action-btn">Clique</button>
      </Header>
    );
    expect(screen.getByText('Painel')).toBeInTheDocument();
    expect(screen.getByText('Custom Subtitle')).toBeInTheDocument();
    expect(screen.getByTestId('action-btn')).toBeInTheDocument();
  });
});
