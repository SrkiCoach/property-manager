package com.srki.backend.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ProblemDetail;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(CustomerNotFoundException.class)
    public ProblemDetail handleCustomerNotFound(
            CustomerNotFoundException exception) {
        ProblemDetail problem = ProblemDetail.forStatus(
                HttpStatus.NOT_FOUND);

        problem.setTitle("Customer not found");
        problem.setDetail(exception.getMessage());

        return problem;
    }
}