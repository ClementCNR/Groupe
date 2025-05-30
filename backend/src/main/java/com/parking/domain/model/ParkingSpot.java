package com.parking.domain.model;

import lombok.Data;

@Data
public class ParkingSpot {
    private String id; 
    private String row; 
    private int number; 
    private boolean hasCharger;

    public ParkingSpot(String id, String row, int number, boolean hasCharger) {
        this.id = id;
        this.row = row;
        this.number = number;
        this.hasCharger = hasCharger;
    }
} 