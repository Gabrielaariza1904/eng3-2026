package com.hotelimperial.backend.strategy;

import com.hotelimperial.backend.domain.EntidadeDominio;

public interface IStrategy {
    String processar(EntidadeDominio entidade);
}
