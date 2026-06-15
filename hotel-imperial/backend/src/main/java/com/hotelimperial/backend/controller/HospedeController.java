package com.hotelimperial.backend.controller;

import com.hotelimperial.backend.dao.CidadeRepository;
import com.hotelimperial.backend.dao.EstadoRepository;
import com.hotelimperial.backend.domain.*;
import com.hotelimperial.backend.facade.Fachada;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/hospedes")
public class HospedeController {

    @Autowired
    private Fachada fachada;

    @Autowired
    private EstadoRepository estadoRepository;

    @Autowired
    private CidadeRepository cidadeRepository;

    @GetMapping
    public List<Hospede> obterTodos() {
        return fachada.consultar(new Hospede());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> obterPorId(@PathVariable Integer id) {
        Hospede filtro = new Hospede();
        filtro.setId(id);
        List<Hospede> res = fachada.consultar(filtro);
        if (res.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(res.get(0));
    }

    @PostMapping
    public ResponseEntity<?> criar(@RequestBody Hospede hospede) {
        prepararEndereco(hospede);
        hospede.setInativo(false);
        String resultado = fachada.salvar(hospede);
        if ("Sucesso".equals(resultado)) {
            return ResponseEntity.status(HttpStatus.CREATED).body(hospede);
        }
        return ResponseEntity.badRequest().body(new RespostaErro(resultado));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> atualizar(@PathVariable Integer id, @RequestBody Hospede hospede) {
        hospede.setId(id);
        prepararEndereco(hospede);
        String resultado = fachada.alterar(hospede);
        if ("Sucesso".equals(resultado)) {
            return ResponseEntity.ok(hospede);
        }
        return ResponseEntity.badRequest().body(new RespostaErro(resultado));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> inativar(@PathVariable Integer id) {
        Hospede filtro = new Hospede();
        filtro.setId(id);
        List<Hospede> res = fachada.consultar(filtro);
        if (res.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        Hospede h = res.get(0);
        String resultado = fachada.inativar(h);
        if ("Sucesso".equals(resultado)) {
            return ResponseEntity.ok(new RespostaSucesso("Hóspede inativado com sucesso"));
        }
        return ResponseEntity.badRequest().body(new RespostaErro(resultado));
    }

    @PatchMapping("/{id}/reativar")
    public ResponseEntity<?> reativar(@PathVariable Integer id) {
        Hospede filtro = new Hospede();
        filtro.setId(id);
        List<Hospede> res = fachada.consultar(filtro);
        if (res.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        Hospede h = res.get(0);
        h.setInativo(false);
        String resultado = fachada.alterar(h);
        if ("Sucesso".equals(resultado)) {
            return ResponseEntity.ok(new RespostaSucesso("Hóspede reativado com sucesso"));
        }
        return ResponseEntity.badRequest().body(new RespostaErro(resultado));
    }

    private void prepararEndereco(Hospede hospede) {
        if (hospede.getEndereco() != null && hospede.getEndereco().getCidade() != null) {
            Cidade c = hospede.getEndereco().getCidade();
            if (c.getEstado() != null) {
                Estado e = c.getEstado();
                Estado existingEstado = estadoRepository.findByUf(e.getUf());
                if (existingEstado != null) {
                    c.setEstado(existingEstado);
                } else {
                    c.setEstado(estadoRepository.save(e));
                }
            }
            Cidade existingCidade = cidadeRepository.findByNomeAndEstadoUf(c.getNome(), c.getEstado().getUf());
            if (existingCidade != null) {
                hospede.getEndereco().setCidade(existingCidade);
            } else {
                hospede.getEndereco().setCidade(cidadeRepository.save(c));
            }
        }
    }

    public static class RespostaErro {
        private String erro;
        public RespostaErro(String erro) { this.erro = erro; }
        public String getErro() { return erro; }
    }

    public static class RespostaSucesso {
        private String mensagem;
        public RespostaSucesso(String mensagem) { this.mensagem = mensagem; }
        public String getMensagem() { return mensagem; }
    }
}
