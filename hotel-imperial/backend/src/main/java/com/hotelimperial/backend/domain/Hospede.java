package com.hotelimperial.backend.domain;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;

@Entity
@Table(name = "hospedes")
public class Hospede extends Pessoa {
    private boolean inativo;

    public Hospede() {}

    public boolean isInativo() {
        return inativo;
    }

    public void setInativo(boolean inativo) {
        this.inativo = inativo;
    }
}
