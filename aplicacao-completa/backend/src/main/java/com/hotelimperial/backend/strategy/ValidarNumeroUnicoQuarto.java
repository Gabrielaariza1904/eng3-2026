package com.hotelimperial.backend.strategy;

import com.hotelimperial.backend.dao.QuartoRepository;
import com.hotelimperial.backend.domain.EntidadeDominio;
import com.hotelimperial.backend.domain.Quarto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import java.util.Optional;

@Component
public class ValidarNumeroUnicoQuarto implements IStrategy {

    @Autowired
    private QuartoRepository repository;

    @Override
    public String processar(EntidadeDominio entidade) {
        if (entidade instanceof Quarto) {
            Quarto q = (Quarto) entidade;
            if (q.getNumero() == null || q.getNumero().trim().isEmpty()) {
                return null;
            }
            Optional<Quarto> existing = repository.findByNumero(q.getNumero());
            if (existing.isPresent() && !existing.get().getId().equals(q.getId())) {
                return "O quarto número \"" + q.getNumero() + "\" já está cadastrado.";
            }
        }
        return null;
    }
}
