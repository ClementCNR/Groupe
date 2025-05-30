package com.parking.infrastructure.adapters.out.persistence.mapper;

import com.parking.domain.model.ParkingSpot;
import com.parking.infrastructure.adapters.out.persistence.entity.ParkingSpotEntity;

public class ParkingSpotEntityMapper {
    public ParkingSpotEntity toEntity(ParkingSpot spot) {
        ParkingSpotEntity entity = new ParkingSpotEntity();
        entity.setId(spot.getId());
        entity.setRow(spot.getRow());
        entity.setNumber(spot.getNumber());
        entity.setHasCharger(spot.isHasCharger());
        return entity;
    }

    public ParkingSpot toDomain(ParkingSpotEntity entity) {
        return new ParkingSpot(
            entity.getId(),
            entity.getRow(),
            entity.getNumber(),
            entity.isHasCharger()
        );
    }
} 