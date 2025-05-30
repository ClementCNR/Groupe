package com.parking.application.ports.out;

import com.parking.domain.model.ParkingSpot;
import java.util.List;
import java.util.Optional;

public interface ParkingSpotRepository {
    Optional<ParkingSpot> findById(String id);
    List<ParkingSpot> findAll();
    List<ParkingSpot> findByHasCharger(boolean hasCharger);
} 