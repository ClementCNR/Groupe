package com.parking.infrastructure.exception;

import com.parking.domain.exception.UserNotFoundException;
import com.parking.domain.exception.InvalidUserDataException;
import com.parking.domain.exception.InvalidReservationDatesException;
import com.parking.domain.exception.ReservationDurationExceededException;
import com.parking.domain.exception.ParkingSpotUnavailableException;
import com.parking.domain.exception.ParkingSpotNotFoundException;
import com.parking.domain.exception.InvalidParkingSpotTypeException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@ControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(UserNotFoundException.class)
    public ResponseEntity<Map<String, Object>> handleUserNotFoundException(UserNotFoundException ex) {
        Map<String, Object> body = new HashMap<>();
        body.put("timestamp", LocalDateTime.now());
        body.put("status", HttpStatus.NOT_FOUND.value());
        body.put("error", "Not Found");
        body.put("message", ex.getMessage());
        body.put("code", "USER_NOT_FOUND");
        
        return new ResponseEntity<>(body, HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(InvalidUserDataException.class)
    public ResponseEntity<Map<String, Object>> handleInvalidUserDataException(InvalidUserDataException ex) {
        Map<String, Object> body = new HashMap<>();
        body.put("timestamp", LocalDateTime.now());
        body.put("status", HttpStatus.BAD_REQUEST.value());
        body.put("error", "Bad Request");
        body.put("message", ex.getMessage());
        body.put("code", "INVALID_USER_DATA");
        
        return new ResponseEntity<>(body, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(InvalidReservationDatesException.class)
    public ResponseEntity<Map<String, Object>> handleInvalidReservationDatesException(InvalidReservationDatesException ex) {
        Map<String, Object> body = new HashMap<>();
        body.put("timestamp", LocalDateTime.now());
        body.put("status", HttpStatus.BAD_REQUEST.value());
        body.put("error", "Invalid Reservation Dates");
        body.put("message", ex.getMessage());
        body.put("code", "INVALID_RESERVATION_DATES");
        return new ResponseEntity<>(body, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(ReservationDurationExceededException.class)
    public ResponseEntity<Map<String, Object>> handleReservationDurationExceededException(ReservationDurationExceededException ex) {
        Map<String, Object> body = new HashMap<>();
        body.put("timestamp", LocalDateTime.now());
        body.put("status", HttpStatus.BAD_REQUEST.value());
        body.put("error", "Reservation Duration Exceeded");
        body.put("message", ex.getMessage());
        body.put("code", "RESERVATION_DURATION_EXCEEDED");
        return new ResponseEntity<>(body, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(ParkingSpotUnavailableException.class)
    public ResponseEntity<Map<String, Object>> handleParkingSpotUnavailableException(ParkingSpotUnavailableException ex) {
        Map<String, Object> body = new HashMap<>();
        body.put("timestamp", LocalDateTime.now());
        body.put("status", HttpStatus.CONFLICT.value());
        body.put("error", "Parking Spot Unavailable");
        body.put("message", ex.getMessage());
        body.put("code", "PARKING_SPOT_UNAVAILABLE");
        return new ResponseEntity<>(body, HttpStatus.CONFLICT);
    }

    @ExceptionHandler(ParkingSpotNotFoundException.class)
    public ResponseEntity<Map<String, Object>> handleParkingSpotNotFoundException(ParkingSpotNotFoundException ex) {
        Map<String, Object> body = new HashMap<>();
        body.put("timestamp", LocalDateTime.now());
        body.put("status", HttpStatus.NOT_FOUND.value());
        body.put("error", "Parking Spot Not Found");
        body.put("message", ex.getMessage());
        body.put("code", "PARKING_SPOT_NOT_FOUND");
        return new ResponseEntity<>(body, HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(InvalidParkingSpotTypeException.class)
    public ResponseEntity<Map<String, Object>> handleInvalidParkingSpotTypeException(InvalidParkingSpotTypeException ex) {
        Map<String, Object> body = new HashMap<>();
        body.put("timestamp", LocalDateTime.now());
        body.put("status", HttpStatus.BAD_REQUEST.value());
        body.put("error", "Invalid Parking Spot Type");
        body.put("message", ex.getMessage());
        body.put("code", "INVALID_PARKING_SPOT_TYPE");
        return new ResponseEntity<>(body, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, Object>> handleGlobalException(Exception ex) {
        Map<String, Object> body = new HashMap<>();
        body.put("timestamp", LocalDateTime.now());
        body.put("status", HttpStatus.INTERNAL_SERVER_ERROR.value());
        body.put("error", "Internal Server Error");
        body.put("message", "Une erreur inattendue s'est produite");
        body.put("code", "INTERNAL_ERROR");
        
        return new ResponseEntity<>(body, HttpStatus.INTERNAL_SERVER_ERROR);
    }
} 