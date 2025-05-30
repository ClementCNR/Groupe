package com.parking.infrastructure.adapters.out.persistence.repository;

import com.parking.infrastructure.adapters.out.persistence.entity.ReservationEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface JpaReservationRepository extends JpaRepository<ReservationEntity, Long> {
    List<ReservationEntity> findByUserId(String userId);
} 