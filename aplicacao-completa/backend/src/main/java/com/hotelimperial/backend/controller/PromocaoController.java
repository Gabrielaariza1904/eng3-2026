package com.hotelimperial.backend.controller;

import com.hotelimperial.backend.domain.Promocao;
import com.hotelimperial.backend.facade.Fachada;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/promocoes")
public class PromocaoController {

    @Autowired
    private Fachada fachada;

    @GetMapping
    public List<Promocao> obterTodas() {
        return fachada.consultar(new Promocao());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> obterPorId(@PathVariable Integer id) {
        Promocao filtro = new Promocao();
        filtro.setId(id);
        List<Promocao> res = fachada.consultar(filtro);
        if (res.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(res.get(0));
    }

    @PostMapping
    public ResponseEntity<?> criar(@RequestBody Promocao promocao) {
        promocao.setInativo(false);
        String resultado = fachada.salvar(promocao);
        if ("Sucesso".equals(resultado)) {
            return ResponseEntity.status(HttpStatus.CREATED).body(promocao);
        }
        return ResponseEntity.badRequest().body(new HospedeController.RespostaErro(resultado));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> atualizar(@PathVariable Integer id, @RequestBody Promocao promocao) {
        promocao.setId(id);
        String resultado = fachada.alterar(promocao);
        if ("Sucesso".equals(resultado)) {
            return ResponseEntity.ok(promocao);
        }
        return ResponseEntity.badRequest().body(new HospedeController.RespostaErro(resultado));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> inativar(@PathVariable Integer id) {
        Promocao filtro = new Promocao();
        filtro.setId(id);
        List<Promocao> res = fachada.consultar(filtro);
        if (res.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        String resultado = fachada.inativar(res.get(0));
        if ("Sucesso".equals(resultado)) {
            return ResponseEntity.ok(new HospedeController.RespostaSucesso("Promoção inativada com sucesso"));
        }
        return ResponseEntity.badRequest().body(new HospedeController.RespostaErro(resultado));
    }

    @PatchMapping("/{id}/reativar")
    public ResponseEntity<?> reativar(@PathVariable Integer id) {
        Promocao filtro = new Promocao();
        filtro.setId(id);
        List<Promocao> res = fachada.consultar(filtro);
        if (res.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        Promocao p = res.get(0);
        p.setInativo(false);
        String resultado = fachada.alterar(p);
        if ("Sucesso".equals(resultado)) {
            return ResponseEntity.ok(new HospedeController.RespostaSucesso("Promoção reativada com sucesso"));
        }
        return ResponseEntity.badRequest().body(new HospedeController.RespostaErro(resultado));
    }
}
