package com.hotelimperial.backend.strategy;

import com.hotelimperial.backend.dao.PromocaoRepository;
import com.hotelimperial.backend.domain.EntidadeDominio;
import com.hotelimperial.backend.domain.Promocao;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import java.util.Optional;

@Component
public class ValidarCodigoUnicoPromocao implements IStrategy {

    @Autowired
    private PromocaoRepository repository;

    @Override
    public String processar(EntidadeDominio entidade) {
        if (entidade instanceof Promocao) {
            Promocao p = (Promocao) entidade;
            if (p.getCodigo() == null || p.getCodigo().trim().isEmpty()) {
                return null;
            }
            Optional<Promocao> existing = repository.findByCodigo(p.getCodigo().toUpperCase());
            if (existing.isPresent() && !existing.get().getId().equals(p.getId())) {
                return "O código promocional \"" + p.getCodigo() + "\" já existe.";
            }
        }
        return null;
    }
}
