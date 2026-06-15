package com.hotelimperial.backend.strategy;

import com.hotelimperial.backend.domain.EntidadeDominio;
import com.hotelimperial.backend.domain.Reserva;
import org.springframework.stereotype.Component;

@Component
public class ValidarDatasReserva implements IStrategy {

    @Override
    public String processar(EntidadeDominio entidade) {
        if (entidade instanceof Reserva) {
            Reserva r = (Reserva) entidade;
            if (r.getDataEntrada() == null || r.getDataSaida() == null) {
                return null;
            }
            if (!r.getDataSaida().isAfter(r.getDataEntrada())) {
                return "A data de saída deve ser posterior à data de entrada.";
            }
        }
        return null;
    }
}
