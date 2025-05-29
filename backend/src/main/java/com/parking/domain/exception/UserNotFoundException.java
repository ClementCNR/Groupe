package com.parking.domain.exception;

public class UserNotFoundException extends RuntimeException {
    public UserNotFoundException(String message) {
        super(message);
    }

    public UserNotFoundException(Long id) {
        super("Utilisateur non trouvé avec l'ID : " + id);
    }
} 