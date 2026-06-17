package com.hotelimperial.backend.strategy;

import com.hotelimperial.backend.dao.ReservaRepository;
import com.hotelimperial.backend.domain.EntidadeDominio;
import com.hotelimperial.backend.domain.Reserva;
import com.hotelimperial.backend.domain.StatusReserva;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import java.util.List;

@Component
public class ValidarDisponibilidadeQuartoReserva implements IStrategy {

    @Autowired
    private ReservaRepository repository;

    @Override
    public String processar(EntidadeDominio entidade) {
        if (entidade instanceof Reserva) {
            Reserva r = (Reserva) entidade;
            if (r.getQuarto() == null || r.getQuarto().getId() == null || r.getDataEntrada() == null || r.getDataSaida() == null) {
                return null;
            }
            List<Reserva> reservas = repository.findByQuartoId(r.getQuarto().getId());
            for (Reserva existing : reservas) {
                if (existing.getStatus() == StatusReserva.CANCELADA) {
                    continue;
                }
                if (r.getId() != null && r.getId().equals(existing.getId())) {
                    continue;
                }
                boolean overlap = (r.getDataEntrada().isBefore(existing.getDataSaida()) && r.getDataSaida().isAfter(existing.getDataEntrada()));
                if (overlap) {
                    return "O quarto já está reservado no período de " + existing.getDataEntrada() + " a " + existing.getDataSaida() + ".";
                }
            }
        }
        return null;
    }
}
