package com.hotelimperial.backend.strategy;

import com.hotelimperial.backend.domain.EntidadeDominio;
import com.hotelimperial.backend.domain.PoliticaCancelamento;
import org.springframework.stereotype.Component;

@Component
public class ValidarDadosObrigatoriosPolitica implements IStrategy {

    @Override
    public String processar(EntidadeDominio entidade) {
        if (entidade instanceof PoliticaCancelamento) {
            PoliticaCancelamento p = (PoliticaCancelamento) entidade;
            if (p.getDescricao() == null || p.getDescricao().trim().isEmpty()) return "A descrição da política é obrigatória.";
            if (p.getHorasAntecedencia() == null || p.getHorasAntecedencia() < 0) return "Horas de antecedência inválidas.";
            if (p.getPercentualMulta() == null || p.getPercentualMulta() < 0 || p.getPercentualMulta() > 100) {
                return "O percentual de multa deve ser entre 0 e 100.";
            }
        }
        return null;
    }
}
