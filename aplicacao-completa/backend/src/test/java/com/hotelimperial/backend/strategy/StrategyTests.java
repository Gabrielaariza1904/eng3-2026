package com.hotelimperial.backend.strategy;

import com.hotelimperial.backend.dao.*;
import com.hotelimperial.backend.domain.*;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class StrategyTests {

    @Mock
    private HospedeRepository hospedeRepository;
    @Mock
    private QuartoRepository quartoRepository;
    @Mock
    private PromocaoRepository promocaoRepository;
    @Mock
    private ReservaRepository reservaRepository;

    @InjectMocks
    private ValidarCpfUnico validarCpfUnico;
    @InjectMocks
    private ValidarEmail validarEmail;
    @InjectMocks
    private ValidarDadosObrigatoriosHospede validarDadosObrigatoriosHospede;
    @InjectMocks
    private ValidarNumeroUnicoQuarto validarNumeroUnicoQuarto;
    @InjectMocks
    private ValidarDadosObrigatoriosQuarto validarDadosObrigatoriosQuarto;
    @InjectMocks
    private ValidarCodigoUnicoPromocao validarCodigoUnicoPromocao;
    @InjectMocks
    private ValidarDadosObrigatoriosPromocao validarDadosObrigatoriosPromocao;
    @InjectMocks
    private ValidarDadosObrigatoriosPolitica validarDadosObrigatoriosPolitica;
    @InjectMocks
    private ValidarDadosObrigatoriosReserva validarDadosObrigatoriosReserva;
    @InjectMocks
    private ValidarDatasReserva validarDatasReserva;
    @InjectMocks
    private ValidarCapacidadeQuartoReserva validarCapacidadeQuartoReserva;
    @InjectMocks
    private ValidarDisponibilidadeQuartoReserva validarDisponibilidadeQuartoReserva;
    @InjectMocks
    private ValidarDadosObrigatoriosPagamento validarDadosObrigatoriosPagamento;

    @Test
    public void testValidarCpfUnico() {
        Hospede h1 = new Hospede();
        h1.setId(1);
        h1.setCpf("111.111.111-11");

        // Null CPF check
        assertNull(validarCpfUnico.processar(new Hospede()));

        // Non-Hospede entity check
        assertNull(validarCpfUnico.processar(new Quarto()));

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
        
        // Non-Hospede check
        assertNull(validarEmail.processar(new Quarto()));
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
        
        // Non-hospede
        assertNull(validarDadosObrigatoriosHospede.processar(new Quarto()));
    }

    @Test
    public void testValidarNumeroUnicoQuarto() {
        Quarto q = new Quarto();
        q.setId(1);
        q.setNumero("101");

        assertNull(validarNumeroUnicoQuarto.processar(new Quarto())); // empty
        assertNull(validarNumeroUnicoQuarto.processar(new Hospede())); // non-quarto

        when(quartoRepository.findByNumero("101")).thenReturn(Optional.empty());
        assertNull(validarNumeroUnicoQuarto.processar(q));

        when(quartoRepository.findByNumero("101")).thenReturn(Optional.of(q));
        assertNull(validarNumeroUnicoQuarto.processar(q));

        Quarto q2 = new Quarto();
        q2.setId(2);
        q2.setNumero("101");
        when(quartoRepository.findByNumero("101")).thenReturn(Optional.of(q2));
        assertNotNull(validarNumeroUnicoQuarto.processar(q));
    }

    @Test
    public void testValidarDadosObrigatoriosQuarto() {
        Quarto q = new Quarto();
        assertNotNull(validarDadosObrigatoriosQuarto.processar(q)); // missing number

        q.setNumero("101");
        assertNotNull(validarDadosObrigatoriosQuarto.processar(q)); // missing type

        q.setTipo("Luxo");
        assertNotNull(validarDadosObrigatoriosQuarto.processar(q)); // missing capacity

        q.setCapacidadeAdultos(2);
        assertNotNull(validarDadosObrigatoriosQuarto.processar(q)); // missing rate

        q.setValorDiaria(100.0);
        assertNull(validarDadosObrigatoriosQuarto.processar(q)); // valid
    }

    @Test
    public void testValidarCodigoUnicoPromocao() {
        Promocao p = new Promocao();
        p.setId(1);
        p.setCodigo("PROMO");

        assertNull(validarCodigoUnicoPromocao.processar(new Promocao()));
        assertNull(validarCodigoUnicoPromocao.processar(new Hospede()));

        when(promocaoRepository.findByCodigo("PROMO")).thenReturn(Optional.empty());
        assertNull(validarCodigoUnicoPromocao.processar(p));

        when(promocaoRepository.findByCodigo("PROMO")).thenReturn(Optional.of(p));
        assertNull(validarCodigoUnicoPromocao.processar(p));

        Promocao p2 = new Promocao();
        p2.setId(2);
        p2.setCodigo("PROMO");
        when(promocaoRepository.findByCodigo("PROMO")).thenReturn(Optional.of(p2));
        assertNotNull(validarCodigoUnicoPromocao.processar(p));
    }

    @Test
    public void testValidarDadosObrigatoriosPromocao() {
        Promocao p = new Promocao();
        assertNotNull(validarDadosObrigatoriosPromocao.processar(p)); // missing code

        p.setCodigo("PROMO");
        assertNotNull(validarDadosObrigatoriosPromocao.processar(p)); // missing description

        p.setDescricao("Desc");
        assertNotNull(validarDadosObrigatoriosPromocao.processar(p)); // missing discount

        p.setDescontoPercentual(15.0);
        assertNull(validarDadosObrigatoriosPromocao.processar(p)); // valid
    }

    @Test
    public void testValidarDadosObrigatoriosPolitica() {
        PoliticaCancelamento p = new PoliticaCancelamento();
        assertNotNull(validarDadosObrigatoriosPolitica.processar(p)); // missing desc

        p.setDescricao("Desc");
        assertNotNull(validarDadosObrigatoriosPolitica.processar(p)); // missing hours

        p.setHorasAntecedencia(24);
        assertNotNull(validarDadosObrigatoriosPolitica.processar(p)); // missing penalty

        p.setPercentualMulta(10.0);
        assertNull(validarDadosObrigatoriosPolitica.processar(p)); // valid
    }

    @Test
    public void testValidarDadosObrigatoriosReserva() {
        Reserva r = new Reserva();
        assertNotNull(validarDadosObrigatoriosReserva.processar(r)); // missing guest

        Hospede h = new Hospede();
        h.setId(1);
        r.setHospede(h);
        assertNotNull(validarDadosObrigatoriosReserva.processar(r)); // missing room

        Quarto q = new Quarto();
        q.setId(1);
        r.setQuarto(q);
        assertNotNull(validarDadosObrigatoriosReserva.processar(r)); // missing checkin date

        r.setDataEntrada(LocalDate.now());
        assertNotNull(validarDadosObrigatoriosReserva.processar(r)); // missing checkout date

        r.setDataSaida(LocalDate.now().plusDays(1));
        assertNotNull(validarDadosObrigatoriosReserva.processar(r)); // missing adults count

        r.setQtdAdultos(1);
        assertNotNull(validarDadosObrigatoriosReserva.processar(r)); // missing policy

        PoliticaCancelamento pc = new PoliticaCancelamento();
        pc.setId(1);
        r.setPoliticaCancelamento(pc);

        assertNull(validarDadosObrigatoriosReserva.processar(r)); // valid
    }

    @Test
    public void testValidarDatasReserva() {
        Reserva r = new Reserva();
        assertNull(validarDatasReserva.processar(r)); // missing dates

        r.setDataEntrada(LocalDate.now());
        r.setDataSaida(LocalDate.now().minusDays(1));
        assertNotNull(validarDatasReserva.processar(r)); // exit before entry

        r.setDataSaida(LocalDate.now().plusDays(1));
        assertNull(validarDatasReserva.processar(r)); // valid
    }

    @Test
    public void testValidarCapacidadeQuartoReserva() {
        Reserva r = new Reserva();
        assertNull(validarCapacidadeQuartoReserva.processar(r)); // missing room

        Quarto q = new Quarto();
        q.setId(1);
        q.setCapacidadeAdultos(2);
        q.setCapacidadeCriancas(1);
        r.setQuarto(q);

        when(quartoRepository.findById(1)).thenReturn(Optional.empty());
        assertNotNull(validarCapacidadeQuartoReserva.processar(r)); // room not found

        when(quartoRepository.findById(1)).thenReturn(Optional.of(q));
        
        r.setQtdAdultos(3);
        assertNotNull(validarCapacidadeQuartoReserva.processar(r)); // adults exceeded

        r.setQtdAdultos(2);
        r.setQtdCriancas(2);
        assertNotNull(validarCapacidadeQuartoReserva.processar(r)); // kids exceeded

        r.setQtdCriancas(1);
        assertNull(validarCapacidadeQuartoReserva.processar(r)); // valid
    }

    @Test
    public void testValidarDisponibilidadeQuartoReserva() {
        Reserva r = new Reserva();
        r.setId(1);
        assertNull(validarDisponibilidadeQuartoReserva.processar(r)); // missing fields

        Quarto q = new Quarto();
        q.setId(1);
        r.setQuarto(q);
        r.setDataEntrada(LocalDate.of(2026, 6, 10));
        r.setDataSaida(LocalDate.of(2026, 6, 15));

        // No reservations
        when(reservaRepository.findByQuartoId(1)).thenReturn(Collections.emptyList());
        assertNull(validarDisponibilidadeQuartoReserva.processar(r));

        // Cancelled reservation (no overlap check)
        Reserva existing1 = new Reserva();
        existing1.setId(2);
        existing1.setStatus(StatusReserva.CANCELADA);
        existing1.setDataEntrada(LocalDate.of(2026, 6, 10));
        existing1.setDataSaida(LocalDate.of(2026, 6, 15));
        when(reservaRepository.findByQuartoId(1)).thenReturn(Collections.singletonList(existing1));
        assertNull(validarDisponibilidadeQuartoReserva.processar(r));

        // Overlapping reservation
        Reserva existing2 = new Reserva();
        existing2.setId(2);
        existing2.setStatus(StatusReserva.CONFIRMADA);
        existing2.setDataEntrada(LocalDate.of(2026, 6, 12));
        existing2.setDataSaida(LocalDate.of(2026, 6, 18));
        when(reservaRepository.findByQuartoId(1)).thenReturn(Collections.singletonList(existing2));
        assertNotNull(validarDisponibilidadeQuartoReserva.processar(r));
    }

    @Test
    public void testValidarDadosObrigatoriosPagamento() {
        Pagamento p = new Pagamento();
        assertNotNull(validarDadosObrigatoriosPagamento.processar(p)); // missing reserve

        Reserva r = new Reserva();
        r.setId(1);
        p.setReserva(r);
        assertNotNull(validarDadosObrigatoriosPagamento.processar(p)); // missing value

        p.setValor(10.0);
        assertNotNull(validarDadosObrigatoriosPagamento.processar(p)); // missing form

        p.setFormaPagamento("Pix");
        assertNull(validarDadosObrigatoriosPagamento.processar(p)); // valid
    }
}
