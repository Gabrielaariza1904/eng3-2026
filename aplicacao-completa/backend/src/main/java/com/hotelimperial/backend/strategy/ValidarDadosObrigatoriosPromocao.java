package com.hotelimperial.backend.strategy;

import com.hotelimperial.backend.domain.EntidadeDominio;
import com.hotelimperial.backend.domain.Promocao;
import org.springframework.stereotype.Component;

@Component
public class ValidarDadosObrigatoriosPromocao implements IStrategy {

    @Override
    public String processar(EntidadeDominio entidade) {
        if (entidade instanceof Promocao) {
            Promocao p = (Promocao) entidade;
            if (p.getCodigo() == null || p.getCodigo().trim().isEmpty()) return "O código da promoção é obrigatório.";
            if (p.getDescricao() == null || p.getDescricao().trim().isEmpty()) return "A descrição é obrigatória.";
            if (p.getDescontoPercentual() == null || p.getDescontoPercentual() <= 0 || p.getDescontoPercentual() > 100) {
                return "O desconto percentual deve ser um valor entre 0.1 e 100.";
            }
        }
        return null;
    }
}
