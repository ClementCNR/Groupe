package com.parking.infrastructure.adapters.out.persistence;

import com.parking.application.ports.out.UserRepository;
import com.parking.domain.model.User;
import com.parking.infrastructure.adapters.out.persistence.entity.UserEntity;

import org.springframework.stereotype.Component;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Component
public class UserRepositoryAdapter implements UserRepository {
    
    private final JpaUserRepository jpaUserRepository;

    public UserRepositoryAdapter(JpaUserRepository jpaUserRepository) {
        this.jpaUserRepository = jpaUserRepository;
    }

    @Override
    public Optional<User> findById(Long id) {
        return jpaUserRepository.findById(id)
            .map(this::toUser);
    }

    @Override
    public List<User> findAll() {
        return jpaUserRepository.findAll().stream()
            .map(this::toUser)
            .collect(Collectors.toList());
    }

    @Override
    public Optional<User> findByEmail(String email) {
        return jpaUserRepository.findByEmail(email)
            .map(this::toUser);
    }

    private User toUser(UserEntity entity) {
        return new User(
            entity.getId(),
            entity.getEmail(),
            entity.getPassword(),
            entity.getFirstName(),
            entity.getLastName(),
            entity.getRole()
        );
    }
} 