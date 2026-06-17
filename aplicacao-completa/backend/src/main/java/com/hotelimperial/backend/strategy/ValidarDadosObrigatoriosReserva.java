package com.hotelimperial.backend.strategy;

import com.hotelimperial.backend.domain.EntidadeDominio;
import com.hotelimperial.backend.domain.Reserva;
import org.springframework.stereotype.Component;

@Component
public class ValidarDadosObrigatoriosReserva implements IStrategy {

    @Override
    public String processar(EntidadeDominio entidade) {
        if (entidade instanceof Reserva) {
            Reserva r = (Reserva) entidade;
            if (r.getHospede() == null || r.getHospede().getId() == null) return "Selecione um hóspede.";
            if (r.getQuarto() == null || r.getQuarto().getId() == null) return "Selecione um quarto.";
            if (r.getDataEntrada() == null) return "Selecione a data de entrada.";
            if (r.getDataSaida() == null) return "Selecione a data de saída.";
            if (r.getQtdAdultos() == null || r.getQtdAdultos() < 1) return "Informe pelo menos 1 adulto.";
            if (r.getPoliticaCancelamento() == null || r.getPoliticaCancelamento().getId() == null) {
                return "Selecione uma política de cancelamento.";
            }
        }
        return null;
    }
}
