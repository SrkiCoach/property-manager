package com.srki.backend.customer;

import java.util.List;
import java.util.Set;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.srki.backend.common.dto.PagedResponse;
import com.srki.backend.customer.dto.CreateCustomerRequest;
import com.srki.backend.customer.dto.CustomerLookupResponse;
import com.srki.backend.customer.dto.CustomerResponse;
import com.srki.backend.customer.dto.UpdateCustomerRequest;
//import com.srki.backend.dto.UpdateCustomerRequest;
import com.srki.backend.customer.exception.CustomerNotFoundException;

@Service
public class CustomerService {

        private final CustomerRepository customerRepository;

        private static final Set<String> ALLOWED_SORT_FIELDS = Set.of(
                        "id",
                        "firstName",
                        "lastName",
                        "email",
                        "phone");

        private static final String DEFAULT_SORT_FIELD = "lastName";
        private static final int DEFAULT_PAGE_SIZE = 5;
        private static final int MAX_PAGE_SIZE = 100;

        public CustomerService(CustomerRepository customerRepository) {
                this.customerRepository = customerRepository;
        }

        public PagedResponse<CustomerResponse> findPaged(
                        int page,
                        int size,
                        String sort,
                        String direction,
                        String search) {

                int safePage = Math.max(page, 0);

                int safeSize = size <= 0
                                ? DEFAULT_PAGE_SIZE
                                : Math.min(size, MAX_PAGE_SIZE);

                String safeSort = ALLOWED_SORT_FIELDS.contains(sort)
                                ? sort
                                : DEFAULT_SORT_FIELD;

                Sort.Direction sortDirection = "desc".equalsIgnoreCase(direction)
                                ? Sort.Direction.DESC
                                : Sort.Direction.ASC;

                Pageable pageable = PageRequest.of(
                                safePage,
                                safeSize,
                                Sort.by(sortDirection, safeSort));

                Page<Customer> customerPage;

                if (search == null || search.isBlank()) {
                        customerPage = customerRepository.findAll(pageable);
                } else {
                        customerPage = customerRepository
                                        .findByFirstNameContainingIgnoreCaseOrLastNameContainingIgnoreCaseOrEmailContainingIgnoreCaseOrPhoneContainingIgnoreCase(
                                                        search,
                                                        search,
                                                        search,
                                                        search,
                                                        pageable);
                }

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

        @Transactional
        public CustomerResponse update(
                        Long id,
                        UpdateCustomerRequest request) {
                Customer customer = getCustomer(id);

                customer.setFirstName(request.firstName());
                customer.setLastName(request.lastName());
                customer.setEmail(request.email());
                customer.setPhone(request.phone());

                Customer savedCustomer = customerRepository.save(customer);

                return toResponse(savedCustomer);
        }

        @Transactional
        public void delete(Long id) {
                Customer customer = getCustomer(id);
                customerRepository.delete(customer);

        }

        private Customer getCustomer(Long customerId) {
                return customerRepository.findById(customerId)
                                .orElseThrow(() -> new CustomerNotFoundException(customerId));
        }

        public List<CustomerLookupResponse> findAllForLookup() {
                return customerRepository.findAllForLookup();
        }

}
