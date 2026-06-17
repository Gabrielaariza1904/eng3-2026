package com.hotelimperial.backend.controller;

import com.hotelimperial.backend.domain.Reserva;
import com.hotelimperial.backend.domain.StatusReserva;
import com.hotelimperial.backend.facade.Fachada;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reservas")
public class ReservaController {

    @Autowired
    private Fachada fachada;

    @GetMapping
    public List<Reserva> obterTodas() {
        return fachada.consultar(new Reserva());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> obterPorId(@PathVariable Integer id) {
        Reserva filtro = new Reserva();
        filtro.setId(id);
        List<Reserva> res = fachada.consultar(filtro);
        if (res.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(res.get(0));
    }

    @PostMapping
    public ResponseEntity<?> criar(@RequestBody Reserva reserva) {
        // By default, set status to CONFIRMADA like in the prototype
        if (reserva.getStatus() == null) {
            reserva.setStatus(StatusReserva.CONFIRMADA);
        }
        String resultado = fachada.salvar(reserva);
        if ("Sucesso".equals(resultado)) {
            return ResponseEntity.status(HttpStatus.CREATED).body(reserva);
        }
        return ResponseEntity.badRequest().body(new HospedeController.RespostaErro(resultado));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> atualizar(@PathVariable Integer id, @RequestBody Reserva reserva) {
        reserva.setId(id);
        String resultado = fachada.alterar(reserva);
        if ("Sucesso".equals(resultado)) {
            return ResponseEntity.ok(reserva);
        }
        return ResponseEntity.badRequest().body(new HospedeController.RespostaErro(resultado));
    }

    @PatchMapping("/{id}/checkin")
    public ResponseEntity<?> realizarCheckin(@PathVariable Integer id, @RequestParam boolean valor) {
        Reserva filtro = new Reserva();
        filtro.setId(id);
        List<Reserva> res = fachada.consultar(filtro);
        if (res.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        Reserva r = res.get(0);
        r.setCheckinRealizado(valor);
        String resultado = fachada.alterar(r);
        if ("Sucesso".equals(resultado)) {
            return ResponseEntity.ok(r);
        }
        return ResponseEntity.badRequest().body(new HospedeController.RespostaErro(resultado));
    }

    @PatchMapping("/{id}/cancelar")
    public ResponseEntity<?> cancelar(@PathVariable Integer id) {
        Reserva filtro = new Reserva();
        filtro.setId(id);
        List<Reserva> res = fachada.consultar(filtro);
        if (res.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        Reserva r = res.get(0);
        r.setStatus(StatusReserva.CANCELADA);
        String resultado = fachada.alterar(r);
        if ("Sucesso".equals(resultado)) {
            return ResponseEntity.ok(r);
        }
        return ResponseEntity.badRequest().body(new HospedeController.RespostaErro(resultado));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> remover(@PathVariable Integer id) {
        Reserva filtro = new Reserva();
        filtro.setId(id);
        List<Reserva> res = fachada.consultar(filtro);
        if (res.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        String resultado = fachada.inativar(res.get(0)); // IDAO.inativar deletes it
        if ("Sucesso".equals(resultado)) {
            return ResponseEntity.ok(new HospedeController.RespostaSucesso("Reserva removida com sucesso"));
        }
        return ResponseEntity.badRequest().body(new HospedeController.RespostaErro(resultado));
    }
}
