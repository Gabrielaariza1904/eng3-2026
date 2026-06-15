package com.hotelimperial.backend.controller;

import com.hotelimperial.backend.domain.PoliticaCancelamento;
import com.hotelimperial.backend.facade.Fachada;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/politicas")
public class PoliticaCancelamentoController {

    @Autowired
    private Fachada fachada;

    @GetMapping
    public List<PoliticaCancelamento> obterTodas() {
        return fachada.consultar(new PoliticaCancelamento());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> obterPorId(@PathVariable Integer id) {
        PoliticaCancelamento filtro = new PoliticaCancelamento();
        filtro.setId(id);
        List<PoliticaCancelamento> res = fachada.consultar(filtro);
        if (res.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(res.get(0));
    }

    @PostMapping
    public ResponseEntity<?> criar(@RequestBody PoliticaCancelamento politica) {
        politica.setInativo(false);
        String resultado = fachada.salvar(politica);
        if ("Sucesso".equals(resultado)) {
            return ResponseEntity.status(HttpStatus.CREATED).body(politica);
        }
        return ResponseEntity.badRequest().body(new HospedeController.RespostaErro(resultado));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> atualizar(@PathVariable Integer id, @RequestBody PoliticaCancelamento politica) {
        politica.setId(id);
        String resultado = fachada.alterar(politica);
        if ("Sucesso".equals(resultado)) {
            return ResponseEntity.ok(politica);
        }
        return ResponseEntity.badRequest().body(new HospedeController.RespostaErro(resultado));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> inativar(@PathVariable Integer id) {
        PoliticaCancelamento filtro = new PoliticaCancelamento();
        filtro.setId(id);
        List<PoliticaCancelamento> res = fachada.consultar(filtro);
        if (res.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        String resultado = fachada.inativar(res.get(0));
        if ("Sucesso".equals(resultado)) {
            return ResponseEntity.ok(new HospedeController.RespostaSucesso("Política inativada com sucesso"));
        }
        return ResponseEntity.badRequest().body(new HospedeController.RespostaErro(resultado));
    }

    @PatchMapping("/{id}/reativar")
    public ResponseEntity<?> reativar(@PathVariable Integer id) {
        PoliticaCancelamento filtro = new PoliticaCancelamento();
        filtro.setId(id);
        List<PoliticaCancelamento> res = fachada.consultar(filtro);
        if (res.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        PoliticaCancelamento p = res.get(0);
        p.setInativo(false);
        String resultado = fachada.alterar(p);
        if ("Sucesso".equals(resultado)) {
            return ResponseEntity.ok(new HospedeController.RespostaSucesso("Política reativada com sucesso"));
        }
        return ResponseEntity.badRequest().body(new HospedeController.RespostaErro(resultado));
    }
}
