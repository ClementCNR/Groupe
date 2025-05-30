package com.parking.application.services;

import com.parking.application.ports.out.ParkingSpotRepository;
import com.parking.application.ports.out.ReservationRepository;
import com.parking.application.ports.out.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import java.time.LocalDate;
import com.parking.domain.model.*;


import static org.junit.jupiter.api.Assertions.*;

import java.util.*;

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

        ParkingSpot spot = new ParkingSpot("1", "1", 1, true  );
        spot.setId(parkingSpotId);
        spot.setRow("B"); // Pas rangée A ou F

        // Mock les méthodes
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
        LocalDate endDate = startDate.minusDays(2); // Mauvais créneau
        boolean requiresElectricity = false;

        User user = new User();
        user.setEmail(userId);
        user.setRole(UserRole.EMPLOYEE);

        ParkingSpot spot = new ParkingSpot("1", "1", 1, true  );
        spot.setId(parkingSpotId);
        spot.setRow("B"); // Pas rangée A ou F

        when(userRepository.findByEmail(userId)).thenReturn(Optional.of(user));
        when(parkingSpotRepository.findById(parkingSpotId)).thenReturn(Optional.of(spot));


        // Act & Assert
        assertThrows(com.parking.domain.exception.InvalidReservationDatesException.class, () -> {
            reservationService.createReservation(userId, parkingSpotId, startDate, endDate, requiresElectricity);
        });
    }

    @Test
    void cancelReservation() {
    }

    @Test
    void checkIn() {
    }

    @Test
    void getUserReservations() {
    }

    @Test
    void getAllReservations() {
    }

    @Test
    void countBusinessDays() {
    }
}