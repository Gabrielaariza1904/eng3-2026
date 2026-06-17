package com.hotelimperial.backend.domain;

import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Table;

@Entity
@Table(name = "quartos")
public class Quarto extends EntidadeDominio {
    private String numero;
    private String tipo;
    private Integer capacidadeAdultos;
    private Integer capacidadeCriancas;
    private Double valorDiaria;

    @Enumerated(EnumType.STRING)
    private StatusQuarto status;

    public Quarto() {}

    public String getNumero() {
        return numero;
    }

    public void setNumero(String numero) {
        this.numero = numero;
    }

    public String getTipo() {
        return tipo;
    }

    public void setTipo(String tipo) {
        this.tipo = tipo;
    }

    public Integer getCapacidadeAdultos() {
        return capacidadeAdultos;
    }

    public void setCapacidadeAdultos(Integer capacidadeAdultos) {
        this.capacidadeAdultos = capacidadeAdultos;
    }

    public Integer getCapacidadeCriancas() {
        return capacidadeCriancas;
    }

    public void setCapacidadeCriancas(Integer capacidadeCriancas) {
        this.capacidadeCriancas = capacidadeCriancas;
    }

    public Double getValorDiaria() {
        return valorDiaria;
    }

    public void setValorDiaria(Double valorDiaria) {
        this.valorDiaria = valorDiaria;
    }

    public StatusQuarto getStatus() {
        return status;
    }

    public void setStatus(StatusQuarto status) {
        this.status = status;
    }
}
