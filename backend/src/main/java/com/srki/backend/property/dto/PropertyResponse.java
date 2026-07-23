package com.srki.backend.property.dto;

public record PropertyResponse(
                Long id,
                Long customerId,
                String customerName,
                String title,
                String address,
                String city,
                String country,
                String notes) {
}
