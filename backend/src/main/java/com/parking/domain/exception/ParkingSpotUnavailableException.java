package com.parking.domain.exception;

public class ParkingSpotUnavailableException extends RuntimeException {
    public ParkingSpotUnavailableException(String message) {
        super(message);
    }
} 