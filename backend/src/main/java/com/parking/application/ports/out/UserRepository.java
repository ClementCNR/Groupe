package com.parking.application.ports.out;

import java.util.List;
import java.util.Optional;

import com.parking.domain.model.User;

public interface UserRepository {
    Optional<User> findById(Long id);
    List<User> findAll();
    Optional<User> findByEmail(String email);
} 