package com.parking.application.ports.out;

import org.springframework.security.core.userdetails.UserDetails;
import java.util.Map;

public interface TokenService {
    String generateToken(UserDetails userDetails);
    String generateToken(Map<String, Object> extraClaims, UserDetails userDetails);
    String generateRefreshToken(UserDetails userDetails);
    String extractUsername(String token);
    boolean isTokenValid(String token, UserDetails userDetails);
}
