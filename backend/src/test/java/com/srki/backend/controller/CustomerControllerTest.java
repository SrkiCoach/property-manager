package com.srki.backend.controller;

import tools.jackson.databind.ObjectMapper;
import com.srki.backend.dto.CreateCustomerRequest;
import com.srki.backend.repository.CustomerRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.hamcrest.Matchers.hasSize;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
class CustomerControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private CustomerRepository customerRepository;

    @BeforeEach
    void clearDatabase() {
        customerRepository.deleteAll();
    }

    @Test
    void shouldCreateCustomer() throws Exception {
        CreateCustomerRequest request = new CreateCustomerRequest(
                "Nikos",
                "Papadopoulos",
                "nikos@example.com",
                "6900000001");

        mockMvc.perform(post("/api/customers")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").isNumber())
                .andExpect(jsonPath("$.firstName").value("Nikos"))
                .andExpect(jsonPath("$.lastName").value("Papadopoulos"));
    }

    @Test
    void shouldRejectInvalidCustomer() throws Exception {
        CreateCustomerRequest request = new CreateCustomerRequest(
                "",
                "",
                "invalid-email",
                "");

        mockMvc.perform(post("/api/customers")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.code").value("VALIDATION_FAILED"))
                .andExpect(jsonPath("$.fieldErrors.firstName").exists())
                .andExpect(jsonPath("$.fieldErrors.lastName").exists())
                .andExpect(jsonPath("$.fieldErrors.email").exists());
    }

    @Test
    void shouldReturnPagedCustomers() throws Exception {
        createCustomer("Nikos", "Papadopoulos");
        createCustomer("Maria", "Ioannou");
        createCustomer("Giorgos", "Kostas");

        mockMvc.perform(get("/api/customers/paged")
                .param("page", "0")
                .param("size", "2")
                .param("sort", "lastName")
                .param("direction", "asc"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.items", hasSize(2)))
                .andExpect(jsonPath("$.page").value(0))
                .andExpect(jsonPath("$.size").value(2))
                .andExpect(jsonPath("$.totalItems").value(3))
                .andExpect(jsonPath("$.totalPages").value(2));
    }

    @Test
    void shouldDeleteCustomer() throws Exception {
        var customer = customerRepository.save(
                new com.srki.backend.entity.Customer(
                        "Temporary",
                        "Customer",
                        "temporary@example.com",
                        "6909999999"));

        mockMvc.perform(delete("/api/customers/{id}", customer.getId()))
                .andExpect(status().isNoContent());

        mockMvc.perform(delete("/api/customers/{id}", customer.getId()))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.code").value("CUSTOMER_NOT_FOUND"));
    }

    private void createCustomer(String firstName, String lastName) {
        customerRepository.save(
                new com.srki.backend.entity.Customer(
                        firstName,
                        lastName,
                        firstName.toLowerCase() + "@example.com",
                        "6900000000"));
    }
}