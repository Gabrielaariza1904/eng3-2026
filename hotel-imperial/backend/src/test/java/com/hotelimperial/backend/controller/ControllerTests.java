package com.hotelimperial.backend.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.hotelimperial.backend.dao.CidadeRepository;
import com.hotelimperial.backend.dao.EstadoRepository;
import com.hotelimperial.backend.domain.*;
import com.hotelimperial.backend.facade.Fachada;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Collections;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest
public class ControllerTests {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private Fachada fachada;

    @MockBean
    private EstadoRepository estadoRepository;

    @MockBean
    private CidadeRepository cidadeRepository;

    @Test
    public void testHospedeController() throws Exception {
        Hospede h = new Hospede();
        h.setId(1);
        h.setNome("Joao");
        h.setCpf("111.111.111-11");
        h.setEmail("joao@test.com");
        h.setTelefone("9999-9999");

        // Cidade / Estado setup for prepareEndereco
        Endereco end = new Endereco();
        Cidade cid = new Cidade();
        cid.setNome("Campinas");
        Estado est = new Estado();
        est.setUf("SP");
        cid.setEstado(est);
        end.setCidade(cid);
        h.setEndereco(end);

        when(fachada.consultar(any(Hospede.class))).thenReturn(Collections.singletonList(h));
        when(fachada.salvar(any(Hospede.class))).thenReturn("Sucesso");
        when(fachada.alterar(any(Hospede.class))).thenReturn("Sucesso");
        when(fachada.inativar(any(Hospede.class))).thenReturn("Sucesso");
        
        when(estadoRepository.findByUf("SP")).thenReturn(est);
        when(cidadeRepository.findByNomeAndEstadoUf("Campinas", "SP")).thenReturn(cid);

        mockMvc.perform(get("/api/hospedes"))
                .andExpect(status().isOk());

        mockMvc.perform(get("/api/hospedes/1"))
                .andExpect(status().isOk());

        mockMvc.perform(post("/api/hospedes")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(h)))
                .andExpect(status().isCreated());

        mockMvc.perform(put("/api/hospedes/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(h)))
                .andExpect(status().isOk());

        mockMvc.perform(delete("/api/hospedes/1"))
                .andExpect(status().isOk());

        mockMvc.perform(patch("/api/hospedes/1/reativar"))
                .andExpect(status().isOk());
    }

    @Test
    public void testHospedeControllerFailure() throws Exception {
        Hospede h = new Hospede();
        when(fachada.salvar(any(Hospede.class))).thenReturn("Erro CPF");

        mockMvc.perform(post("/api/hospedes")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(h)))
                .andExpect(status().isBadRequest());
    }
}
