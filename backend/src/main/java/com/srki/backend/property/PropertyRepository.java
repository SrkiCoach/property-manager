package com.srki.backend.property;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface PropertyRepository extends JpaRepository<Property, Long> {

    @Query("""
            select p
            from Property p
            join p.customer c
            where
                lower(p.title) like lower(concat('%', :search, '%'))
                or lower(p.address) like lower(concat('%', :search, '%'))
                or lower(p.city) like lower(concat('%', :search, '%'))
                or lower(p.country) like lower(concat('%', :search, '%'))
                or lower(c.firstName) like lower(concat('%', :search, '%'))
                or lower(c.lastName) like lower(concat('%', :search, '%'))
            """)
    Page<Property> search(
            @Param("search") String search,
            Pageable pageable);
}
