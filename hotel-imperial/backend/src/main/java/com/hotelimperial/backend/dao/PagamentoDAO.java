package com.hotelimperial.backend.dao;

import com.hotelimperial.backend.domain.EntidadeDominio;
import com.hotelimperial.backend.domain.Pagamento;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import java.util.ArrayList;
import java.util.List;

@Component
public class PagamentoDAO implements IDAO {

    @Autowired
    private PagamentoRepository repository;

    @Override
    public void salvar(EntidadeDominio entidade) {
        repository.save((Pagamento) entidade);
    }

    @Override
    public void alterar(EntidadeDominio entidade) {
        repository.save((Pagamento) entidade);
    }

    @Override
    public void inativar(EntidadeDominio entidade) {
        repository.delete((Pagamento) entidade);
    }

    @Override
    public List<EntidadeDominio> consultar(EntidadeDominio entidade) {
        List<EntidadeDominio> res = new ArrayList<>();
        if (entidade != null && entidade.getId() != null) {
            repository.findById(entidade.getId()).ifPresent(res::add);
        } else {
            res.addAll(repository.findAll());
        }
        return res;
    }
}
