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

import java.time.LocalDate;
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

    @Test
    public void testQuartoController() throws Exception {
        Quarto q = new Quarto();
        q.setId(1);
        q.setNumero("101");
        q.setStatus(StatusQuarto.DISPONIVEL);

        when(fachada.consultar(any(Quarto.class))).thenReturn(Collections.singletonList(q));
        when(fachada.salvar(any(Quarto.class))).thenReturn("Sucesso");
        when(fachada.alterar(any(Quarto.class))).thenReturn("Sucesso");
        when(fachada.inativar(any(Quarto.class))).thenReturn("Sucesso");

        mockMvc.perform(get("/api/quartos"))
                .andExpect(status().isOk());

        mockMvc.perform(get("/api/quartos/1"))
                .andExpect(status().isOk());

        mockMvc.perform(post("/api/quartos")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(q)))
                .andExpect(status().isCreated());

        mockMvc.perform(put("/api/quartos/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(q)))
                .andExpect(status().isOk());

        mockMvc.perform(patch("/api/quartos/1/status?valor=OCUPADO"))
                .andExpect(status().isOk());

        mockMvc.perform(delete("/api/quartos/1"))
                .andExpect(status().isOk());
    }

    @Test
    public void testPromocaoController() throws Exception {
        Promocao p = new Promocao();
        p.setId(1);

        when(fachada.consultar(any(Promocao.class))).thenReturn(Collections.singletonList(p));
        when(fachada.salvar(any(Promocao.class))).thenReturn("Sucesso");
        when(fachada.alterar(any(Promocao.class))).thenReturn("Sucesso");
        when(fachada.inativar(any(Promocao.class))).thenReturn("Sucesso");

        mockMvc.perform(get("/api/promocoes"))
                .andExpect(status().isOk());

        mockMvc.perform(get("/api/promocoes/1"))
                .andExpect(status().isOk());

        mockMvc.perform(post("/api/promocoes")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(p)))
                .andExpect(status().isCreated());

        mockMvc.perform(delete("/api/promocoes/1"))
                .andExpect(status().isOk());

        mockMvc.perform(patch("/api/promocoes/1/reativar"))
                .andExpect(status().isOk());
    }

    @Test
    public void testPoliticaController() throws Exception {
        PoliticaCancelamento p = new PoliticaCancelamento();
        p.setId(1);

        when(fachada.consultar(any(PoliticaCancelamento.class))).thenReturn(Collections.singletonList(p));
        when(fachada.salvar(any(PoliticaCancelamento.class))).thenReturn("Sucesso");
        when(fachada.alterar(any(PoliticaCancelamento.class))).thenReturn("Sucesso");
        when(fachada.inativar(any(PoliticaCancelamento.class))).thenReturn("Sucesso");

        mockMvc.perform(get("/api/politicas"))
                .andExpect(status().isOk());

        mockMvc.perform(post("/api/politicas")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(p)))
                .andExpect(status().isCreated());

        mockMvc.perform(delete("/api/politicas/1"))
                .andExpect(status().isOk());

        mockMvc.perform(patch("/api/politicas/1/reativar"))
                .andExpect(status().isOk());
    }

    @Test
    public void testReservaController() throws Exception {
        Reserva r = new Reserva();
        r.setId(1);
        r.setDataSaida(LocalDate.now().plusDays(2));
        r.setDataEntrada(LocalDate.now());

        when(fachada.consultar(any(Reserva.class))).thenReturn(Collections.singletonList(r));
        when(fachada.salvar(any(Reserva.class))).thenReturn("Sucesso");
        when(fachada.alterar(any(Reserva.class))).thenReturn("Sucesso");
        when(fachada.inativar(any(Reserva.class))).thenReturn("Sucesso");

        mockMvc.perform(get("/api/reservas"))
                .andExpect(status().isOk());

        mockMvc.perform(post("/api/reservas")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(r)))
                .andExpect(status().isCreated());

        mockMvc.perform(patch("/api/reservas/1/checkin?valor=true"))
                .andExpect(status().isOk());

        mockMvc.perform(patch("/api/reservas/1/cancelar"))
                .andExpect(status().isOk());

        mockMvc.perform(delete("/api/reservas/1"))
                .andExpect(status().isOk());
    }

    @Test
    public void testPagamentoController() throws Exception {
        Pagamento p = new Pagamento();
        p.setId(1);

        when(fachada.consultar(any(Pagamento.class))).thenReturn(Collections.singletonList(p));
        when(fachada.salvar(any(Pagamento.class))).thenReturn("Sucesso");
        when(fachada.inativar(any(Pagamento.class))).thenReturn("Sucesso");

        mockMvc.perform(get("/api/pagamentos"))
                .andExpect(status().isOk());

        mockMvc.perform(post("/api/pagamentos")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(p)))
                .andExpect(status().isCreated());

        mockMvc.perform(delete("/api/pagamentos/1"))
                .andExpect(status().isOk());
    }

    @Test
    public void testDashboardController() throws Exception {
        mockMvc.perform(get("/api/dashboard/kpis"))
                .andExpect(status().isOk());

        mockMvc.perform(get("/api/dashboard/atividades"))
                .andExpect(status().isOk());
    }
}
