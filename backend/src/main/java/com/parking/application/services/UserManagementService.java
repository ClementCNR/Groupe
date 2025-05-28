package com.parking.application.services;

import com.parking.domain.model.User;
import com.parking.domain.ports.in.UserManagementUseCase;
import com.parking.domain.ports.out.UserRepository;

import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class UserManagementService implements UserManagementUseCase {
    private final UserRepository userRepository;

    public UserManagementService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public Optional<User> getUserById(Long id) {
        return userRepository.findById(id);
    }

    @Override
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }
} 