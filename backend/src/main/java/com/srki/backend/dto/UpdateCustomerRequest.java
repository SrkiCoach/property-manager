package com.srki.backend.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record UpdateCustomerRequest(

                @NotBlank @Size(max = 50) String firstName,

                @NotBlank @Size(max = 50) String lastName,

                @Email @Size(max = 100) String email,

                @Size(max = 30) String phone

) {
}
