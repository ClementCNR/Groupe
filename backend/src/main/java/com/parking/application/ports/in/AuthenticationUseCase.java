package com.parking.application.ports.in;

import com.parking.domain.model.AuthCredentials;
import com.parking.domain.model.User;


public interface AuthenticationUseCase {
    User authenticate(AuthCredentials credentials);
} 