package com.hotelimperial.backend.dao;

import com.hotelimperial.backend.domain.Cidade;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CidadeRepository extends JpaRepository<Cidade, Integer> {
    Cidade findByNomeAndEstadoUf(String nome, String uf);
}
