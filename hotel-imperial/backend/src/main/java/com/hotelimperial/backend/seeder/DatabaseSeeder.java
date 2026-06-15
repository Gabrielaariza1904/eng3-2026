package com.hotelimperial.backend.seeder;

import com.hotelimperial.backend.dao.*;
import com.hotelimperial.backend.domain.*;
import com.hotelimperial.backend.facade.Fachada;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Component
public class DatabaseSeeder implements CommandLineRunner {

    @Autowired
    private EstadoRepository estadoRepository;
    @Autowired
    private CidadeRepository cidadeRepository;
    @Autowired
    private HospedeRepository hospedeRepository;
    @Autowired
    private QuartoRepository quartoRepository;
    @Autowired
    private PromocaoRepository promocaoRepository;
    @Autowired
    private PoliticaCancelamentoRepository politicaCancelamentoRepository;
    @Autowired
    private ReservaRepository reservaRepository;
    @Autowired
    private PagamentoRepository pagamentoRepository;
    @Autowired
    private Fachada fachada;

    @Override
    public void run(String... args) {
        if (hospedeRepository.count() > 0) {
            return; // Already seeded
        }

        // 1. States & Cities
        Estado sp = estadoRepository.save(new Estado("São Paulo", "SP"));
        Estado rj = estadoRepository.save(new Estado("Rio de Janeiro", "RJ"));
        Estado mg = estadoRepository.save(new Estado("Minas Gerais", "MG"));
        Estado pr = estadoRepository.save(new Estado("Paraná", "PR"));

        Cidade saoPaulo = cidadeRepository.save(new Cidade("São Paulo", sp));
        Cidade rioJaneiro = cidadeRepository.save(new Cidade("Rio de Janeiro", rj));
        Cidade beloHorizonte = cidadeRepository.save(new Cidade("Belo Horizonte", mg));
        Cidade campinas = cidadeRepository.save(new Cidade("Campinas", sp));
        Cidade curitiba = cidadeRepository.save(new Cidade("Curitiba", pr));

        // 2. Guests
        Hospede joao = criarHospede("João da Silva", "111.222.333-44", "joao@email.com", "(11) 98888-7777", false, "Avenida Paulista", "1000", "01310-100", "Bela Vista", "Apto 42", saoPaulo);
        Hospede maria = criarHospede("Maria Oliveira", "555.666.777-88", "maria@email.com", "(21) 97777-6666", true, "Rua Copacabana", "250", "22020-002", "Copacabana", "", rioJaneiro);
        Hospede carlos = criarHospede("Carlos Eduardo Santos", "222.333.444-55", "carlos.santos@email.com", "(31) 96666-5555", false, "Praça da Liberdade", "12", "30140-010", "Funcionários", "Sala 201", beloHorizonte);
        Hospede ana = criarHospede("Ana Julia Souza", "333.444.555-66", "ana.souza@email.com", "(19) 95555-4444", false, "Rua Barão de Jaguara", "950", "13015-002", "Centro", "", campinas);
        Hospede roberto = criarHospede("Roberto Lima", "444.555.666-77", "roberto.lima@email.com", "(41) 94444-3333", false, "Rua das Flores", "100", "80020-300", "Centro", "Bloco B", curitiba);

        // 3. Rooms
        Quarto q101 = criarQuarto("101", "Standard Casal", 2, 1, 150.0, StatusQuarto.DISPONIVEL);
        Quarto q102 = criarQuarto("102", "Standard Solteiro", 1, 0, 100.0, StatusQuarto.DISPONIVEL);
        Quarto q201 = criarQuarto("201", "Luxo Casal", 2, 1, 250.0, StatusQuarto.OCUPADO);
        Quarto q202 = criarQuarto("202", "Luxo Duplo", 2, 2, 300.0, StatusQuarto.DISPONIVEL);
        Quarto q301 = criarQuarto("301", "Suíte Master", 4, 2, 600.0, StatusQuarto.MANUTENCAO);
        Quarto q302 = criarQuarto("302", "Suíte Premium", 3, 1, 450.0, StatusQuarto.DISPONIVEL);

        // 4. Promotions
        Promocao p1 = criarPromocao("BEMVINDO15", "Desconto de Boas-vindas", 15.0, false);
        Promocao p2 = criarPromocao("FIMDESEMANA", "Promoção de Fim de Semana", 10.0, false);
        Promocao p3 = criarPromocao("INVERNO20", "Cupom Promocional de Inverno", 20.0, true);

        // 5. Cancellation Policies
        PoliticaCancelamento pol1 = criarPolitica("Flexível - Cancelamento grátis até 24h antes", 24, 0.0, false);
        PoliticaCancelamento pol2 = criarPolitica("Moderada - Cancelamento até 48h com multa de 10%", 48, 10.0, false);
        PoliticaCancelamento pol3 = criarPolitica("Rígida - Cancelamento até 72h com multa de 25%", 72, 25.0, false);

        // 6. Reservations
        Reserva r1 = criarReserva(joao, q201, LocalDate.of(2026, 6, 12), LocalDate.of(2026, 6, 16), true, false, 2, 0, 1000.0, p1, pol1, StatusReserva.CONFIRMADA);
        Reserva r2 = criarReserva(carlos, q102, LocalDate.of(2026, 6, 10), LocalDate.of(2026, 6, 13), true, false, 1, 0, 300.0, null, pol1, StatusReserva.CONCLUIDA);
        Reserva r3 = criarReserva(ana, q202, LocalDate.of(2026, 6, 18), LocalDate.of(2026, 6, 22), false, false, 2, 1, 1200.0, null, pol2, StatusReserva.PENDENTE);
        Reserva r4 = criarReserva(roberto, q301, LocalDate.of(2026, 6, 5), LocalDate.of(2026, 6, 8), false, false, 2, 2, 1800.0, null, pol3, StatusReserva.CANCELADA);

        // 7. Payments
        criarPagamento(r1, LocalDateTime.of(2026, 6, 12, 14, 30), 1000.0, StatusPagamento.APROVADO, "Pix");
        criarPagamento(r2, LocalDateTime.of(2026, 6, 10, 10, 15), 300.0, StatusPagamento.APROVADO, "Cartão de Crédito");

        // Refresh status
        fachada.atualizarStatusQuartoPorReservas();
    }

    private Hospede criarHospede(String nome, String cpf, String email, String telefone, boolean inativo, String logradouro, String numero, String cep, String bairro, String complemento, Cidade cidade) {
        Hospede h = new Hospede();
        h.setNome(nome);
        h.setCpf(cpf);
        h.setEmail(email);
        h.setTelefone(telefone);
        h.setInativo(inativo);

        Endereco end = new Endereco();
        end.setLogradouro(logradouro);
        end.setNumero(numero);
        end.setCep(cep);
        end.setBairro(bairro);
        end.setComplemento(complemento);
        end.setCidade(cidade);
        h.setEndereco(end);

        return hospedeRepository.save(h);
    }

    private Quarto criarQuarto(String numero, String tipo, Integer capAd, Integer capCr, Double valor, StatusQuarto status) {
        Quarto q = new Quarto();
        q.setNumero(numero);
        q.setTipo(tipo);
        q.setCapacidadeAdultos(capAd);
        q.setCapacidadeCriancas(capCr);
        q.setValorDiaria(valor);
        q.setStatus(status);
        return quartoRepository.save(q);
    }

    private Promocao criarPromocao(String codigo, String descricao, Double desconto, boolean inativo) {
        Promocao p = new Promocao();
        p.setCodigo(codigo);
        p.setDescricao(descricao);
        p.setDescontoPercentual(desconto);
        p.setInativo(inativo);
        return promocaoRepository.save(p);
    }

    private PoliticaCancelamento criarPolitica(String descricao, Integer horas, Double multa, boolean inativo) {
        PoliticaCancelamento pc = new PoliticaCancelamento();
        pc.setDescricao(descricao);
        pc.setHorasAntecedencia(horas);
        pc.setPercentualMulta(multa);
        pc.setInativo(inativo);
        return politicaCancelamentoRepository.save(pc);
    }

    private Reserva criarReserva(Hospede hospede, Quarto quarto, LocalDate entrada, LocalDate saida, boolean checkin, boolean noShow, Integer ad, Integer cr, Double total, Promocao promo, PoliticaCancelamento pol, StatusReserva status) {
        Reserva r = new Reserva();
        r.setHospede(hospede);
        r.setQuarto(quarto);
        r.setDataEntrada(entrada);
        r.setDataSaida(saida);
        r.setCheckinRealizado(checkin);
        r.setNoShow(noShow);
        r.setQtdAdultos(ad);
        r.setQtdCriancas(cr);
        r.setValorTotal(total);
        r.setPromocao(promo);
        r.setPoliticaCancelamento(pol);
        r.setStatus(status);
        return reservaRepository.save(r);
    }

    private void criarPagamento(Reserva reserva, LocalDateTime data, Double valor, StatusPagamento status, String forma) {
        Pagamento p = new Pagamento();
        p.setReserva(reserva);
        p.setDataPagamento(data);
        p.setValor(valor);
        p.setStatus(status);
        p.setFormaPagamento(forma);
        pagamentoRepository.save(p);
    }
}
