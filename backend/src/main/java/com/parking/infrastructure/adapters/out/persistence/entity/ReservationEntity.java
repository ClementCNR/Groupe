package com.parking.infrastructure.adapters.out.persistence.entity;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;
import lombok.Data;

@Entity
@Table(name = "reservations")
@Data
public class ReservationEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String userId;
    private String parkingSpotId;
    private LocalDate startDate;
    private LocalDate endDate;
    private String status;
    private LocalDateTime checkInTime;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public ReservationEntity() {}

    public ReservationEntity(Long id, String userId, String parkingSpotId, LocalDate startDate, LocalDate endDate, String status, LocalDateTime checkInTime, LocalDateTime createdAt, LocalDateTime updatedAt) {
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