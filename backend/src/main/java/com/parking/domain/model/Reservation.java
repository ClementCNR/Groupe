package com.parking.domain.model;

import java.time.LocalDate;
import java.time.LocalDateTime;
import lombok.Data;

@Data
public class Reservation {
    private Long id;
    private String userId;
    private String parkingSpotId;
    private LocalDate startDate;
    private LocalDate endDate;
    private ReservationStatus status;
    private LocalDateTime checkInTime;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public Reservation() {}

    public Reservation(Long id, String userId, String parkingSpotId, LocalDate startDate, LocalDate endDate, ReservationStatus status, LocalDateTime checkInTime, LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id;
        this.userId = userId;
        this.parkingSpotId = parkingSpotId;
        this.startDate = startDate;
        this.endDate = endDate;
        this.status = status;
        this.checkInTime = checkInTime;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
} 