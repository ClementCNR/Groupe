package com.parking.infrastructure.adapters.in.mapper;

import com.parking.domain.model.Reservation;
import com.parking.infrastructure.adapters.in.dto.ReservationResponseDTO;
import org.springframework.stereotype.Component;

@Component
public class ReservationMapper {

    public static ReservationResponseDTO toDTO(Reservation reservation) {
        ReservationResponseDTO dto = new ReservationResponseDTO();
        dto.setId(reservation.getId());
        dto.setParkingSpotId(reservation.getParkingSpotId());
        dto.setStartDate(reservation.getStartDate());
        dto.setEndDate(reservation.getEndDate());
        dto.setStatus(reservation.getStatus().name());
        dto.setCheckInTime(reservation.getCheckInTime());
        return dto;
    }
}