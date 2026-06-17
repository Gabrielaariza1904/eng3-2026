package com.hotelimperial.backend.dao;

import com.hotelimperial.backend.domain.EntidadeDominio;
import com.hotelimperial.backend.domain.Promocao;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import java.util.ArrayList;
import java.util.List;

@Component
public class PromocaoDAO implements IDAO {

    @Autowired
    private PromocaoRepository promocaoRepository;

    @Override
    public void salvar(EntidadeDominio entidade) {
        promocaoRepository.save((Promocao) entidade);
    }

    @Override
    public void alterar(EntidadeDominio entidade) {
        promocaoRepository.save((Promocao) entidade);
    }

    @Override
    public void inativar(EntidadeDominio entidade) {
        Promocao promocao = (Promocao) entidade;
        promocao.setInativo(true);
        promocaoRepository.save(promocao);
    }

    @Override
    public List<EntidadeDominio> consultar(EntidadeDominio entidade) {
        List<EntidadeDominio> res = new ArrayList<>();
        if (entidade != null && entidade.getId() != null) {
            promocaoRepository.findById(entidade.getId()).ifPresent(res::add);
        } else {
            res.addAll(promocaoRepository.findAll());
        }
        return res;
    }
}
