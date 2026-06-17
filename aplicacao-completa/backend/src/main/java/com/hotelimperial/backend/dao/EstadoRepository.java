package com.hotelimperial.backend.dao;

import com.hotelimperial.backend.domain.Estado;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface EstadoRepository extends JpaRepository<Estado, Integer> {
    Estado findByUf(String uf);
}
