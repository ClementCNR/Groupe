package com.parking.domain.exception;

public class ReservationDurationExceededException extends RuntimeException {
    public ReservationDurationExceededException(String message) {
        super(message);
    }
} 