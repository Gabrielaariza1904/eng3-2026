package com.hotelimperial.backend.strategy;

import com.hotelimperial.backend.domain.EntidadeDominio;
import com.hotelimperial.backend.domain.Hospede;
import org.springframework.stereotype.Component;
import java.util.regex.Pattern;

@Component
public class ValidarEmail implements IStrategy {
    private static final Pattern EMAIL_PATTERN = Pattern.compile("^[\\w!#$%&'*+/=?`{|}~^-]+(?:\\.[\\w!#$%&'*+/=?`{|}~^-]+)*@(?:[a-zA-Z0-9-]+\\.)+[a-zA-Z]{2,6}$");

    @Override
    public String processar(EntidadeDominio entidade) {
        if (entidade instanceof Hospede) {
            Hospede hospede = (Hospede) entidade;
            if (hospede.getEmail() == null || hospede.getEmail().trim().isEmpty()) {
                return null;
            }
            if (!EMAIL_PATTERN.matcher(hospede.getEmail()).matches()) {
                return "O e-mail \"" + hospede.getEmail() + "\" é inválido.";
            }
        }
        return null;
    }
}
