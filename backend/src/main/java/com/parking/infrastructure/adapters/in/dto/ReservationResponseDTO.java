package com.parking.infrastructure.adapters.in.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;

import lombok.Data;

@Data
public class ReservationResponseDTO {
    private Long id;
    private String parkingSpotId;
    private LocalDate startDate;
    private LocalDate endDate;
    private String status;
    private LocalDateTime checkInTime;
}