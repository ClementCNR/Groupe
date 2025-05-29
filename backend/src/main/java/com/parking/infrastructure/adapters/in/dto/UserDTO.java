package com.parking.infrastructure.adapters.in.dto;

import com.parking.domain.model.UserRole;
import lombok.Data;

@Data
public class UserDTO {
    private Long id;
    private String email;
    private String firstName;
    private String lastName;
    private UserRole role;
} 