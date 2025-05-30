package com.parking.application.services;

import com.parking.application.ports.in.ReservationManagementUseCase;
import com.parking.application.ports.out.ParkingSpotRepository;
import com.parking.application.ports.out.ReservationRepository;
import com.parking.domain.model.ParkingSpot;
import com.parking.domain.model.Reservation;
import com.parking.domain.model.ReservationStatus;
import com.parking.domain.exception.InvalidCheckInPeriodException;
import com.parking.domain.exception.UnauthorizedCheckInException;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.scheduling.annotation.Scheduled;
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
        User user = findAndValidateUser(userId);
        validateReservationDates(startDate, endDate);
        validateReservationDuration(user, startDate, endDate);
        validateParkingSpotAvailability(parkingSpotId, startDate, endDate);
        validateParkingSpotType(parkingSpotId, requiresElectricity);
        
        return createAndSaveReservation(userId, parkingSpotId, startDate, endDate);
    }



    @Override
    public void cancelReservation(Long reservationId, String userId) {
        Reservation reservation = reservationRepository.findById(reservationId)
                .orElseThrow(() -> new EntityNotFoundException("Réservation non trouvée pour l'id : " + reservationId));

        if (!reservation.getUserId().equals(userId)) {
            throw new SecurityException("Vous n'avez pas la permission d'annuler cette réservation.");
        }

        if (reservation.getStatus() != ReservationStatus.RESERVED) {
            throw new IllegalStateException("Seules les réservations au statut 'RESERVED' peuvent être annulées.");
        }

        reservation.setStatus(ReservationStatus.CANCELLED);
        reservation.setUpdatedAt(LocalDateTime.now());

        reservationRepository.save(reservation);
    }

    @Override
    public Reservation getReservationById(Long id) {
        return reservationRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Réservation non trouvée pour l'id : " + id));
    }

    @Override
    public Reservation updateReservationBySecretary(Long id, Reservation updated) {
        Reservation reservation = reservationRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException(
                        "Impossible de mettre à jour : réservation non trouvée (id = " + id + ")"));
        LocalDate today = LocalDate.now();

        if (updated.getStartDate().isBefore(today)) {
            throw new InvalidReservationDatesException("La date de début doit être aujourd'hui ou plus tard.");
        }
        if (updated.getEndDate().isBefore(updated.getStartDate())) {
            throw new InvalidReservationDatesException("La date de fin doit être après la date de début.");
        }

        reservation.setParkingSpotId(updated.getParkingSpotId());
        reservation.setStartDate(updated.getStartDate());
        reservation.setEndDate(updated.getEndDate());
        reservation.setStatus(updated.getStatus());
        reservation.setCheckInTime(updated.getCheckInTime());

        return reservationRepository.save(reservation);
    }

    @Override
    public void checkIn(Long reservationId, String userId) {
        Reservation reservation = reservationRepository.findById(reservationId)
                .orElseThrow(() -> new EntityNotFoundException("Réservation non trouvée pour l'id : " + reservationId));
        LocalDate today = LocalDate.now();
        if (reservation.getStartDate().isBefore(today)) {
            throw new InvalidReservationDatesException("La date de début doit être aujourd'hui ou plus tard.");
        }
        if (reservation.getEndDate().isBefore(reservation.getStartDate())) {
            throw new InvalidReservationDatesException("La date de fin doit être après la date de début.");
        }
        if (!reservation.getUserId().equals(userId)) {
            throw new SecurityException("Vous n'êtes pas autorisé à faire le check-in de cette réservation.");
        }

        if (!reservation.getUserId().equals(userId)) {
            throw new UnauthorizedCheckInException("Vous n'êtes pas autorisé à faire le check-in de cette réservation.");
        }

        if (today.isBefore(reservation.getStartDate()) || today.isAfter(reservation.getEndDate())) {
            throw new InvalidCheckInPeriodException("Le check-in est autorisé uniquement pendant la période de réservation.");
        }

        reservation.setStatus(ReservationStatus.CHECKED_IN);
        reservation.setCheckInTime(LocalDateTime.now());
        reservation.setUpdatedAt(LocalDateTime.now());

        reservationRepository.save(reservation);
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
    @Scheduled(cron = "0 0 11 * * *")
    public void autoExpireUnconfirmedReservations() {
        LocalDate today = LocalDate.now();

        List<Reservation> reservationsToExpire = reservationRepository.findAll().stream()
                .filter(r -> r.getStatus() == ReservationStatus.RESERVED)
                .filter(r -> today.equals(r.getStartDate()))
                .filter(r -> r.getCheckInTime() == null)
                .toList();

        for (Reservation reservation : reservationsToExpire) {
            reservation.setStatus(ReservationStatus.EXPIRED);
            reservation.setUpdatedAt(LocalDateTime.now());
            reservationRepository.save(reservation);
        }

    }
    private User findAndValidateUser(String userId) {
        return userRepository.findByEmail(userId)
            .orElseThrow(() -> new RuntimeException("Utilisateur introuvable"));
    }

    private void validateReservationDates(LocalDate startDate, LocalDate endDate) {
        LocalDate today = LocalDate.now();
        if (startDate.isBefore(today)) {
            throw new InvalidReservationDatesException("La date de début doit être aujourd'hui ou plus tard.");
        }
        if (endDate.isBefore(startDate)) {
            throw new InvalidReservationDatesException("La date de fin doit être après la date de début.");
        }
    }

    private void validateReservationDuration(User user, LocalDate startDate, LocalDate endDate) {
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
    }

    private void validateParkingSpotAvailability(String parkingSpotId, LocalDate startDate, LocalDate endDate) {
        List<Reservation> existing = reservationRepository.findAll().stream()
            .filter(r -> r.getParkingSpotId().equals(parkingSpotId) && r.getStatus() == ReservationStatus.RESERVED)
            .filter(r -> !(r.getEndDate().isBefore(startDate) || r.getStartDate().isAfter(endDate)))
            .toList();
        if (!existing.isEmpty()) {
            throw new ParkingSpotUnavailableException("La place est déjà réservée sur ce créneau.");
        }
    }

    private void validateParkingSpotType(String parkingSpotId, boolean requiresElectricity) {
        ParkingSpot spot = parkingSpotRepository.findById(parkingSpotId)
            .orElseThrow(() -> new ParkingSpotNotFoundException("Place de parking introuvable"));
            
        if (requiresElectricity && !(spot.getRow().equals("A") || spot.getRow().equals("F"))) {
            throw new InvalidParkingSpotTypeException("Seules les places en rangée A ou F disposent d'une borne électrique.");
        }
    }

    private Reservation createAndSaveReservation(String userId, String parkingSpotId, LocalDate startDate, LocalDate endDate) {
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
} 