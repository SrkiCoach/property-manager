package com.srki.backend;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

import com.srki.backend.entity.Customer;
import com.srki.backend.repository.CustomerRepository;

@SpringBootApplication
public class BackendApplication {

    public static void main(String[] args) {
        SpringApplication.run(BackendApplication.class, args);
    }

    @Bean
    CommandLineRunner initData(CustomerRepository customerRepository) {
        return args -> {
            if (customerRepository.count() == 0) {
                customerRepository.save(new Customer("Nikos", "Papadopoulos", "nikos@example.com", "6900000001"));
                customerRepository.save(new Customer("Maria", "Ioannou", "maria@example.com", "6900000002"));
                customerRepository.save(new Customer("Giorgos", "Kostas", "giorgos@example.com", "6900000003"));
            }
        };
    }
}
