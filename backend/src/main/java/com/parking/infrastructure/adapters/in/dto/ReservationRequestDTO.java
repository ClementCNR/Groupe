package com.parking.infrastructure.adapters.in.dto;

import java.time.LocalDate;
import lombok.Data;

@Data
public class ReservationRequestDTO {
    private String parkingSpotId;
    private LocalDate startDate;
    private LocalDate endDate;
    private boolean requiresElectricity;
}
