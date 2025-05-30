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
import com.parking.domain.exception.InvalidReservationDatesException;
import com.parking.domain.exception.ReservationDurationExceededException;
import com.parking.domain.exception.ParkingSpotUnavailableException;
import com.parking.domain.exception.ParkingSpotNotFoundException;
import com.parking.domain.exception.InvalidParkingSpotTypeException;
import com.parking.domain.model.User;
import com.parking.application.ports.out.UserRepository;
import com.parking.domain.model.UserRole;

@Service
public class ReservationManagementService implements ReservationManagementUseCase {
    private final ReservationRepository reservationRepository;
    private final ParkingSpotRepository parkingSpotRepository;
    private final UserRepository userRepository;

    public ReservationManagementService(UserRepository userRepository, ReservationRepository reservationRepository, ParkingSpotRepository parkingSpotRepository) {
        this.reservationRepository = reservationRepository;
        this.parkingSpotRepository = parkingSpotRepository;
        this.userRepository = userRepository;

    }

    @Override
    public Reservation createReservation(String userId, String parkingSpotId, LocalDate startDate, LocalDate endDate, boolean requiresElectricity) {
        User user = userRepository.findByEmail(userId)
        .orElseThrow(() -> new RuntimeException("Utilisateur introuvable"));
        
        LocalDate today = LocalDate.now();
        if (startDate.isBefore(today)) {
            throw new InvalidReservationDatesException("La date de début doit être aujourd'hui ou plus tard.");
        }
        if (endDate.isBefore(startDate)) {
            throw new InvalidReservationDatesException("La date de fin doit être après la date de début.");
        }

        // 2. Vérifier la durée max (5 ou 30 jours ouvrés)
        long businessDays = countBusinessDays(startDate, endDate);
        long calendarDays = java.time.temporal.ChronoUnit.DAYS.between(startDate, endDate) + 1;

        if (user.getRole().equals(UserRole.MANAGER)) {
            if (calendarDays > 30) {
                throw new ReservationDurationExceededException("Les managers ne peuvent pas réserver plus de 30 jours.");
            }
        } else {
            if (businessDays > 5) {
                throw new ReservationDurationExceededException("Les employés ne peuvent pas réserver plus de 5 jours ouvrés.");
            }
        }

        List<Reservation> existing = reservationRepository.findAll().stream()
            .filter(r -> r.getParkingSpotId().equals(parkingSpotId) && r.getStatus() == ReservationStatus.RESERVED)
            .filter(r -> !(r.getEndDate().isBefore(startDate) || r.getStartDate().isAfter(endDate)))
            .toList();
        if (!existing.isEmpty()) {
            throw new ParkingSpotUnavailableException("La place est déjà réservée sur ce créneau.");
        }

        Optional<ParkingSpot> spotOpt = parkingSpotRepository.findById(parkingSpotId);
        if (spotOpt.isEmpty()) throw new ParkingSpotNotFoundException("Place de parking introuvable");
        ParkingSpot spot = spotOpt.get();
        if (requiresElectricity && !(spot.getRow().equals("A") || spot.getRow().equals("F"))) {
            throw new InvalidParkingSpotTypeException("Seules les places en rangée A ou F disposent d'une borne électrique.");
        }

        Reservation reservation = new Reservation();
        reservation.setUserId(userId);
        reservation.setParkingSpotId(parkingSpotId);
        reservation.setStartDate(startDate);
        reservation.setEndDate(endDate);
        reservation.setStatus(ReservationStatus.RESERVED);
        reservation.setCreatedAt(LocalDateTime.now());
        reservation.setUpdatedAt(LocalDateTime.now());
        return reservationRepository.save(reservation);
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
    public static long countBusinessDays(LocalDate start, LocalDate end) {
        long days = 0;
        for (LocalDate date = start; !date.isAfter(end); date = date.plusDays(1)) {
            if (!(date.getDayOfWeek().getValue() == 6 || date.getDayOfWeek().getValue() == 7)) {
                days++;
            }
        }
        return days;
    }
} 