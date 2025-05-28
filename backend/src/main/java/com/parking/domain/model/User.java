package com.parking.domain.model;

import lombok.Data;

@Data
public class User {

    private Long id;
    private String email;
    private String firstName;
    private String lastName;
    private UserRole role;
    private boolean hasElectricVehicle;

    public User() {}

    public User(Long id, String email, String firstName, String lastName, UserRole role, boolean hasElectricVehicle) {
        this.id = id;
        this.email = email;
        this.firstName = firstName;
        this.lastName = lastName;
        this.role = role;
        this.hasElectricVehicle = hasElectricVehicle;
    }
}
