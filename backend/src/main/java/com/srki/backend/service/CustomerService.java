package com.srki.backend.service;

import com.srki.backend.dto.CreateCustomerRequest;
import com.srki.backend.dto.CustomerResponse;
import com.srki.backend.entity.Customer;
import com.srki.backend.repository.CustomerRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CustomerService {

    private final CustomerRepository customerRepository;

    public CustomerService(CustomerRepository customerRepository) {
        this.customerRepository = customerRepository;
    }

    public List<CustomerResponse> findAll() {
        return customerRepository.findAll()
                .stream()
                .map(customer -> new CustomerResponse(
                        customer.getId(),
                        customer.getFirstName(),
                        customer.getLastName(),
                        customer.getEmail(),
                        customer.getPhone()
                ))
                .toList();
    }

    public CustomerResponse create(CreateCustomerRequest request) {
        Customer customer = new Customer(
                request.firstName(),
                request.lastName(),
                request.email(),
                request.phone()
        );

        Customer savedCustomer = customerRepository.save(customer);

        return new CustomerResponse(
                savedCustomer.getId(),
                savedCustomer.getFirstName(),
                savedCustomer.getLastName(),
                savedCustomer.getEmail(),
                savedCustomer.getPhone()
        );
    }
}