package com.hotelimperial.backend.dao;

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
public class DaoTests {

    @Mock
    private HospedeRepository hospedeRepository;
    @Mock
    private QuartoRepository quartoRepository;
    @Mock
    private PromocaoRepository promocaoRepository;
    @Mock
    private PoliticaCancelamentoRepository politicaCancelamentoRepository;
    @Mock
    private ReservaRepository reservaRepository;
    @Mock
    private PagamentoRepository pagamentoRepository;

    @InjectMocks
    private HospedeDAO hospedeDAO;
    @InjectMocks
    private QuartoDAO quartoDAO;
    @InjectMocks
    private PromocaoDAO promocaoDAO;
    @InjectMocks
    private PoliticaCancelamentoDAO politicaCancelamentoDAO;
    @InjectMocks
    private ReservaDAO reservaDAO;
    @InjectMocks
    private PagamentoDAO pagamentoDAO;

    @Test
    public void testHospedeDAO() {
        Hospede h = new Hospede();
        h.setId(1);
        
        hospedeDAO.salvar(h);
        verify(hospedeRepository, times(1)).save(h);

        hospedeDAO.alterar(h);
        verify(hospedeRepository, times(2)).save(h);

        hospedeDAO.inativar(h);
        assertTrue(h.isInativo());
        verify(hospedeRepository, times(3)).save(h);

        when(hospedeRepository.findById(1)).thenReturn(Optional.of(h));
        List<EntidadeDominio> list1 = hospedeDAO.consultar(h);
        assertEquals(1, list1.size());

        when(hospedeRepository.findAll()).thenReturn(Collections.singletonList(h));
        List<EntidadeDominio> list2 = hospedeDAO.consultar(new Hospede());
        assertEquals(1, list2.size());
    }

    @Test
    public void testQuartoDAO() {
        Quarto q = new Quarto();
        q.setId(1);

        quartoDAO.salvar(q);
        verify(quartoRepository, times(1)).save(q);

        quartoDAO.alterar(q);
        verify(quartoRepository, times(2)).save(q);

        quartoDAO.inativar(q);
        verify(quartoRepository, times(1)).delete(q);

        when(quartoRepository.findById(1)).thenReturn(Optional.of(q));
        List<EntidadeDominio> list = quartoDAO.consultar(q);
        assertEquals(1, list.size());
    }

    @Test
    public void testPromocaoDAO() {
        Promocao p = new Promocao();
        p.setId(1);

        promocaoDAO.salvar(p);
        verify(promocaoRepository).save(p);

        promocaoDAO.inativar(p);
        assertTrue(p.isInativo());
    }

    @Test
    public void testPoliticaDAO() {
        PoliticaCancelamento p = new PoliticaCancelamento();
        p.setId(1);

        politicaCancelamentoDAO.salvar(p);
        verify(politicaCancelamentoRepository).save(p);

        politicaCancelamentoDAO.inativar(p);
        assertTrue(p.isInativo());
    }

    @Test
    public void testReservaDAO() {
        Reserva r = new Reserva();
        r.setId(1);

        reservaDAO.salvar(r);
        verify(reservaRepository).save(r);

        reservaDAO.inativar(r);
        verify(reservaRepository).delete(r);
    }

    @Test
    public void testPagamentoDAO() {
        Pagamento p = new Pagamento();
        p.setId(1);

        pagamentoDAO.salvar(p);
        verify(pagamentoRepository).save(p);

        pagamentoDAO.inativar(p);
        verify(pagamentoRepository).delete(p);
    }
}
