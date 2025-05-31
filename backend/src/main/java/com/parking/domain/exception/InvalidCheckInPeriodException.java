package com.parking.domain.exception;
public class InvalidCheckInPeriodException extends RuntimeException {
    public InvalidCheckInPeriodException(String message) {
        super(message);
    }
}