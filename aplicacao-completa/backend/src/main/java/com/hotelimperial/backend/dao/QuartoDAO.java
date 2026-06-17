package com.hotelimperial.backend.dao;

import com.hotelimperial.backend.domain.EntidadeDominio;
import com.hotelimperial.backend.domain.Quarto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import java.util.ArrayList;
import java.util.List;

@Component
public class QuartoDAO implements IDAO {

    @Autowired
    private QuartoRepository quartoRepository;

    @Override
    public void salvar(EntidadeDominio entidade) {
        quartoRepository.save((Quarto) entidade);
    }

    @Override
    public void alterar(EntidadeDominio entidade) {
        quartoRepository.save((Quarto) entidade);
    }

    @Override
    public void inativar(EntidadeDominio entidade) {
        // Rooms don't have "inativo" but status can be changed, or we can implement inativar if needed
        quartoRepository.delete((Quarto) entidade);
    }

    @Override
    public List<EntidadeDominio> consultar(EntidadeDominio entidade) {
        List<EntidadeDominio> res = new ArrayList<>();
        if (entidade != null && entidade.getId() != null) {
            quartoRepository.findById(entidade.getId()).ifPresent(res::add);
        } else {
            res.addAll(quartoRepository.findAll());
        }
        return res;
    }
}
