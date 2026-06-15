package com.hotelimperial.backend.dao;

import com.hotelimperial.backend.domain.PoliticaCancelamento;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PoliticaCancelamentoRepository extends JpaRepository<PoliticaCancelamento, Integer> {
}
