package com.hotelimperial.backend.controller;

import com.hotelimperial.backend.domain.Pagamento;
import com.hotelimperial.backend.domain.StatusPagamento;
import com.hotelimperial.backend.facade.Fachada;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/pagamentos")
public class PagamentoController {

    @Autowired
    private Fachada fachada;

    @GetMapping
    public List<Pagamento> obterTodos() {
        return fachada.consultar(new Pagamento());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> obterPorId(@PathVariable Integer id) {
        Pagamento filtro = new Pagamento();
        filtro.setId(id);
        List<Pagamento> res = fachada.consultar(filtro);
        if (res.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(res.get(0));
    }

    @PostMapping
    public ResponseEntity<?> criar(@RequestBody Pagamento pagamento) {
        if (pagamento.getDataPagamento() == null) {
            pagamento.setDataPagamento(LocalDateTime.now());
        }
        if (pagamento.getStatus() == null) {
            pagamento.setStatus(StatusPagamento.APROVADO);
        }
        String resultado = fachada.salvar(pagamento);
        if ("Sucesso".equals(resultado)) {
            return ResponseEntity.status(HttpStatus.CREATED).body(pagamento);
        }
        return ResponseEntity.badRequest().body(new HospedeController.RespostaErro(resultado));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> atualizar(@PathVariable Integer id, @RequestBody Pagamento pagamento) {
        pagamento.setId(id);
        String resultado = fachada.alterar(pagamento);
        if ("Sucesso".equals(resultado)) {
            return ResponseEntity.ok(pagamento);
        }
        return ResponseEntity.badRequest().body(new HospedeController.RespostaErro(resultado));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> remover(@PathVariable Integer id) {
        Pagamento filtro = new Pagamento();
        filtro.setId(id);
        List<Pagamento> res = fachada.consultar(filtro);
        if (res.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        String resultado = fachada.inativar(res.get(0)); // IDAO.inativar deletes it
        if ("Sucesso".equals(resultado)) {
            return ResponseEntity.ok(new HospedeController.RespostaSucesso("Pagamento removido com sucesso"));
        }
        return ResponseEntity.badRequest().body(new HospedeController.RespostaErro(resultado));
    }
}
