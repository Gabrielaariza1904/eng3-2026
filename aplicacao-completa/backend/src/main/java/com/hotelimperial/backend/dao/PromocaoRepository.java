package com.hotelimperial.backend.dao;

import com.hotelimperial.backend.domain.Promocao;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface PromocaoRepository extends JpaRepository<Promocao, Integer> {
    Optional<Promocao> findByCodigo(String codigo);
}
