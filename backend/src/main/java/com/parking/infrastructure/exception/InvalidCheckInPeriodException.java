package com.parking.infrastructure.exception;
public class InvalidCheckInPeriodException extends RuntimeException {
    public InvalidCheckInPeriodException(String message) {
        super(message);
    }
}