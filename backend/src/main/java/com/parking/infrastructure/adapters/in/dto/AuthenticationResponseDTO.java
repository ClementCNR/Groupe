package com.parking.infrastructure.adapters.in.dto;
import com.parking.domain.model.UserRole;
import lombok.Data;

@Data
public class AuthenticationResponseDTO {
    private String token;
    private Long id;
    private String email;
    private String firstName;
    private String lastName;
    private UserRole role;

    public AuthenticationResponseDTO(String token, UserDTO user) {
        this.token = token;
        this.id = user.getId();
        this.email = user.getEmail();
        this.firstName = user.getFirstName();
        this.lastName = user.getLastName();
        this.role = user.getRole();
    }
}
