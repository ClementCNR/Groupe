package com.parking.infrastructure.adapters.in.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;

import com.parking.domain.model.ReservationStatus;
import lombok.Data;

@Data
public class ReservationRequestDTO {
    private String parkingSpotId;
    private LocalDate startDate;
    private LocalDate endDate;
    private boolean requiresElectricity;
    private ReservationStatus status;
    private LocalDateTime checkInTime;

}
