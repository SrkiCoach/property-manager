package com.srki.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record UpdatePropertyRequest(

        @NotNull
        Long customerId,

        @NotBlank
        @Size(max = 100)
        String title,

        @NotBlank
        @Size(max = 200)
        String address,

        @NotBlank
        @Size(max = 100)
        String city,

        @NotBlank
        @Size(max = 100)
        String country,

        @Size(max = 1000)
        String notes
) {
}