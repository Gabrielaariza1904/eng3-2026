package com.hotelimperial.backend.dao;

import com.hotelimperial.backend.domain.Hospede;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface HospedeRepository extends JpaRepository<Hospede, Integer> {
    Optional<Hospede> findByCpf(String cpf);
}
