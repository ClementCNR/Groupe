package com.parking.application.ports.out;

import org.springframework.security.core.userdetails.UserDetails;

public interface TokenService {
    String generateToken(String email);
    String generateToken(UserDetails userDetails);
    String generateRefreshToken(UserDetails userDetails);
    boolean validateToken(String token);
    void invalidateToken(String token);
    String extractUsername(String token);
}
