package com.srki.backend.common.exception;

import java.time.Instant;
import java.util.LinkedHashMap;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import com.srki.backend.common.dto.ApiErrorResponse;
import com.srki.backend.customer.exception.CustomerNotFoundException;
import com.srki.backend.property.exception.PropertyNotFoundException;

@RestControllerAdvice
public class GlobalExceptionHandler {

        @ExceptionHandler(CustomerNotFoundException.class)
        public ResponseEntity<ApiErrorResponse> handleCustomerNotFound(
                        CustomerNotFoundException exception) {
                ApiErrorResponse response = new ApiErrorResponse(
                                "CUSTOMER_NOT_FOUND",
                                exception.getMessage(),
                                Map.of(),
                                Instant.now());

                return ResponseEntity
                                .status(HttpStatus.NOT_FOUND)
                                .body(response);
        }

        @ExceptionHandler(MethodArgumentNotValidException.class)
        public ResponseEntity<ApiErrorResponse> handleValidation(
                        MethodArgumentNotValidException exception) {
                Map<String, String> fieldErrors = new LinkedHashMap<>();

                for (FieldError fieldError : exception.getBindingResult().getFieldErrors()) {
                        fieldErrors.putIfAbsent(
                                        fieldError.getField(),
                                        fieldError.getDefaultMessage());
                }

                ApiErrorResponse response = new ApiErrorResponse(
                                "VALIDATION_FAILED",
                                "Request validation failed",
                                fieldErrors,
                                Instant.now());

                return ResponseEntity
                                .status(HttpStatus.BAD_REQUEST)
                                .body(response);
        }

        @ExceptionHandler(PropertyNotFoundException.class)
        @ResponseStatus(HttpStatus.NOT_FOUND)
        public ApiErrorResponse handlePropertyNotFound(
                        PropertyNotFoundException exception) {
                return new ApiErrorResponse(
                                "PROPERTY_NOT_FOUND",
                                exception.getMessage(),
                                Map.of(),
                                Instant.now());
        }
}
