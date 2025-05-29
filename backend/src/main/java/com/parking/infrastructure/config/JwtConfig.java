package com.parking.infrastructure.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import io.jsonwebtoken.security.Keys;
import java.security.Key;


@Configuration
public class JwtConfig {

    @Value("${application.security.jwt.secret-key}")
    private String secret;

    @Bean
    public Key jwtSigningKey() {
        return Keys.hmacShaKeyFor(secret.getBytes());
    }
}
