package com.parking.application.ports.in;

import com.parking.domain.model.Reservation;
import java.time.LocalDate;
import java.util.List;

public interface ReservationManagementUseCase {
    Reservation createReservation(String userId, String parkingSpotId, LocalDate startDate, LocalDate endDate, boolean requiresElectricity);
    void cancelReservation(Long reservationId, String userId);
    void checkIn(Long reservationId, String userId);
    List<Reservation> getUserReservations(String userId);
    List<Reservation> getAllReservations();
} 