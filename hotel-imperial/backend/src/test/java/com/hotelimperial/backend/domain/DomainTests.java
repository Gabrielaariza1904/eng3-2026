package com.hotelimperial.backend.domain;

import org.junit.jupiter.api.Test;
import java.time.LocalDate;
import java.time.LocalDateTime;
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

    @Test
    public void testQuarto() {
        Quarto q = new Quarto();
        q.setId(5);
        q.setNumero("101");
        q.setTipo("Standard");
        q.setCapacidadeAdultos(2);
        q.setCapacidadeCriancas(1);
        q.setValorDiaria(150.0);
        q.setStatus(StatusQuarto.DISPONIVEL);

        assertEquals(5, q.getId());
        assertEquals("101", q.getNumero());
        assertEquals("Standard", q.getTipo());
        assertEquals(2, q.getCapacidadeAdultos());
        assertEquals(1, q.getCapacidadeCriancas());
        assertEquals(150.0, q.getValorDiaria());
        assertEquals(StatusQuarto.DISPONIVEL, q.getStatus());
    }

    @Test
    public void testPromocao() {
        Promocao p = new Promocao();
        p.setId(6);
        p.setCodigo("PROMO10");
        p.setDescricao("10% Off");
        p.setDescontoPercentual(10.0);
        p.setInativo(false);

        assertEquals(6, p.getId());
        assertEquals("PROMO10", p.getCodigo());
        assertEquals("10% Off", p.getDescricao());
        assertEquals(10.0, p.getDescontoPercentual());
        assertFalse(p.isInativo());
    }

    @Test
    public void testPoliticaCancelamento() {
        PoliticaCancelamento p = new PoliticaCancelamento();
        p.setId(7);
        p.setDescricao("Flexivel");
        p.setHorasAntecedencia(24);
        p.setPercentualMulta(10.0);
        p.setInativo(true);

        assertEquals(7, p.getId());
        assertEquals("Flexivel", p.getDescricao());
        assertEquals(24, p.getHorasAntecedencia());
        assertEquals(10.0, p.getPercentualMulta());
        assertTrue(p.isInativo());
    }

    @Test
    public void testReserva() {
        Reserva r = new Reserva();
        r.setId(8);
        r.setDataEntrada(LocalDate.of(2026, 6, 1));
        r.setDataSaida(LocalDate.of(2026, 6, 5));
        r.setCheckinRealizado(true);
        r.setNoShow(false);
        r.setQtdAdultos(2);
        r.setQtdCriancas(0);
        r.setValorTotal(600.0);
        r.setStatus(StatusReserva.CONFIRMADA);

        Hospede h = new Hospede();
        Quarto q = new Quarto();
        Promocao p = new Promocao();
        PoliticaCancelamento pol = new PoliticaCancelamento();

        r.setHospede(h);
        r.setQuarto(q);
        r.setPromocao(p);
        r.setPoliticaCancelamento(pol);

        assertEquals(8, r.getId());
        assertEquals(LocalDate.of(2026, 6, 1), r.getDataEntrada());
        assertEquals(LocalDate.of(2026, 6, 5), r.getDataSaida());
        assertTrue(r.isCheckinRealizado());
        assertFalse(r.isNoShow());
        assertEquals(2, r.getQtdAdultos());
        assertEquals(0, r.getQtdCriancas());
        assertEquals(600.0, r.getValorTotal());
        assertEquals(StatusReserva.CONFIRMADA, r.getStatus());
        assertEquals(h, r.getHospede());
        assertEquals(q, r.getQuarto());
        assertEquals(p, r.getPromocao());
        assertEquals(pol, r.getPoliticaCancelamento());
    }

    @Test
    public void testPagamento() {
        Pagamento p = new Pagamento();
        p.setId(9);
        p.setDataPagamento(LocalDateTime.of(2026, 6, 1, 10, 0));
        p.setValor(300.0);
        p.setStatus(StatusPagamento.APROVADO);
        p.setFormaPagamento("Pix");

        Reserva r = new Reserva();
        p.setReserva(r);

        assertEquals(9, p.getId());
        assertEquals(LocalDateTime.of(2026, 6, 1, 10, 0), p.getDataPagamento());
        assertEquals(300.0, p.getValor());
        assertEquals(StatusPagamento.APROVADO, p.getStatus());
        assertEquals("Pix", p.getFormaPagamento());
        assertEquals(r, p.getReserva());
    }
}
