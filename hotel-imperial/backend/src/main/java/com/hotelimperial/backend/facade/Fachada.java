package com.hotelimperial.backend.facade;

import com.hotelimperial.backend.dao.*;
import com.hotelimperial.backend.domain.*;
import com.hotelimperial.backend.strategy.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import jakarta.annotation.PostConstruct;
import java.util.*;

@Component
public class Fachada {

    private final Map<String, IDAO> daos = new HashMap<>();
    private final Map<String, List<IStrategy>> strategies = new HashMap<>();

    @Autowired
    private HospedeDAO hospedeDAO;

    // Strategies
    @Autowired
    private ValidarCpfUnico validarCpfUnico;
    @Autowired
    private ValidarEmail validarEmail;
    @Autowired
    private ValidarDadosObrigatoriosHospede validarDadosObrigatoriosHospede;

    @PostConstruct
    public void init() {
        // Map DAOs
        daos.put(Hospede.class.getSimpleName(), hospedeDAO);

        // Map Strategies
        strategies.put(Hospede.class.getSimpleName(), Arrays.asList(
                validarDadosObrigatoriosHospede, validarCpfUnico, validarEmail
        ));
    }

    public String salvar(EntidadeDominio entidade) {
        String erro = executarStrategies(entidade);
        if (erro != null) {
            return erro;
        }

        IDAO dao = obterDAO(entidade);
        if (dao != null) {
            dao.salvar(entidade);
            return "Sucesso";
        }
        return "Erro: DAO não encontrado.";
    }

    public String alterar(EntidadeDominio entidade) {
        String erro = executarStrategies(entidade);
        if (erro != null) {
            return erro;
        }

        IDAO dao = obterDAO(entidade);
        if (dao != null) {
            dao.alterar(entidade);
            return "Sucesso";
        }
        return "Erro: DAO não encontrado.";
    }

    public String inativar(EntidadeDominio entidade) {
        IDAO dao = obterDAO(entidade);
        if (dao != null) {
            dao.inativar(entidade);
            return "Sucesso";
        }
        return "Erro: DAO não encontrado.";
    }

    @SuppressWarnings("unchecked")
    public <T extends EntidadeDominio> List<T> consultar(T entidade) {
        IDAO dao = daos.get(entidade.getClass().getSimpleName());
        if (dao != null) {
            return (List<T>) (List<?>) dao.consultar(entidade);
        }
        return Collections.emptyList();
    }

    private String executarStrategies(EntidadeDominio entidade) {
        List<IStrategy> list = strategies.get(entidade.getClass().getSimpleName());
        if (list != null) {
            for (IStrategy strategy : list) {
                String erro = strategy.processar(entidade);
                if (erro != null) {
                    return erro;
                }
            }
        }
        return null;
    }

    private IDAO obterDAO(EntidadeDominio entidade) {
        return daos.get(entidade.getClass().getSimpleName());
    }
}
