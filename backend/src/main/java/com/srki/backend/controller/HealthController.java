package com.srki.backend.controller;

import com.srki.backend.dto.HealthResponse;
import com.srki.backend.service.HealthService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HealthController {

    private final HealthService healthService;

    public HealthController(HealthService healthService) {
        this.healthService = healthService;
    }

    @GetMapping("/api/health")
    public HealthResponse getHealth() {
        return healthService.getHealth();
    }
}