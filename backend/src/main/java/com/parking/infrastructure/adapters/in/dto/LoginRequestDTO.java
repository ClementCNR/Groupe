package com.parking.infrastructure.adapters.in.dto;

import lombok.Data;

@Data
public class LoginRequestDTO {
    private String email;
    private String password;
} 