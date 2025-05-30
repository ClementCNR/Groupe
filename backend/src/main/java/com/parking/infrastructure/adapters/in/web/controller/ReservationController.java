package com.parking.infrastructure.adapters.in.web.controller;

import com.parking.application.ports.in.ReservationManagementUseCase;
import com.parking.domain.model.Reservation;
import com.parking.infrastructure.adapters.in.dto.ReservationRequestDTO;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.parking.infrastructure.adapters.in.mapper.ReservationMapper;
import com.parking.infrastructure.adapters.in.dto.ReservationResponseDTO;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/reservations")
@Tag(name = "Reservations", description = "API de gestion des réservations de parking")
public class ReservationController {

    private final ReservationManagementUseCase reservationUseCase;

    public ReservationController(ReservationManagementUseCase reservationUseCase) {
        this.reservationUseCase = reservationUseCase;
    }

    @GetMapping
    @Operation(summary = "Lister les réservations de l'utilisateur connecté", description = "Retourne la liste des réservations de l'utilisateur courant")
    public ResponseEntity<List<Reservation>> getUserReservations(Principal principal) {
        String userId = principal.getName();
        List<Reservation> reservations = reservationUseCase.getUserReservations(userId);
        return ResponseEntity.ok(reservations);
    }

    @GetMapping("/all")
    @Operation(summary = "Lister toutes les réservations", description = "Retourne la liste de toutes les réservations (admin/secrétaire)")
    public ResponseEntity<List<Reservation>> getAllReservations() {
        List<Reservation> reservations = reservationUseCase.getAllReservations();
        return ResponseEntity.ok(reservations);
    }

    @PostMapping("/create")
    @Operation(summary = "Créer une réservation", description = "Crée une nouvelle réservation de place de parking")
    public ResponseEntity<ReservationResponseDTO> createReservation(@RequestBody ReservationRequestDTO request, Principal principal) {
        String userId = principal.getName();
        
        Reservation reservation = reservationUseCase.createReservation(
            userId,
            request.getParkingSpotId(),
            request.getStartDate(),
            request.getEndDate(),
            request.isRequiresElectricity()
        );
        return ResponseEntity.ok(ReservationMapper.toDTO(reservation));
    }

} 