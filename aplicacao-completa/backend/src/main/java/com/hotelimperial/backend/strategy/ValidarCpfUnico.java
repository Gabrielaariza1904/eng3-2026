package com.hotelimperial.backend.strategy;

import com.hotelimperial.backend.dao.HospedeRepository;
import com.hotelimperial.backend.domain.EntidadeDominio;
import com.hotelimperial.backend.domain.Hospede;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import java.util.Optional;

@Component
public class ValidarCpfUnico implements IStrategy {

    @Autowired
    private HospedeRepository repository;

    @Override
    public String processar(EntidadeDominio entidade) {
        if (entidade instanceof Hospede) {
            Hospede hospede = (Hospede) entidade;
            if (hospede.getCpf() == null || hospede.getCpf().trim().isEmpty()) {
                return null;
            }
            Optional<Hospede> existing = repository.findByCpf(hospede.getCpf());
            if (existing.isPresent() && !existing.get().getId().equals(hospede.getId())) {
                return "O CPF \"" + hospede.getCpf() + "\" já está cadastrado para outro hóspede.";
            }
        }
        return null;
    }
}
