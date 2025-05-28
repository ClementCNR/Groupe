package com.parking.infrastructure.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.License;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI parkingReservationOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("API de Réservation de Parking")
                        .description("API pour la gestion des réservations de parking")
                        .version("1.0")
                        .contact(new Contact()
                                .name("Équipe Parking")
                                .email("contact@parking.com"))
                        .license(new License()
                                .name("Apache 2.0")
                                .url("http://www.apache.org/licenses/LICENSE-2.0.html")));
    }
} 