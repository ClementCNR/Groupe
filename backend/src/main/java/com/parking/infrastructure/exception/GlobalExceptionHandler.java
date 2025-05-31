package com.parking.infrastructure.exception;

import com.parking.domain.exception.*;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import java.time.Instant;
import java.util.Map;

@ControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(UserNotFoundException.class)
    public ResponseEntity<?> handleUserNotFoundException(UserNotFoundException ex) {
        return buildResponse(HttpStatus.NOT_FOUND, "USER_NOT_FOUND", ex.getMessage());
    }

    @ExceptionHandler(InvalidUserDataException.class)
    public ResponseEntity<?> handleInvalidUserDataException(InvalidUserDataException ex) {
        return buildResponse(HttpStatus.BAD_REQUEST, "INVALID_USER_DATA", ex.getMessage());
    }

    @ExceptionHandler(UnauthorizedCheckInException.class)
    public ResponseEntity<?> handleUnauthorizedCheckIn(UnauthorizedCheckInException ex) {
        return buildResponse(HttpStatus.FORBIDDEN, "UNAUTHORIZED_CHECKIN", ex.getMessage());
    }

    @ExceptionHandler(InvalidCheckInPeriodException.class)
    public ResponseEntity<?> handleInvalidCheckInPeriod(InvalidCheckInPeriodException ex) {
        return buildResponse(HttpStatus.BAD_REQUEST, "INVALID_CHECKIN_PERIOD", ex.getMessage());
    }

    @ExceptionHandler(InvalidReservationDatesException.class)
    public ResponseEntity<?> handleInvalidReservationDatesException(InvalidReservationDatesException ex) {
        return buildResponse(HttpStatus.BAD_REQUEST, "INVALID_RESERVATION_DATES", ex.getMessage());
    }

    @ExceptionHandler(ReservationDurationExceededException.class)
    public ResponseEntity<?> handleDuration(ReservationDurationExceededException ex) {
        return buildResponse(HttpStatus.BAD_REQUEST, "DURATION_EXCEEDED", ex.getMessage());
    }

    @ExceptionHandler(ParkingSpotUnavailableException.class)
    public ResponseEntity<?> handleSpotUnavailable(ParkingSpotUnavailableException ex) {
        return buildResponse(HttpStatus.CONFLICT, "SPOT_UNAVAILABLE", ex.getMessage());
    }

    @ExceptionHandler(ParkingSpotNotFoundException.class)
    public ResponseEntity<?> handleSpotNotFound(ParkingSpotNotFoundException ex) {
        return buildResponse(HttpStatus.NOT_FOUND, "SPOT_NOT_FOUND", ex.getMessage());
    }

    @ExceptionHandler(InvalidParkingSpotTypeException.class)
    public ResponseEntity<?> handleInvalidType(InvalidParkingSpotTypeException ex) {
        return buildResponse(HttpStatus.BAD_REQUEST, "INVALID_SPOT_TYPE", ex.getMessage());
    }

    @ExceptionHandler(EntityNotFoundException.class)
    public ResponseEntity<?> handleNotFound(EntityNotFoundException ex) {
        return buildResponse(HttpStatus.NOT_FOUND, "NOT_FOUND", ex.getMessage());
    }

    @ExceptionHandler(SecurityException.class)
    public ResponseEntity<?> handleSecurity(SecurityException ex) {
        return buildResponse(HttpStatus.FORBIDDEN, "FORBIDDEN", ex.getMessage());
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<?> handleGeneric(Exception ex) {
        return buildResponse(HttpStatus.INTERNAL_SERVER_ERROR, "INTERNAL_ERROR", "Une erreur inattendue s'est produite");
    }

    private ResponseEntity<?> buildResponse(HttpStatus status, String code, String message) {
        return ResponseEntity.status(status).body(Map.of(
                "code", code,
                "error", status.getReasonPhrase(),
                "message", message,
                "status", status.value(),
                "timestamp", Instant.now().toString()
        ));
    }

}