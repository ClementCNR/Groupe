package com.parking.infrastructure.adapters.out.persistence;

import com.parking.application.ports.out.ParkingSpotRepository;
import com.parking.domain.model.ParkingSpot;
import com.parking.infrastructure.adapters.out.persistence.mapper.ParkingSpotEntityMapper;
import com.parking.infrastructure.adapters.out.persistence.repository.JpaParkingSpotRepository;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Component
public class ParkingSpotRepositoryAdapter implements ParkingSpotRepository {
    private final JpaParkingSpotRepository jpaRepository;
    private final ParkingSpotEntityMapper mapper = new ParkingSpotEntityMapper();

    public ParkingSpotRepositoryAdapter(JpaParkingSpotRepository jpaRepository) {
        this.jpaRepository = jpaRepository;
    }

    @Override
    public Optional<ParkingSpot> findById(String id) {
        return jpaRepository.findById(id).map(mapper::toDomain);
    }

    @Override
    public List<ParkingSpot> findAll() {
        return jpaRepository.findAll().stream().map(mapper::toDomain).collect(Collectors.toList());
    }

    @Override
    public List<ParkingSpot> findByHasCharger(boolean hasCharger) {
        return jpaRepository.findByHasCharger(hasCharger).stream().map(mapper::toDomain).collect(Collectors.toList());
    }
} 