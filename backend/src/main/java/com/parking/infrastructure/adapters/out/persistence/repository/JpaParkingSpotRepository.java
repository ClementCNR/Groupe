package com.parking.infrastructure.adapters.out.persistence.repository;

import com.parking.infrastructure.adapters.out.persistence.entity.ParkingSpotEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface JpaParkingSpotRepository extends JpaRepository<ParkingSpotEntity, String> {
    List<ParkingSpotEntity> findByHasCharger(boolean hasCharger);
} 