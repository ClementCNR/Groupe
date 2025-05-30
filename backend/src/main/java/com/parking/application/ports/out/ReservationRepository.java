package com.parking.application.ports.out;

import com.parking.domain.model.Reservation;
import java.util.List;
import java.util.Optional;

public interface ReservationRepository {
    Reservation save(Reservation reservation);
    Optional<Reservation> findById(Long id);
    List<Reservation> findByUserId(String userId);
    List<Reservation> findAll();
    void deleteById(Long id);
} 