package com.hotelimperial.backend.domain;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;

@Entity
@Table(name = "politicas_cancelamento")
public class PoliticaCancelamento extends EntidadeDominio {
    private String descricao;
    private Integer horasAntecedencia;
    private Double percentualMulta;
    private boolean inativo;

    public PoliticaCancelamento() {}

    public String getDescricao() {
        return descricao;
    }

    public void setDescricao(String descricao) {
        this.descricao = descricao;
    }

    public Integer getHorasAntecedencia() {
        return horasAntecedencia;
    }

    public void setHorasAntecedencia(Integer horasAntecedencia) {
        this.horasAntecedencia = horasAntecedencia;
    }

    public Double getPercentualMulta() {
        return percentualMulta;
    }

    public void setPercentualMulta(Double percentualMulta) {
        this.percentualMulta = percentualMulta;
    }

    public boolean isInativo() {
        return inativo;
    }

    public void setInativo(boolean inativo) {
        this.inativo = inativo;
    }
}
