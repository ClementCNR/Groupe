package com.parking.infrastructure.adapters.in.web.controller;

import com.parking.application.ports.in.ReservationManagementUseCase;
import com.parking.domain.model.Reservation;
import com.parking.domain.model.ReservationStatus;
import com.parking.infrastructure.adapters.in.dto.ReservationRequestDTO;
import com.parking.infrastructure.adapters.in.dto.ReservationResponseDTO;
import com.parking.infrastructure.adapters.in.mapper.ReservationMapper;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/reservations")
@Tag(name = "Reservations", description = "API de gestion des réservations de parking")
public class ReservationController {

    private final ReservationManagementUseCase reservationUseCase;
    @Enumerated(EnumType.STRING)
    private ReservationStatus status;
    public ReservationController(ReservationManagementUseCase reservationUseCase) {
        this.reservationUseCase = reservationUseCase;
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

    @GetMapping
    @Operation(summary = "Lister les réservations de l'utilisateur connecté", description = "Retourne la liste des réservations de l'utilisateur courant")
    public ResponseEntity<List<Reservation>> getUserReservations(Principal principal) {
        String userId = principal.getName();
        return ResponseEntity.ok(reservationUseCase.getUserReservations(userId));
    }

    @GetMapping("/all")
    @Operation(summary = "Lister toutes les réservations", description = "Retourne la liste de toutes les réservations (admin/secrétaire)")
    public ResponseEntity<List<Reservation>> getAllReservations() {
        return ResponseEntity.ok(reservationUseCase.getAllReservations());
    }
    
    @PatchMapping("/{id}")
    @PreAuthorize("hasRole('SECRETARY')")
    @Operation(summary = "Modifier une réservation (admin/secrétaire)", description = "Permet de modifier une réservation existante.")
    public ResponseEntity<ReservationResponseDTO> updateReservation(
            @PathVariable Long id,
            @RequestBody ReservationRequestDTO request
    ) {
        var authorities = SecurityContextHolder.getContext().getAuthentication().getAuthorities();

        boolean isSecretary = authorities.stream()
                .anyMatch(a -> a.getAuthority().equals("SECRETARY"));

        if (!isSecretary) {
            throw new SecurityException("Vous n'avez pas le rôle requis pour modifier cette réservation.");
        }

        Reservation existingReservation = reservationUseCase.getReservationById(id);

        existingReservation.setParkingSpotId(request.getParkingSpotId());
        existingReservation.setStartDate(request.getStartDate());
        existingReservation.setEndDate(request.getEndDate());
        existingReservation.setStatus(request.getStatus());
        existingReservation.setCheckInTime(request.getCheckInTime());
        existingReservation.setUpdatedAt(LocalDateTime.now());

        Reservation updated = reservationUseCase.updateReservationByAdmin(id, existingReservation);
        return ResponseEntity.ok(ReservationMapper.toDTO(updated));
    }



    @DeleteMapping("/{id}/cancel")
    @Operation(summary = "Annuler une réservation", description = "Permet à l'utilisateur connecté d'annuler une réservation réservée.")
    public ResponseEntity<Void> cancelReservation(@PathVariable Long id, Principal principal) {
        String userId = principal.getName();
        reservationUseCase.cancelReservation(id, userId);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{id}/checkin")
    @Operation(summary = "Faire le check-in d'une réservation", description = "Permet à l'utilisateur connecté de valider sa présence sur une réservation.")
    public ResponseEntity<Void> checkInReservation(@PathVariable Long id, Principal principal) {
        String name = principal.getName();
        reservationUseCase.checkIn(id, name);
        return ResponseEntity.noContent().build();
    }
}
