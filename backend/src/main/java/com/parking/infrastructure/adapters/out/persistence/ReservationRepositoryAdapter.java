package com.parking.infrastructure.adapters.out.persistence;

import com.parking.application.ports.out.ReservationRepository;
import com.parking.domain.model.Reservation;
import com.parking.infrastructure.adapters.out.persistence.entity.ReservationEntity;
import com.parking.infrastructure.adapters.out.persistence.mapper.ReservationEntityMapper;
import com.parking.infrastructure.adapters.out.persistence.repository.JpaReservationRepository;

import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Component
public class ReservationRepositoryAdapter implements ReservationRepository {
    private final JpaReservationRepository jpaRepository;
    private final ReservationEntityMapper mapper = new ReservationEntityMapper();

    public ReservationRepositoryAdapter(JpaReservationRepository jpaRepository) {
        this.jpaRepository = jpaRepository;
    }

    @Override
    public Reservation save(Reservation reservation) {
        ReservationEntity entity = mapper.toEntity(reservation);
        return mapper.toDomain(jpaRepository.save(entity));
    }

    @Override
    public Optional<Reservation> findById(Long id) {
        return jpaRepository.findById(id).map(mapper::toDomain);
    }

    @Override
    public List<Reservation> findByUserId(String userId) {
        return jpaRepository.findByUserId(userId).stream().map(mapper::toDomain).collect(Collectors.toList());
    }

    @Override
    public List<Reservation> findAll() {
        return jpaRepository.findAll().stream().map(mapper::toDomain).collect(Collectors.toList());
    }

    @Override
    public void deleteById(Long id) {
        jpaRepository.deleteById(id);
    }
} 