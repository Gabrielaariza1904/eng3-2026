package com.hotelimperial.backend.strategy;

import com.hotelimperial.backend.dao.*;
import com.hotelimperial.backend.domain.*;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class StrategyTests {

    @Mock
    private HospedeRepository hospedeRepository;

    @InjectMocks
    private ValidarCpfUnico validarCpfUnico;
    @InjectMocks
    private ValidarEmail validarEmail;
    @InjectMocks
    private ValidarDadosObrigatoriosHospede validarDadosObrigatoriosHospede;

    @Test
    public void testValidarCpfUnico() {
        Hospede h1 = new Hospede();
        h1.setId(1);
        h1.setCpf("111.111.111-11");

        // Null CPF check
        assertNull(validarCpfUnico.processar(new Hospede()));

        // Non-existent CPF
        when(hospedeRepository.findByCpf("111.111.111-11")).thenReturn(Optional.empty());
        assertNull(validarCpfUnico.processar(h1));

        // Existing CPF belonging to same guest
        when(hospedeRepository.findByCpf("111.111.111-11")).thenReturn(Optional.of(h1));
        assertNull(validarCpfUnico.processar(h1));

        // Existing CPF belonging to another guest
        Hospede h2 = new Hospede();
        h2.setId(2);
        h2.setCpf("111.111.111-11");
        when(hospedeRepository.findByCpf("111.111.111-11")).thenReturn(Optional.of(h2));
        assertNotNull(validarCpfUnico.processar(h1));
    }

    @Test
    public void testValidarEmail() {
        Hospede h = new Hospede();
        
        // Null email
        assertNull(validarEmail.processar(h));

        // Invalid email
        h.setEmail("invalid-email");
        assertNotNull(validarEmail.processar(h));

        // Valid email
        h.setEmail("test@email.com");
        assertNull(validarEmail.processar(h));
    }

    @Test
    public void testValidarDadosObrigatoriosHospede() {
        Hospede h = new Hospede();
        assertNotNull(validarDadosObrigatoriosHospede.processar(h)); // Missing name

        h.setNome("Nome");
        assertNotNull(validarDadosObrigatoriosHospede.processar(h)); // Missing cpf

        h.setCpf("123");
        assertNotNull(validarDadosObrigatoriosHospede.processar(h)); // Missing email

        h.setEmail("a@b.com");
        assertNotNull(validarDadosObrigatoriosHospede.processar(h)); // Missing phone

        h.setTelefone("123");
        assertNotNull(validarDadosObrigatoriosHospede.processar(h)); // Missing address

        // Add Address
        Endereco end = new Endereco();
        h.setEndereco(end);
        assertNotNull(validarDadosObrigatoriosHospede.processar(h)); // Missing CEP

        end.setCep("123");
        end.setLogradouro("Rua");
        end.setNumero("1");
        end.setBairro("Bairro");
        assertNotNull(validarDadosObrigatoriosHospede.processar(h)); // Missing Cidade

        Cidade c = new Cidade();
        c.setNome("Cidade");
        end.setCidade(c);
        assertNotNull(validarDadosObrigatoriosHospede.processar(h)); // Missing Estado

        Estado e = new Estado();
        e.setUf("UF");
        c.setEstado(e);

        // All fields populated
        assertNull(validarDadosObrigatoriosHospede.processar(h));
    }
}
