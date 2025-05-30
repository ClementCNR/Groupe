package com.parking.application.services;

import com.parking.application.ports.in.ReservationManagementUseCase;
import com.parking.application.ports.out.ParkingSpotRepository;
import com.parking.application.ports.out.ReservationRepository;
import com.parking.domain.model.ParkingSpot;
import com.parking.domain.model.Reservation;
import com.parking.domain.model.ReservationStatus;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class ReservationManagementService implements ReservationManagementUseCase {
    private final ReservationRepository reservationRepository;
    private final ParkingSpotRepository parkingSpotRepository;

    public ReservationManagementService(ReservationRepository reservationRepository, ParkingSpotRepository parkingSpotRepository) {
        this.reservationRepository = reservationRepository;
        this.parkingSpotRepository = parkingSpotRepository;
    }

    @Override
    public Reservation createReservation(String userId, String parkingSpotId, LocalDate startDate, LocalDate endDate) {
        return null;
    }

    @Override
    public void cancelReservation(Long reservationId, String userId) {
     
    }

    @Override
    public void checkIn(Long reservationId, String userId) {

    }

    @Override
    public List<Reservation> getUserReservations(String userId) {
        return reservationRepository.findByUserId(userId);
    }

    @Override
    public List<Reservation> getAllReservations() {
        return reservationRepository.findAll();
    }
} 