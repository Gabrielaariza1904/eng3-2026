import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import HospedeForm from '../components/HospedeForm';
import { api } from '../services/api';

jest.mock('../../src/services/api', () => ({
  api: {
    get: jest.fn(() => Promise.resolve({
      data: {
        id: 1,
        nome: 'João Teste',
        cpf: '111.111.111-11',
        email: 'joao@teste.com',
        telefone: '9999-9999',
        inativo: false,
        endereco: {
          cep: '12345-678',
          logradouro: 'Rua das Flores',
          numero: '100',
          bairro: 'Centro',
          complemento: '',
          cidade: {
            nome: 'São Paulo',
            estado: {
              nome: 'São Paulo',
              uf: 'SP'
            }
          }
        }
      }
    })),
    post: jest.fn(() => Promise.resolve({ data: { sucesso: true } })),
    put: jest.fn(() => Promise.resolve({ data: { sucesso: true } })),
  }
}));

jest.mock('../../src/components/Toast', () => ({
  useToast: () => ({
    showToast: jest.fn(),
  }),
}));

describe('HospedeForm Component', () => {
  it('renders form inputs correctly for creation', () => {
    render(<HospedeForm />);
    expect(screen.getByPlaceholderText('Digite o nome completo...')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('000.000.000-00')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('exemplo@email.com')).toBeInTheDocument();
  });

  it('populates fields and triggers update on submit in edit mode', async () => {
    render(<HospedeForm id={1} />);
    
    await waitFor(() => {
      expect(screen.getByDisplayValue('João Teste')).toBeInTheDocument();
    });

    const submitBtn = screen.getByText('Salvar Hóspede');
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(api.put).toHaveBeenCalled();
    });
  });
});
