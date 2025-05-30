package com.parking.infrastructure.adapters.out.persistence.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "parking_spots")
@Data
public class ParkingSpotEntity {
    @Id
    private String id;
    private String row;
    private int number;
    private boolean hasCharger;

    public ParkingSpotEntity() {}

    public ParkingSpotEntity(String id, String row, int number, boolean hasCharger) {
        this.id = id;
        this.row = row;
        this.number = number;
        this.hasCharger = hasCharger;
    }
} 