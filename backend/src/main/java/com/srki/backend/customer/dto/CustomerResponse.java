package com.srki.backend.customer.dto;

public record CustomerResponse(
    Long id,
    String firstName,
    String lastName,
    String email,
    String phone) {
}
