package com.hotelimperial.backend.strategy;

import com.hotelimperial.backend.domain.EntidadeDominio;
import com.hotelimperial.backend.domain.Pagamento;
import org.springframework.stereotype.Component;

@Component
public class ValidarDadosObrigatoriosPagamento implements IStrategy {

    @Override
    public String processar(EntidadeDominio entidade) {
        if (entidade instanceof Pagamento) {
            Pagamento p = (Pagamento) entidade;
            if (p.getReserva() == null || p.getReserva().getId() == null) return "Selecione a reserva correspondente.";
            if (p.getValor() == null || p.getValor() <= 0) return "O valor do pagamento deve ser maior que zero.";
            if (p.getFormaPagamento() == null || p.getFormaPagamento().trim().isEmpty()) return "Selecione a forma de pagamento.";
        }
        return null;
    }
}
