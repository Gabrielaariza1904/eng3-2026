package com.hotelimperial.backend.domain;

import java.time.LocalDate;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "reservas")
public class Reserva extends EntidadeDominio {
    private LocalDate dataEntrada;
    private LocalDate dataSaida;
    private boolean checkinRealizado;
    private boolean noShow;
    private Integer qtdAdultos;
    private Integer qtdCriancas;
    private Double valorTotal;

    @Enumerated(EnumType.STRING)
    private StatusReserva status;

    @ManyToOne
    @JoinColumn(name = "hospede_id")
    private Hospede hospede;

    @ManyToOne
    @JoinColumn(name = "quarto_id")
    private Quarto quarto;

    @ManyToOne
    @JoinColumn(name = "promocao_id", nullable = true)
    private Promocao promocao;

    @ManyToOne
    @JoinColumn(name = "politica_id")
    private PoliticaCancelamento politicaCancelamento;

    public Reserva() {}

    public LocalDate getDataEntrada() {
        return dataEntrada;
    }

    public void setDataEntrada(LocalDate dataEntrada) {
        this.dataEntrada = dataEntrada;
    }

    public LocalDate getDataSaida() {
        return dataSaida;
    }

    public void setDataSaida(LocalDate dataSaida) {
        this.dataSaida = dataSaida;
    }

    public boolean isCheckinRealizado() {
        return checkinRealizado;
    }

    public void setCheckinRealizado(boolean checkinRealizado) {
        this.checkinRealizado = checkinRealizado;
    }

    public boolean isNoShow() {
        return noShow;
    }

    public void setNoShow(boolean noShow) {
        this.noShow = noShow;
    }

    public Integer getQtdAdultos() {
        return qtdAdultos;
    }

    public void setQtdAdultos(Integer qtdAdultos) {
        this.qtdAdultos = qtdAdultos;
    }

    public Integer getQtdCriancas() {
        return qtdCriancas;
    }

    public void setQtdCriancas(Integer qtdCriancas) {
        this.qtdCriancas = qtdCriancas;
    }

    public Double getValorTotal() {
        return valorTotal;
    }

    public void setValorTotal(Double valorTotal) {
        this.valorTotal = valorTotal;
    }

    public StatusReserva getStatus() {
        return status;
    }

    public void setStatus(StatusReserva status) {
        this.status = status;
    }

    public Hospede getHospede() {
        return hospede;
    }

    public void setHospede(Hospede hospede) {
        this.hospede = hospede;
    }

    public Quarto getQuarto() {
        return quarto;
    }

    public void setQuarto(Quarto quarto) {
        this.quarto = quarto;
    }

    public Promocao getPromocao() {
        return promocao;
    }

    public void setPromocao(Promocao promocao) {
        this.promocao = promocao;
    }

    public PoliticaCancelamento getPoliticaCancelamento() {
        return politicaCancelamento;
    }

    public void setPoliticaCancelamento(PoliticaCancelamento politicaCancelamento) {
        this.politicaCancelamento = politicaCancelamento;
    }
}
