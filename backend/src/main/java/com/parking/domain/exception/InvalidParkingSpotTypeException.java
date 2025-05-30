package com.parking.domain.exception;

public class InvalidParkingSpotTypeException extends RuntimeException {
    public InvalidParkingSpotTypeException(String message) {
        super(message);
    }
} 