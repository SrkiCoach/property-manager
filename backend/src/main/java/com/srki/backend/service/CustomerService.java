package com.srki.backend.service;

import com.srki.backend.dto.CreateCustomerRequest;
import com.srki.backend.dto.CustomerResponse;
import com.srki.backend.dto.PagedResponse;
import com.srki.backend.entity.Customer;
import com.srki.backend.repository.CustomerRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
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
                .map(this::toResponse)
                .toList();
    }

    public PagedResponse<CustomerResponse> findPaged(
            int page,
            int size,
            String sort,
            String direction) {
        Sort.Direction sortDirection = "desc".equalsIgnoreCase(direction)
                ? Sort.Direction.DESC
                : Sort.Direction.ASC;

        Pageable pageable = PageRequest.of(
                page,
                size,
                Sort.by(sortDirection, sort));

        Page<Customer> customerPage = customerRepository.findAll(pageable);

        List<CustomerResponse> items = customerPage
                .getContent()
                .stream()
                .map(this::toResponse)
                .toList();

        return new PagedResponse<>(
                items,
                customerPage.getNumber(),
                customerPage.getSize(),
                customerPage.getTotalElements(),
                customerPage.getTotalPages());
    }

    public CustomerResponse create(CreateCustomerRequest request) {
        Customer customer = new Customer(
                request.firstName(),
                request.lastName(),
                request.email(),
                request.phone());

        Customer savedCustomer = customerRepository.save(customer);

        return toResponse(savedCustomer);
    }

    private CustomerResponse toResponse(Customer customer) {
        return new CustomerResponse(
                customer.getId(),
                customer.getFirstName(),
                customer.getLastName(),
                customer.getEmail(),
                customer.getPhone());
    }
}