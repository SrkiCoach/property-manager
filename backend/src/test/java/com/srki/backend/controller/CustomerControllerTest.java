package com.srki.backend.controller;

import static org.hamcrest.Matchers.containsString;
import static org.hamcrest.Matchers.hasSize;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import com.srki.backend.customer.Customer;
import com.srki.backend.customer.CustomerRepository;
import com.srki.backend.customer.dto.CreateCustomerRequest;
import com.srki.backend.customer.dto.UpdateCustomerRequest;

import tools.jackson.databind.ObjectMapper;

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
                                new Customer(
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
                                new Customer(
                                                firstName,
                                                lastName,
                                                firstName.toLowerCase() + "@example.com",
                                                "6900000000"));
        }

        @Test
        void shouldUpdateCustomer() throws Exception {
                Customer customer = customerRepository.save(
                                new Customer(
                                                "Nikos",
                                                "Papadopoulos",
                                                "nikos@example.com",
                                                "6900000001"));

                UpdateCustomerRequest request = new UpdateCustomerRequest(
                                "Nikos",
                                "Papadopoulos Updated",
                                "nikos.updated@example.com",
                                "6911111111");

                mockMvc.perform(put("/api/customers/{id}", customer.getId())
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(request)))
                                .andExpect(status().isOk())
                                .andExpect(jsonPath("$.id").value(customer.getId()))
                                .andExpect(jsonPath("$.firstName").value("Nikos"))
                                .andExpect(jsonPath("$.lastName").value("Papadopoulos Updated"))
                                .andExpect(jsonPath("$.email").value("nikos.updated@example.com"))
                                .andExpect(jsonPath("$.phone").value("6911111111"));
        }

        @Test
        void shouldReturnNotFoundWhenUpdatingUnknownCustomer() throws Exception {
                UpdateCustomerRequest request = new UpdateCustomerRequest(
                                "Test",
                                "Customer",
                                "test@example.com",
                                "6900000000");

                mockMvc.perform(put("/api/customers/{id}", 999999L)
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(request)))
                                .andExpect(status().isNotFound())
                                .andExpect(jsonPath("$.code").value("CUSTOMER_NOT_FOUND"))
                                .andExpect(jsonPath("$.message", containsString("999999")));
        }

        @Test
        void shouldSearchCustomersByNameEmailOrPhone() throws Exception {
                customerRepository.save(
                                new Customer(
                                                "Maria",
                                                "Ioannou",
                                                "maria@example.com",
                                                "6912345678"));

                customerRepository.save(
                                new Customer(
                                                "Nikos",
                                                "Papadopoulos",
                                                "nikos@example.com",
                                                "6999999999"));

                mockMvc.perform(get("/api/customers/paged")
                                .param("page", "0")
                                .param("size", "5")
                                .param("sort", "lastName")
                                .param("direction", "asc")
                                .param("search", "691234"))
                                .andExpect(status().isOk())
                                .andExpect(jsonPath("$.items", hasSize(1)))
                                .andExpect(jsonPath("$.items[0].firstName").value("Maria"))
                                .andExpect(jsonPath("$.totalItems").value(1));
        }

        @Test
        void shouldSortCustomersByLastNameDescending() throws Exception {
                createCustomer("Nikos", "Alpha");
                createCustomer("Maria", "Omega");
                createCustomer("Giorgos", "Beta");

                mockMvc.perform(get("/api/customers/paged")
                                .param("page", "0")
                                .param("size", "5")
                                .param("sort", "lastName")
                                .param("direction", "desc"))
                                .andExpect(status().isOk())
                                .andExpect(jsonPath("$.items[0].lastName").value("Omega"))
                                .andExpect(jsonPath("$.items[1].lastName").value("Beta"))
                                .andExpect(jsonPath("$.items[2].lastName").value("Alpha"));
        }

        @Test
        void shouldNormalizeInvalidPagingAndSortingParameters() throws Exception {
                createCustomer("Nikos", "Papadopoulos");

                mockMvc.perform(get("/api/customers/paged")
                                .param("page", "-10")
                                .param("size", "-1")
                                .param("sort", "unknown")
                                .param("direction", "invalid"))
                                .andExpect(status().isOk())
                                .andExpect(jsonPath("$.page").value(0))
                                .andExpect(jsonPath("$.size").value(5))
                                .andExpect(jsonPath("$.items", hasSize(1)));
        }

        @Test
        void shouldLimitMaximumPageSize() throws Exception {
                createCustomer("Nikos", "Papadopoulos");

                mockMvc.perform(get("/api/customers/paged")
                                .param("page", "0")
                                .param("size", "10000")
                                .param("sort", "lastName")
                                .param("direction", "asc"))
                                .andExpect(status().isOk())
                                .andExpect(jsonPath("$.size").value(100));
        }

}
