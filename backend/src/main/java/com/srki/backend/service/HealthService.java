package com.srki.backend.service;

import com.srki.backend.dto.HealthResponse;
import org.springframework.stereotype.Service;

@Service
public class HealthService {

    public HealthResponse getHealth() {

        return new HealthResponse(
                "UP",
                "Property Manager",
                "1.0.0"
        );
    }
}