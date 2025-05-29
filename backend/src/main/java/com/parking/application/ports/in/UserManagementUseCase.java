package com.parking.application.ports.in;

import java.util.List;
import java.util.Optional;

import com.parking.domain.model.User;

public interface UserManagementUseCase {
    Optional<User> getUserById(Long id);
    List<User> getAllUsers();
}