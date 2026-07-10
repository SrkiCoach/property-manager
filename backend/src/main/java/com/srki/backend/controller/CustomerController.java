package com.srki.backend.controller;

import com.srki.backend.dto.CustomerResponse;
import com.srki.backend.service.CustomerService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import com.srki.backend.dto.CreateCustomerRequest;
import com.srki.backend.dto.PagedResponse;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;

@RestController
public class CustomerController {

    private final CustomerService customerService;

    public CustomerController(CustomerService customerService) {
        this.customerService = customerService;
    }

    @GetMapping("/api/customers")
    public List<CustomerResponse> findAll() {
        return customerService.findAll();
    }

    @PostMapping("/api/customers")
    public CustomerResponse create(@Valid @RequestBody CreateCustomerRequest request) {
        return customerService.create(request);
    }

    @GetMapping("/api/customers/paged")
    public PagedResponse<CustomerResponse> findPaged(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size,
            @RequestParam(defaultValue = "la") String sort,
            @RequestParam(defaultValue = "asc") String direction,
            @RequestParam(defaultValue = "") String search) {
        return customerService.findPaged(
                page,
                size,
                sort,
                direction,
                search);

    }
}