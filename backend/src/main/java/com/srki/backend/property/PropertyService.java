package com.srki.backend.property;

import java.util.List;
import java.util.Map;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.srki.backend.common.dto.PagedResponse;
import com.srki.backend.customer.Customer;
import com.srki.backend.customer.CustomerRepository;
import com.srki.backend.customer.exception.CustomerNotFoundException;
import com.srki.backend.property.dto.CreatePropertyRequest;
import com.srki.backend.property.dto.PropertyResponse;
import com.srki.backend.property.dto.UpdatePropertyRequest;
import com.srki.backend.property.exception.PropertyNotFoundException;

@Service
public class PropertyService {

        private final PropertyRepository propertyRepository;
        private final CustomerRepository customerRepository;

        public PropertyService(
                        PropertyRepository propertyRepository,
                        CustomerRepository customerRepository) {
                this.propertyRepository = propertyRepository;
                this.customerRepository = customerRepository;
        }

        private static final int DEFAULT_PAGE_SIZE = 5;
        private static final int MAX_PAGE_SIZE = 100;

        private static final Map<String, String> SORT_FIELDS = Map.of(
                        "id", "id",
                        "customerName", "customer.lastName",
                        "title", "title",
                        "address", "address",
                        "city", "city",
                        "country", "country");

        @Transactional
        public PropertyResponse create(CreatePropertyRequest request) {
                Customer customer = getCustomer(request.customerId());

                Property property = new Property(
                                customer,
                                request.title(),
                                request.address(),
                                request.city(),
                                request.country(),
                                request.notes());

                Property savedProperty = propertyRepository.save(property);

                return toResponse(savedProperty);
        }

        private PropertyResponse toResponse(Property property) {
                Customer customer = property.getCustomer();

                String customerName = String.join(
                                " ",
                                customer.getFirstName(),
                                customer.getLastName());

                return new PropertyResponse(
                                property.getId(),
                                customer.getId(),
                                customerName,
                                property.getTitle(),
                                property.getAddress(),
                                property.getCity(),
                                property.getCountry(),
                                property.getNotes());
        }

        @Transactional(readOnly = true)
        public PagedResponse<PropertyResponse> findPaged(
                        int page,
                        int size,
                        String sort,
                        String direction,
                        String search) {
                int safePage = Math.max(page, 0);

                int safeSize = size <= 0
                                ? DEFAULT_PAGE_SIZE
                                : Math.min(size, MAX_PAGE_SIZE);

                String safeSort = SORT_FIELDS.getOrDefault(
                                sort,
                                "title");

                Sort.Direction sortDirection = "desc".equalsIgnoreCase(direction)
                                ? Sort.Direction.DESC
                                : Sort.Direction.ASC;

                Pageable pageable = PageRequest.of(
                                safePage,
                                safeSize,
                                Sort.by(sortDirection, safeSort));

                Page<Property> propertyPage;

                if (search == null || search.isBlank()) {
                        propertyPage = propertyRepository.findAll(pageable);
                } else {
                        propertyPage = propertyRepository.search(
                                        search.trim(),
                                        pageable);
                }

                List<PropertyResponse> items = propertyPage
                                .getContent()
                                .stream()
                                .map(this::toResponse)
                                .toList();

                return new PagedResponse<>(
                                items,
                                propertyPage.getNumber(),
                                propertyPage.getSize(),
                                propertyPage.getTotalElements(),
                                propertyPage.getTotalPages());
        }

        @Transactional(readOnly = true)
        public PropertyResponse findById(Long id) {
                Property property = getProperty(id);

                return toResponse(property);
        }

        @Transactional
        public PropertyResponse update(
                        Long id,
                        UpdatePropertyRequest request) {
                Property property = getProperty(id);

                Customer customer = getCustomer(request.customerId());

                property.setCustomer(customer);
                property.setTitle(request.title());
                property.setAddress(request.address());
                property.setCity(request.city());
                property.setCountry(request.country());
                property.setNotes(request.notes());

                Property savedProperty = propertyRepository.save(property);

                return toResponse(savedProperty);
        }

        @Transactional
        public void delete(Long id) {
                Property property = getProperty(id);
                propertyRepository.delete(property);
        }

        private Property getProperty(Long id) {
                return propertyRepository.findById(id)
                                .orElseThrow(() -> new PropertyNotFoundException(id));
        }

        private Customer getCustomer(Long customerId) {
                return customerRepository.findById(customerId)
                                .orElseThrow(() -> new CustomerNotFoundException(customerId));
        }

}
