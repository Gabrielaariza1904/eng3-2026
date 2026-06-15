package com.hotelimperial.backend.facade;

import com.hotelimperial.backend.dao.*;
import com.hotelimperial.backend.domain.*;
import com.hotelimperial.backend.strategy.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import jakarta.annotation.PostConstruct;
import java.time.LocalDate;
import java.util.*;

@Component
public class Fachada {

    private final Map<String, IDAO> daos = new HashMap<>();
    private final Map<String, List<IStrategy>> strategies = new HashMap<>();

    @Autowired
    private HospedeDAO hospedeDAO;
    @Autowired
    private QuartoDAO quartoDAO;
    @Autowired
    private PromocaoDAO promocaoDAO;
    @Autowired
    private PoliticaCancelamentoDAO politicaCancelamentoDAO;
    @Autowired
    private ReservaDAO reservaDAO;
    @Autowired
    private PagamentoDAO pagamentoDAO;

    @Autowired
    private QuartoRepository quartoRepository;
    @Autowired
    private ReservaRepository reservaRepository;

    // Strategies
    @Autowired
    private ValidarCpfUnico validarCpfUnico;
    @Autowired
    private ValidarEmail validarEmail;
    @Autowired
    private ValidarDadosObrigatoriosHospede validarDadosObrigatoriosHospede;
    @Autowired
    private ValidarNumeroUnicoQuarto validarNumeroUnicoQuarto;
    @Autowired
    private ValidarDadosObrigatoriosQuarto validarDadosObrigatoriosQuarto;
    @Autowired
    private ValidarCodigoUnicoPromocao validarCodigoUnicoPromocao;
    @Autowired
    private ValidarDadosObrigatoriosPromocao validarDadosObrigatoriosPromocao;
    @Autowired
    private ValidarDadosObrigatoriosPolitica validarDadosObrigatoriosPolitica;
    @Autowired
    private ValidarDadosObrigatoriosReserva validarDadosObrigatoriosReserva;
    @Autowired
    private ValidarDatasReserva validarDatasReserva;
    @Autowired
    private ValidarCapacidadeQuartoReserva validarCapacidadeQuartoReserva;
    @Autowired
    private ValidarDisponibilidadeQuartoReserva validarDisponibilidadeQuartoReserva;
    @Autowired
    private ValidarDadosObrigatoriosPagamento validarDadosObrigatoriosPagamento;

    @PostConstruct
    public void init() {
        // Map DAOs
        daos.put(Hospede.class.getSimpleName(), hospedeDAO);
        daos.put(Quarto.class.getSimpleName(), quartoDAO);
        daos.put(Promocao.class.getSimpleName(), promocaoDAO);
        daos.put(PoliticaCancelamento.class.getSimpleName(), politicaCancelamentoDAO);
        daos.put(Reserva.class.getSimpleName(), reservaDAO);
        daos.put(Pagamento.class.getSimpleName(), pagamentoDAO);

        // Map Strategies
        strategies.put(Hospede.class.getSimpleName(), Arrays.asList(
                validarDadosObrigatoriosHospede, validarCpfUnico, validarEmail
        ));
        strategies.put(Quarto.class.getSimpleName(), Arrays.asList(
                validarDadosObrigatoriosQuarto, validarNumeroUnicoQuarto
        ));
        strategies.put(Promocao.class.getSimpleName(), Arrays.asList(
                validarDadosObrigatoriosPromocao, validarCodigoUnicoPromocao
        ));
        strategies.put(PoliticaCancelamento.class.getSimpleName(), Collections.singletonList(
                validarDadosObrigatoriosPolitica
        ));
        strategies.put(Reserva.class.getSimpleName(), Arrays.asList(
                validarDadosObrigatoriosReserva, validarDatasReserva,
                validarCapacidadeQuartoReserva, validarDisponibilidadeQuartoReserva
        ));
        strategies.put(Pagamento.class.getSimpleName(), Collections.singletonList(
                validarDadosObrigatoriosPagamento
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
            posProcessamento(entidade);
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
            posProcessamento(entidade);
            return "Sucesso";
        }
        return "Erro: DAO não encontrado.";
    }

    public String inativar(EntidadeDominio entidade) {
        IDAO dao = obterDAO(entidade);
        if (dao != null) {
            dao.inativar(entidade);
            posProcessamento(entidade);
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

    private void posProcessamento(EntidadeDominio entidade) {
        if (entidade instanceof Reserva) {
            atualizarStatusQuartoPorReservas();
        }
    }

    public void atualizarStatusQuartoPorReservas() {
        List<Quarto> quartos = quartoRepository.findAll();
        List<Reserva> reservas = reservaRepository.findAll();
        LocalDate hoje = LocalDate.now();

        for (Quarto q : quartos) {
            if (q.getStatus() != StatusQuarto.MANUTENCAO) {
                q.setStatus(StatusQuarto.DISPONIVEL);
            }
        }

        for (Reserva r : reservas) {
            if (r.getStatus() == StatusReserva.CONFIRMADA 
                && r.isCheckinRealizado() 
                && !hoje.isBefore(r.getDataEntrada()) 
                && !hoje.isAfter(r.getDataSaida())) {
                
                for (Quarto q : quartos) {
                    if (q.getId().equals(r.getQuarto().getId())) {
                        if (q.getStatus() != StatusQuarto.MANUTENCAO) {
                            q.setStatus(StatusQuarto.OCUPADO);
                        }
                    }
                }
            }
        }

        quartoRepository.saveAll(quartos);
    }
}
