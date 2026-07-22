package com.srki.backend.repository;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.srki.backend.dto.CustomerLookupResponse;
import com.srki.backend.entity.Customer;

public interface CustomerRepository extends JpaRepository<Customer, Long> {

    Page<Customer> findByFirstNameContainingIgnoreCaseOrLastNameContainingIgnoreCaseOrEmailContainingIgnoreCaseOrPhoneContainingIgnoreCase(
            String firstName,
            String lastName,
            String email,
            String phone,
            Pageable pageable);

    @Query("""
            select new com.srki.backend.dto.CustomerLookupResponse(
                c.id,
                concat(c.firstName, ' ', c.lastName)
            )
            from Customer c
            order by c.lastName, c.firstName
            """)
    List<CustomerLookupResponse> findAllForLookup();

}
