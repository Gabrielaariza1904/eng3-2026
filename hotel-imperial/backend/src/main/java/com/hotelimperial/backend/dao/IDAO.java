package com.hotelimperial.backend.dao;

import com.hotelimperial.backend.domain.EntidadeDominio;
import java.util.List;

public interface IDAO {
    void salvar(EntidadeDominio entidade);
    void alterar(EntidadeDominio entidade);
    void inativar(EntidadeDominio entidade);
    List<EntidadeDominio> consultar(EntidadeDominio entidade);
}
