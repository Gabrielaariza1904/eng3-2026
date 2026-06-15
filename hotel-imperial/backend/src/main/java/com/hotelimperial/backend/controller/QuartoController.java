package com.hotelimperial.backend.controller;

import com.hotelimperial.backend.domain.Quarto;
import com.hotelimperial.backend.domain.StatusQuarto;
import com.hotelimperial.backend.facade.Fachada;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/quartos")
public class QuartoController {

    @Autowired
    private Fachada fachada;

    @GetMapping
    public List<Quarto> obterTodos() {
        return fachada.consultar(new Quarto());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> obterPorId(@PathVariable Integer id) {
        Quarto filtro = new Quarto();
        filtro.setId(id);
        List<Quarto> res = fachada.consultar(filtro);
        if (res.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(res.get(0));
    }

    @PostMapping
    public ResponseEntity<?> criar(@RequestBody Quarto quarto) {
        String resultado = fachada.salvar(quarto);
        if ("Sucesso".equals(resultado)) {
            return ResponseEntity.status(HttpStatus.CREATED).body(quarto);
        }
        return ResponseEntity.badRequest().body(new HospedeController.RespostaErro(resultado));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> atualizar(@PathVariable Integer id, @RequestBody Quarto quarto) {
        quarto.setId(id);
        String resultado = fachada.alterar(quarto);
        if ("Sucesso".equals(resultado)) {
            return ResponseEntity.ok(quarto);
        }
        return ResponseEntity.badRequest().body(new HospedeController.RespostaErro(resultado));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<?> alterarStatus(@PathVariable Integer id, @RequestParam StatusQuarto valor) {
        Quarto filtro = new Quarto();
        filtro.setId(id);
        List<Quarto> res = fachada.consultar(filtro);
        if (res.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        Quarto q = res.get(0);
        q.setStatus(valor);
        String resultado = fachada.alterar(q);
        if ("Sucesso".equals(resultado)) {
            return ResponseEntity.ok(q);
        }
        return ResponseEntity.badRequest().body(new HospedeController.RespostaErro(resultado));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> remover(@PathVariable Integer id) {
        Quarto filtro = new Quarto();
        filtro.setId(id);
        List<Quarto> res = fachada.consultar(filtro);
        if (res.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        String resultado = fachada.inativar(res.get(0)); // IDAO.inativar deletes Quarto from DB
        if ("Sucesso".equals(resultado)) {
            return ResponseEntity.ok(new HospedeController.RespostaSucesso("Quarto removido com sucesso"));
        }
        return ResponseEntity.badRequest().body(new HospedeController.RespostaErro(resultado));
    }
}
