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

    @InjectMocks
    private HospedeDAO hospedeDAO;

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
}
