package com.hotelimperial.backend.dao;

import com.hotelimperial.backend.domain.EntidadeDominio;
import com.hotelimperial.backend.domain.Hospede;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import java.util.ArrayList;
import java.util.List;

@Component
public class HospedeDAO implements IDAO {

    @Autowired
    private HospedeRepository hospedeRepository;

    @Override
    public void salvar(EntidadeDominio entidade) {
        hospedeRepository.save((Hospede) entidade);
    }

    @Override
    public void alterar(EntidadeDominio entidade) {
        hospedeRepository.save((Hospede) entidade);
    }

    @Override
    public void inativar(EntidadeDominio entidade) {
        Hospede hospede = (Hospede) entidade;
        hospede.setInativo(true);
        hospedeRepository.save(hospede);
    }

    @Override
    public List<EntidadeDominio> consultar(EntidadeDominio entidade) {
        List<EntidadeDominio> res = new ArrayList<>();
        if (entidade != null && entidade.getId() != null) {
            hospedeRepository.findById(entidade.getId()).ifPresent(res::add);
        } else {
            res.addAll(hospedeRepository.findAll());
        }
        return res;
    }
}
