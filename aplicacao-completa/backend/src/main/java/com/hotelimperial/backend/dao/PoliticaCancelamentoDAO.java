package com.hotelimperial.backend.dao;

import com.hotelimperial.backend.domain.EntidadeDominio;
import com.hotelimperial.backend.domain.PoliticaCancelamento;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import java.util.ArrayList;
import java.util.List;

@Component
public class PoliticaCancelamentoDAO implements IDAO {

    @Autowired
    private PoliticaCancelamentoRepository repository;

    @Override
    public void salvar(EntidadeDominio entidade) {
        repository.save((PoliticaCancelamento) entidade);
    }

    @Override
    public void alterar(EntidadeDominio entidade) {
        repository.save((PoliticaCancelamento) entidade);
    }

    @Override
    public void inativar(EntidadeDominio entidade) {
        PoliticaCancelamento politica = (PoliticaCancelamento) entidade;
        politica.setInativo(true);
        repository.save(politica);
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
