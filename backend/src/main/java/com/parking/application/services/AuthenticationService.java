package com.parking.application.services;

import com.parking.domain.model.AuthCredentials;
import com.parking.domain.model.User;
import com.parking.application.ports.in.AuthenticationUseCase;
import com.parking.application.ports.out.UserRepository;
import com.parking.domain.exception.UserNotFoundException;
import com.parking.domain.exception.InvalidUserDataException;
import com.parking.domain.validator.CredentialsValidator;
import com.parking.application.ports.out.TokenService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthenticationService implements AuthenticationUseCase {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final TokenService tokenService;

    public AuthenticationService(UserRepository userRepository, PasswordEncoder passwordEncoder, TokenService tokenService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.tokenService = tokenService;
    }

    @Override
    public User authenticate(AuthCredentials credentials) {
        if (!CredentialsValidator.isValidEmail(credentials.getEmail())) {
            throw new InvalidUserDataException("Format d'email invalide");
        }
        if (!CredentialsValidator.isValidPassword(credentials.getPassword())) {
            throw new InvalidUserDataException("Format de mot de passe invalide");
        }
        return userRepository.findByEmail(credentials.getEmail())
                .filter(user -> passwordEncoder.matches(credentials.getPassword(), user.getPassword()))
                .orElseThrow(() -> new UserNotFoundException("Invalid credentials"));
    }

    @Override
    public void logout(String token) {
        tokenService.invalidateToken(token);
    }
} 