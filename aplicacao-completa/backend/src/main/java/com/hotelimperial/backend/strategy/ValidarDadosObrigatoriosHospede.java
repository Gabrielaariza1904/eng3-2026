package com.hotelimperial.backend.strategy;

import com.hotelimperial.backend.domain.EntidadeDominio;
import com.hotelimperial.backend.domain.Hospede;
import org.springframework.stereotype.Component;

@Component
public class ValidarDadosObrigatoriosHospede implements IStrategy {

    @Override
    public String processar(EntidadeDominio entidade) {
        if (entidade instanceof Hospede) {
            Hospede h = (Hospede) entidade;
            if (h.getNome() == null || h.getNome().trim().isEmpty()) return "O campo \"NOME\" é obrigatório.";
            if (h.getCpf() == null || h.getCpf().trim().isEmpty()) return "O campo \"CPF\" é obrigatório.";
            if (h.getEmail() == null || h.getEmail().trim().isEmpty()) return "O campo \"EMAIL\" é obrigatório.";
            if (h.getTelefone() == null || h.getTelefone().trim().isEmpty()) return "O campo \"TELEFONE\" é obrigatório.";
            
            if (h.getEndereco() == null 
                || h.getEndereco().getCep() == null || h.getEndereco().getCep().trim().isEmpty()
                || h.getEndereco().getLogradouro() == null || h.getEndereco().getLogradouro().trim().isEmpty()
                || h.getEndereco().getNumero() == null || h.getEndereco().getNumero().trim().isEmpty()
                || h.getEndereco().getBairro() == null || h.getEndereco().getBairro().trim().isEmpty()
                || h.getEndereco().getCidade() == null 
                || h.getEndereco().getCidade().getNome() == null || h.getEndereco().getCidade().getNome().trim().isEmpty()
                || h.getEndereco().getCidade().getEstado() == null
                || h.getEndereco().getCidade().getEstado().getUf() == null || h.getEndereco().getCidade().getEstado().getUf().trim().isEmpty()) {
                return "Todos os campos de Endereço (CEP, Logradouro, Número, Bairro, Cidade, Estado) são obrigatórios.";
            }
        }
        return null;
    }
}
