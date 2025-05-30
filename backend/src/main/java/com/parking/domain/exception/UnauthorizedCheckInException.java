package com.parking.domain.exception;

public class UnauthorizedCheckInException extends RuntimeException {
    public UnauthorizedCheckInException(String message) {
        super(message);
    }
}