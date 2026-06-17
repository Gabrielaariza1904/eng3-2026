package com.hotelimperial.backend.strategy;

import com.hotelimperial.backend.dao.QuartoRepository;
import com.hotelimperial.backend.domain.EntidadeDominio;
import com.hotelimperial.backend.domain.Quarto;
import com.hotelimperial.backend.domain.Reserva;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import java.util.Optional;

@Component
public class ValidarCapacidadeQuartoReserva implements IStrategy {

    @Autowired
    private QuartoRepository quartoRepository;

    @Override
    public String processar(EntidadeDominio entidade) {
        if (entidade instanceof Reserva) {
            Reserva r = (Reserva) entidade;
            if (r.getQuarto() == null || r.getQuarto().getId() == null) {
                return null;
            }
            Optional<Quarto> quartoOpt = quartoRepository.findById(r.getQuarto().getId());
            if (quartoOpt.isEmpty()) {
                return "Quarto selecionado não existe.";
            }
            Quarto q = quartoOpt.get();
            if (r.getQtdAdultos() != null && r.getQtdAdultos() > q.getCapacidadeAdultos()) {
                return "Capacidade de adultos excedida para este quarto. Máximo permitido: " + q.getCapacidadeAdultos() + ".";
            }
            int qtdCriancas = r.getQtdCriancas() != null ? r.getQtdCriancas() : 0;
            int capCriancas = q.getCapacidadeCriancas() != null ? q.getCapacidadeCriancas() : 0;
            if (qtdCriancas > capCriancas) {
                return "Capacidade de crianças excedida para este quarto. Máximo permitido: " + capCriancas + ".";
            }
        }
        return null;
    }
}
