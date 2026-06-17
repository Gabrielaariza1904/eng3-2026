package com.hotelimperial.backend.seeder;

import com.hotelimperial.backend.dao.*;
import com.hotelimperial.backend.domain.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DatabaseSeeder implements CommandLineRunner {

    @Autowired
    private EstadoRepository estadoRepository;
    @Autowired
    private CidadeRepository cidadeRepository;
    @Autowired
    private HospedeRepository hospedeRepository;

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
        criarHospede("João da Silva", "111.222.333-44", "joao@email.com", "(11) 98888-7777", false, "Avenida Paulista", "1000", "01310-100", "Bela Vista", "Apto 42", saoPaulo);
        criarHospede("Maria Oliveira", "555.666.777-88", "maria@email.com", "(21) 97777-6666", true, "Rua Copacabana", "250", "22020-002", "Copacabana", "", rioJaneiro);
        criarHospede("Carlos Eduardo Santos", "222.333.444-55", "carlos.santos@email.com", "(31) 96666-5555", false, "Praça da Liberdade", "12", "30140-010", "Funcionários", "Sala 201", beloHorizonte);
        criarHospede("Ana Julia Souza", "333.444.555-66", "ana.souza@email.com", "(19) 95555-4444", false, "Rua Barão de Jaguara", "950", "13015-002", "Centro", "", campinas);
        criarHospede("Roberto Lima", "444.555.666-77", "roberto.lima@email.com", "(41) 94444-3333", false, "Rua das Flores", "100", "80020-300", "Centro", "Bloco B", curitiba);
    }

    private void criarHospede(String nome, String cpf, String email, String telefone, boolean inativo, String logradouro, String numero, String cep, String bairro, String complemento, Cidade cidade) {
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

        hospedeRepository.save(h);
    }
}
