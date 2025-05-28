package com.parking.infrastructure.adapters.in.mapper;

import com.parking.domain.model.User;
import com.parking.infrastructure.adapters.in.dto.UserDTO;

import org.springframework.stereotype.Component;

@Component
public class UserMapper {
    
    public UserDTO toDTO(User user) {
        if (user == null) {
            return null;
        }
        
        UserDTO dto = new UserDTO();
        dto.setId(user.getId());
        dto.setEmail(user.getEmail());
        dto.setFirstName(user.getFirstName());
        dto.setLastName(user.getLastName());
        dto.setRole(user.getRole());
        dto.setHasElectricVehicle(user.isHasElectricVehicle());
        return dto;
    }

    public User toDomain(UserDTO dto) {
        if (dto == null) {
            return null;
        }

        return new User(
            dto.getId(),
            dto.getEmail(),
            dto.getFirstName(),
            dto.getLastName(),
            dto.getRole(),
            dto.isHasElectricVehicle()
        );
    }
} 