package com.parking.infrastructure.adapters.out.persistence.mapper;

import com.parking.domain.model.Reservation;
import com.parking.domain.model.ReservationStatus;
import com.parking.infrastructure.adapters.out.persistence.entity.ReservationEntity;

public class ReservationEntityMapper {
    public ReservationEntity toEntity(Reservation reservation) {
        ReservationEntity entity = new ReservationEntity();
        entity.setId(reservation.getId());
        entity.setUserId(reservation.getUserId());
        entity.setParkingSpotId(reservation.getParkingSpotId());
        entity.setStartDate(reservation.getStartDate());
        entity.setEndDate(reservation.getEndDate());
        entity.setStatus(reservation.getStatus() != null ? reservation.getStatus().name() : null);
        entity.setCheckInTime(reservation.getCheckInTime());
        entity.setCreatedAt(reservation.getCreatedAt());
        entity.setUpdatedAt(reservation.getUpdatedAt());
        return entity;
    }

    public Reservation toDomain(ReservationEntity entity) {
        Reservation reservation = new Reservation();
        reservation.setId(entity.getId());
        reservation.setUserId(entity.getUserId());
        reservation.setParkingSpotId(entity.getParkingSpotId());
        reservation.setStartDate(entity.getStartDate());
        reservation.setEndDate(entity.getEndDate());
        reservation.setStatus(entity.getStatus() != null ? ReservationStatus.valueOf(entity.getStatus()) : null);
        reservation.setCheckInTime(entity.getCheckInTime());
        reservation.setCreatedAt(entity.getCreatedAt());
        reservation.setUpdatedAt(entity.getUpdatedAt());
        return reservation;
    }
} 