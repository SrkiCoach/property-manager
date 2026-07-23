package com.srki.backend.health;

import org.springframework.stereotype.Service;

import com.srki.backend.health.dto.HealthResponse;

@Service
public class HealthService {

    public HealthResponse getHealth() {

        return new HealthResponse(
                "UP",
                "Property Manager",
                "1.0.0");
    }
}
