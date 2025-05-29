package com.parking.domain.model;

import lombok.Data;

@Data
public class User {

    private Long id;
    private String email;
    private String password;
    private String firstName;
    private String lastName;
    private UserRole role;

    public User() {}

    public User(Long id, String email, String password, String firstName, String lastName, UserRole role) {
        this.id = id;
        this.email = email;
        this.password = password;
        this.firstName = firstName;
        this.lastName = lastName;
        this.role = role;
    }

    public User(Long id, String email, String firstName, String lastName, UserRole role) {
        this.id = id;
        this.email = email;
        this.firstName = firstName;
        this.lastName = lastName;
        this.role = role;
    }
}
