package com.parking.infrastructure.adapters.in.web;

import com.parking.domain.exception.UserNotFoundException;
import com.parking.domain.ports.in.UserManagementUseCase;
import com.parking.infrastructure.adapters.in.dto.UserDTO;
import com.parking.infrastructure.adapters.in.mapper.UserMapper;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/users")
@Tag(name = "Gestion des Utilisateurs", description = "APIs pour la gestion des utilisateurs")
public class UserController {
    private final UserManagementUseCase userManagementUseCase;
    private final UserMapper userMapper;

    public UserController(UserManagementUseCase userManagementUseCase, UserMapper userMapper) {
        this.userManagementUseCase = userManagementUseCase;
        this.userMapper = userMapper;
    }

    @Operation(summary = "Récupérer un utilisateur par son ID")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Utilisateur trouvé"),
        @ApiResponse(responseCode = "404", description = "Utilisateur non trouvé")
    })
    @GetMapping("/{id}")
    public ResponseEntity<UserDTO> getUserById(
            @Parameter(description = "ID de l'utilisateur") @PathVariable Long id) {
        return userManagementUseCase.getUserById(id)
                .map(user -> ResponseEntity.ok(userMapper.toDTO(user)))
                .orElseThrow(() -> new UserNotFoundException(id));
    }

    @Operation(summary = "Récupérer tous les utilisateurs")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Liste des utilisateurs récupérée avec succès")
    })
    @GetMapping
    public ResponseEntity<List<UserDTO>> getAllUsers() {
        List<UserDTO> users = userManagementUseCase.getAllUsers().stream()
                .map(userMapper::toDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(users);
    }
} 