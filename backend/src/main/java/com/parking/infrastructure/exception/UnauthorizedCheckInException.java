package com.parking.infrastructure.exception;

public class UnauthorizedCheckInException extends RuntimeException {
    public UnauthorizedCheckInException(String message) {
        super(message);
    }
}