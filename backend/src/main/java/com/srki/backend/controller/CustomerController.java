package com.srki.backend.controller;

import com.srki.backend.dto.CustomerResponse;
import com.srki.backend.service.CustomerService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

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
}