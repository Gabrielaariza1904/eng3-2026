package com.hotelimperial.backend.strategy;

import com.hotelimperial.backend.domain.EntidadeDominio;
import com.hotelimperial.backend.domain.Quarto;
import org.springframework.stereotype.Component;

@Component
public class ValidarDadosObrigatoriosQuarto implements IStrategy {

    @Override
    public String processar(EntidadeDominio entidade) {
        if (entidade instanceof Quarto) {
            Quarto q = (Quarto) entidade;
            if (q.getNumero() == null || q.getNumero().trim().isEmpty()) return "O número do quarto é obrigatório.";
            if (q.getTipo() == null || q.getTipo().trim().isEmpty()) return "O tipo do quarto é obrigatório.";
            if (q.getCapacidadeAdultos() == null || q.getCapacidadeAdultos() < 1) return "A capacidade de adultos deve ser pelo menos 1.";
            if (q.getValorDiaria() == null || q.getValorDiaria() <= 0) return "O valor da diária deve ser maior que zero.";
        }
        return null;
    }
}
