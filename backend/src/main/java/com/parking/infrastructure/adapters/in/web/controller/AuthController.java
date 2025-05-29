package com.parking.infrastructure.adapters.in.web.controller;

import com.parking.application.ports.in.AuthenticationUseCase;
import com.parking.domain.model.AuthCredentials;
import com.parking.domain.model.User;
import com.parking.infrastructure.adapters.in.dto.LoginRequestDTO;
import com.parking.infrastructure.adapters.in.dto.UserDTO;
import com.parking.infrastructure.adapters.in.mapper.UserMapper;
import com.parking.infrastructure.adapters.out.security.JwtService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.parking.infrastructure.adapters.in.dto.AuthenticationResponseDTO;

@RestController
@RequestMapping("/auth")
@Tag(name = "Authentication", description = "API d'authentification")
public class AuthController {

    private final AuthenticationUseCase authenticationUseCase;
    private final UserMapper userMapper;
    private final JwtService jwtService;

    public AuthController(AuthenticationUseCase authenticationUseCase, UserMapper userMapper, JwtService jwtService) {
        this.authenticationUseCase = authenticationUseCase;
        this.userMapper = userMapper;
        this.jwtService = jwtService;
    }

    @PostMapping("/login")
    @Operation(summary = "Authentifier un utilisateur", description = "Authentifie un utilisateur avec son email et son mot de passe")
    public ResponseEntity<AuthenticationResponseDTO> login(@RequestBody LoginRequestDTO loginRequest) {
        AuthCredentials credentials = new AuthCredentials();
        credentials.setEmail(loginRequest.getEmail());
        credentials.setPassword(loginRequest.getPassword());

        User authenticatedUser = authenticationUseCase.authenticate(credentials);
        
        String token = jwtService.generateToken(authenticatedUser.getEmail());
        UserDTO userDTO = userMapper.toDTO(authenticatedUser);
        return ResponseEntity.ok(new AuthenticationResponseDTO(token, userDTO));
    }

    @PostMapping("/logout")
    @Operation(summary = "Déconnexion", description = "Déconnecte l'utilisateur en invalidant son token JWT")
    public ResponseEntity<Void> logout(HttpServletRequest request) {
        String authHeader = request.getHeader("Authorization");
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.badRequest().build();
        }
        String token = authHeader.substring(7);
        authenticationUseCase.logout(token);
        return ResponseEntity.ok().build();
    }
} 