package com.parking.application.services;

import com.parking.application.ports.out.ParkingSpotRepository;
import com.parking.application.ports.out.ReservationRepository;
import com.parking.application.ports.out.UserRepository;
import com.parking.domain.model.*;
import com.parking.domain.exception.InvalidReservationDatesException;

import jakarta.persistence.EntityNotFoundException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class ReservationManagementServiceTest {

    @Mock
    private UserRepository userRepository;
    @Mock
    private ReservationRepository reservationRepository;
    @Mock
    private ParkingSpotRepository parkingSpotRepository;

    @InjectMocks
    private ReservationManagementService reservationService;

    @BeforeEach
    void setup() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void createReservation_shouldCreateSuccessfully_forEmployee() {
        String userId = "user@example.com";
        String parkingSpotId = "spot1";
        LocalDate startDate = LocalDate.now().plusDays(1);
        LocalDate endDate = startDate.plusDays(2);
        boolean requiresElectricity = false;

        User user = new User();
        user.setEmail(userId);
        user.setRole(UserRole.EMPLOYEE);

        ParkingSpot spot = new ParkingSpot("1", "1", 1, true);
        spot.setId(parkingSpotId);
        spot.setRow("B");

        when(userRepository.findByEmail(userId)).thenReturn(Optional.of(user));
        when(parkingSpotRepository.findById(parkingSpotId)).thenReturn(Optional.of(spot));
        when(reservationRepository.findAll()).thenReturn(Collections.emptyList());
        when(reservationRepository.save(any())).thenAnswer(invocation -> invocation.getArgument(0));

        Reservation reservation = reservationService.createReservation(userId, parkingSpotId, startDate, endDate, requiresElectricity);

        assertEquals(userId, reservation.getUserId());
        assertEquals(parkingSpotId, reservation.getParkingSpotId());
        assertEquals(startDate, reservation.getStartDate());
        assertEquals(endDate, reservation.getEndDate());
        assertEquals(ReservationStatus.RESERVED, reservation.getStatus());

        verify(reservationRepository, times(1)).save(any());
    }

    @Test
    void createReservation_shouldFail_whenEndDateBeforeStartDate() {
        String userId = "user@example.com";
        String parkingSpotId = "spot1";
        LocalDate startDate = LocalDate.now().plusDays(5);
        LocalDate endDate = startDate.minusDays(2);
        boolean requiresElectricity = false;

        User user = new User();
        user.setEmail(userId);
        user.setRole(UserRole.EMPLOYEE);

        ParkingSpot spot = new ParkingSpot("1", "1", 1, true);
        spot.setId(parkingSpotId);
        spot.setRow("B");

        when(userRepository.findByEmail(userId)).thenReturn(Optional.of(user));
        when(parkingSpotRepository.findById(parkingSpotId)).thenReturn(Optional.of(spot));

        assertThrows(InvalidReservationDatesException.class, () ->
                reservationService.createReservation(userId, parkingSpotId, startDate, endDate, requiresElectricity)
        );
    }

    @Test
    void autoExpireUnconfirmedReservations_shouldExpireReservationsCorrectly() {
        LocalDate today = LocalDate.now();

        Reservation toExpire = new Reservation();
        toExpire.setId(1L);
        toExpire.setStartDate(today);
        toExpire.setEndDate(today.plusDays(1));
        toExpire.setStatus(ReservationStatus.RESERVED);
        toExpire.setCheckInTime(null);
        toExpire.setUserId("user@example.com");
        toExpire.setParkingSpotId("spot1");

        Reservation alreadyCheckedIn = new Reservation();
        alreadyCheckedIn.setId(2L);
        alreadyCheckedIn.setStartDate(today);
        alreadyCheckedIn.setEndDate(today.plusDays(1));
        alreadyCheckedIn.setStatus(ReservationStatus.RESERVED);
        alreadyCheckedIn.setCheckInTime(LocalDateTime.now());

        when(reservationRepository.findAll()).thenReturn(List.of(toExpire, alreadyCheckedIn));

        reservationService.autoExpireUnconfirmedReservations();

        verify(reservationRepository, times(1)).save(argThat(reservation ->
                reservation.getId().equals(1L) &&
                        reservation.getStatus() == ReservationStatus.EXPIRED &&
                        reservation.getUpdatedAt() != null
        ));

        verify(reservationRepository, never()).save(argThat(reservation -> reservation.getId().equals(2L)));
    }

    @Test
    void cancelReservation() {
        Reservation reservation = new Reservation();
        reservation.setId(1L);
        reservation.setUserId("user@example.com");
        reservation.setStatus(ReservationStatus.RESERVED);

        when(reservationRepository.findById(1L)).thenReturn(Optional.of(reservation));

        reservationService.cancelReservation(1L, "user@example.com");

        assertEquals(ReservationStatus.CANCELLED, reservation.getStatus());
        verify(reservationRepository, times(1)).save(reservation);
    }

    @Test
    void checkIn() {
        Reservation reservation = new Reservation();
        reservation.setId(1L);
        reservation.setUserId("user@example.com");
        reservation.setStatus(ReservationStatus.RESERVED);
        reservation.setStartDate(LocalDate.now());
        reservation.setEndDate(LocalDate.now().plusDays(1));

        when(reservationRepository.findById(1L)).thenReturn(Optional.of(reservation));

        reservationService.checkIn(1L, "user@example.com");

        assertEquals(ReservationStatus.CHECKED_IN, reservation.getStatus());
        assertNotNull(reservation.getCheckInTime());
        verify(reservationRepository, times(1)).save(reservation);
    }

    @Test
    void getUserReservations() {
        List<Reservation> reservations = List.of(new Reservation(), new Reservation());
        when(reservationRepository.findByUserId("user@example.com")).thenReturn(reservations);

        List<Reservation> result = reservationService.getUserReservations("user@example.com");

        assertEquals(2, result.size());
    }

    @Test
    void getAllReservations() {
        List<Reservation> reservations = List.of(new Reservation(), new Reservation(), new Reservation());
        when(reservationRepository.findAll()).thenReturn(reservations);

        List<Reservation> result = reservationService.getAllReservations();

        assertEquals(3, result.size());
    }

    @Test
    void countBusinessDays() {
        LocalDate start = LocalDate.of(2025, 6, 2);
        LocalDate end = LocalDate.of(2025, 6, 6);

        long result = ReservationManagementService.countBusinessDays(start, end);

        assertEquals(5, result);
    }

    @Test
    void checkIn_shouldThrowException_whenUserIsNotOwner() {
        Reservation reservation = new Reservation();
        reservation.setId(1L);
        reservation.setUserId("another@example.com");
        reservation.setStatus(ReservationStatus.RESERVED);
        reservation.setStartDate(LocalDate.now());
        reservation.setEndDate(LocalDate.now().plusDays(1));

        when(reservationRepository.findById(1L)).thenReturn(Optional.of(reservation));

        assertThrows(SecurityException.class, () ->
                reservationService.checkIn(1L, "user@example.com")
        );
    }

    @Test
    void cancelReservation_shouldThrowException_whenUserNotOwner() {
        Reservation reservation = new Reservation();
        reservation.setId(1L);
        reservation.setUserId("another@example.com");
        reservation.setStatus(ReservationStatus.RESERVED);

        when(reservationRepository.findById(1L)).thenReturn(Optional.of(reservation));

        assertThrows(SecurityException.class, () ->
                reservationService.cancelReservation(1L, "user@example.com")
        );
    }

    @Test
    void getReservationById_shouldThrowException_whenNotFound() {
        when(reservationRepository.findById(99L)).thenReturn(Optional.empty());

        assertThrows(EntityNotFoundException.class, () ->
                reservationService.getReservationById(99L)
        );
    }

    @Test
    void updateReservationBySecretary_shouldUpdateSuccessfully() {
        Reservation existing = new Reservation();
        existing.setId(1L);
        existing.setStartDate(LocalDate.now().plusDays(1));
        existing.setEndDate(LocalDate.now().plusDays(3));

        Reservation updated = new Reservation();
        updated.setParkingSpotId("newSpot");
        updated.setStartDate(LocalDate.now().plusDays(2));
        updated.setEndDate(LocalDate.now().plusDays(4));
        updated.setStatus(ReservationStatus.RESERVED);
        updated.setCheckInTime(LocalDateTime.now());

        when(reservationRepository.findById(1L)).thenReturn(Optional.of(existing));
        when(reservationRepository.save(any())).thenAnswer(i -> i.getArgument(0));

        Reservation result = reservationService.updateReservationBySecretary(1L, updated);

        assertEquals("newSpot", result.getParkingSpotId());
        assertEquals(updated.getStartDate(), result.getStartDate());
        assertEquals(updated.getEndDate(), result.getEndDate());
        assertEquals(updated.getStatus(), result.getStatus());
    }

    @Test
    void updateReservationBySecretary_shouldThrow_whenEndBeforeStart() {
        Reservation existing = new Reservation();
        existing.setId(1L);
        existing.setStartDate(LocalDate.now().plusDays(1));
        existing.setEndDate(LocalDate.now().plusDays(3));

        Reservation updated = new Reservation();
        updated.setStartDate(LocalDate.now().plusDays(4));
        updated.setEndDate(LocalDate.now().plusDays(2));

        when(reservationRepository.findById(1L)).thenReturn(Optional.of(existing));

        assertThrows(InvalidReservationDatesException.class, () ->
                reservationService.updateReservationBySecretary(1L, updated)
        );
    }

    @Test
    void updateReservationBySecretary_shouldThrow_whenStartBeforeToday() {
        Reservation existing = new Reservation();
        existing.setId(1L);
        existing.setStartDate(LocalDate.now().plusDays(1));
        existing.setEndDate(LocalDate.now().plusDays(3));

        Reservation updated = new Reservation();
        updated.setStartDate(LocalDate.now().minusDays(1));
        updated.setEndDate(LocalDate.now().plusDays(2));

        when(reservationRepository.findById(1L)).thenReturn(Optional.of(existing));

        assertThrows(InvalidReservationDatesException.class, () ->
                reservationService.updateReservationBySecretary(1L, updated)
        );
    }
}
