package com.hotelimperial.backend.domain;

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

public class DomainTests {

    @Test
    public void testEstado() {
        Estado e = new Estado();
        e.setId(1);
        e.setNome("São Paulo");
        e.setUf("SP");

        assertEquals(1, e.getId());
        assertEquals("São Paulo", e.getNome());
        assertEquals("SP", e.getUf());

        Estado e2 = new Estado("Rio", "RJ");
        assertEquals("Rio", e2.getNome());
        assertEquals("RJ", e2.getUf());
    }

    @Test
    public void testCidade() {
        Estado e = new Estado("Minas", "MG");
        Cidade c = new Cidade();
        c.setId(2);
        c.setNome("BH");
        c.setEstado(e);

        assertEquals(2, c.getId());
        assertEquals("BH", c.getNome());
        assertEquals(e, c.getEstado());

        Cidade c2 = new Cidade("Rio", e);
        assertEquals("Rio", c2.getNome());
    }

    @Test
    public void testEndereco() {
        Cidade c = new Cidade("SP", new Estado("SP", "SP"));
        Endereco end = new Endereco();
        end.setId(3);
        end.setLogradouro("Rua A");
        end.setNumero("123");
        end.setCep("01234-567");
        end.setBairro("Centro");
        end.setComplemento("Apto 1");
        end.setCidade(c);

        assertEquals(3, end.getId());
        assertEquals("Rua A", end.getLogradouro());
        assertEquals("123", end.getNumero());
        assertEquals("01234-567", end.getCep());
        assertEquals("Centro", end.getBairro());
        assertEquals("Apto 1", end.getComplemento());
        assertEquals(c, end.getCidade());
    }

    @Test
    public void testHospede() {
        Hospede h = new Hospede();
        h.setId(4);
        h.setNome("João");
        h.setCpf("111.111.111-11");
        h.setEmail("joao@test.com");
        h.setTelefone("9999-9999");
        h.setInativo(true);

        assertEquals(4, h.getId());
        assertEquals("João", h.getNome());
        assertEquals("111.111.111-11", h.getCpf());
        assertEquals("joao@test.com", h.getEmail());
        assertEquals("9999-9999", h.getTelefone());
        assertTrue(h.isInativo());
    }
}
