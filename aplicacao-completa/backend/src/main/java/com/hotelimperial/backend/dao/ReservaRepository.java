package com.hotelimperial.backend.dao;

import com.hotelimperial.backend.domain.Reserva;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ReservaRepository extends JpaRepository<Reserva, Integer> {
    List<Reserva> findByQuartoId(Integer quartoId);
}
