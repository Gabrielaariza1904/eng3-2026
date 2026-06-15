package com.hotelimperial.backend.facade;

import com.hotelimperial.backend.dao.*;
import com.hotelimperial.backend.domain.*;
import com.hotelimperial.backend.strategy.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;

import java.time.LocalDate;
import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class FacadeTests {

    @Mock
    private HospedeDAO hospedeDAO;
    @Mock
    private QuartoDAO quartoDAO;
    @Mock
    private PromocaoDAO promocaoDAO;
    @Mock
    private PoliticaCancelamentoDAO politicaCancelamentoDAO;
    @Mock
    private ReservaDAO reservaDAO;
    @Mock
    private PagamentoDAO pagamentoDAO;

    @Mock
    private QuartoRepository quartoRepository;
    @Mock
    private ReservaRepository reservaRepository;

    @Mock
    private ValidarCpfUnico validarCpfUnico;
    @Mock
    private ValidarEmail validarEmail;
    @Mock
    private ValidarDadosObrigatoriosHospede validarDadosObrigatoriosHospede;

    @InjectMocks
    private Fachada fachada;

    @BeforeEach
    public void setup() {
        // Manually trigger init to populate maps
        fachada.init();
    }

    @Test
    public void testSalvarSuccess() {
        Hospede h = new Hospede();
        when(validarDadosObrigatoriosHospede.processar(h)).thenReturn(null);
        when(validarCpfUnico.processar(h)).thenReturn(null);
        when(validarEmail.processar(h)).thenReturn(null);

        String result = fachada.salvar(h);
        assertEquals("Sucesso", result);
        verify(hospedeDAO, times(1)).salvar(h);
    }

    @Test
    public void testSalvarFailure() {
        Hospede h = new Hospede();
        when(validarDadosObrigatoriosHospede.processar(h)).thenReturn("Erro Nome");

        String result = fachada.salvar(h);
        assertEquals("Erro Nome", result);
        verify(hospedeDAO, never()).salvar(h);
    }

    @Test
    public void testAlterarSuccess() {
        Hospede h = new Hospede();
        when(validarDadosObrigatoriosHospede.processar(h)).thenReturn(null);
        when(validarCpfUnico.processar(h)).thenReturn(null);
        when(validarEmail.processar(h)).thenReturn(null);

        String result = fachada.alterar(h);
        assertEquals("Sucesso", result);
        verify(hospedeDAO, times(1)).alterar(h);
    }

    @Test
    public void testInativarSuccess() {
        Hospede h = new Hospede();
        String result = fachada.inativar(h);
        assertEquals("Sucesso", result);
        verify(hospedeDAO, times(1)).inativar(h);
    }

    @Test
    public void testConsultar() {
        Hospede h = new Hospede();
        when(hospedeDAO.consultar(h)).thenReturn(Collections.singletonList(h));
        List<Hospede> list = fachada.consultar(h);
        assertEquals(1, list.size());
    }

    @Test
    public void testAtualizarStatusQuartoPorReservas() {
        Quarto q1 = new Quarto();
        q1.setId(1);
        q1.setStatus(StatusQuarto.DISPONIVEL);

        Quarto q2 = new Quarto();
        q2.setId(2);
        q2.setStatus(StatusQuarto.MANUTENCAO);

        Reserva r = new Reserva();
        r.setId(1);
        r.setQuarto(q1);
        r.setStatus(StatusReserva.CONFIRMADA);
        r.setCheckinRealizado(true);
        r.setDataEntrada(LocalDate.now().minusDays(1));
        r.setDataSaida(LocalDate.now().plusDays(1));

        when(quartoRepository.findAll()).thenReturn(Arrays.asList(q1, q2));
        when(reservaRepository.findAll()).thenReturn(Collections.singletonList(r));

        fachada.atualizarStatusQuartoPorReservas();

        assertEquals(StatusQuarto.OCUPADO, q1.getStatus());
        assertEquals(StatusQuarto.MANUTENCAO, q2.getStatus());
        verify(quartoRepository, times(1)).saveAll(any());
    }
}
