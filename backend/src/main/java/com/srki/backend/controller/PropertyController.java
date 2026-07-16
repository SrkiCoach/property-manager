package com.srki.backend.controller;

import com.srki.backend.dto.CreatePropertyRequest;
import com.srki.backend.dto.PropertyResponse;
import com.srki.backend.service.PropertyService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import com.srki.backend.dto.PagedResponse;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

import com.srki.backend.dto.UpdatePropertyRequest;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.ResponseStatus;

@RestController
@RequestMapping("/api/properties")
public class PropertyController {

    private final PropertyService propertyService;

    public PropertyController(PropertyService propertyService) {
        this.propertyService = propertyService;
    }

    @PostMapping
    public PropertyResponse create(
            @Valid @RequestBody CreatePropertyRequest request) {
        return propertyService.create(request);
    }

    @GetMapping("/paged")
    public PagedResponse<PropertyResponse> findPaged(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size,
            @RequestParam(defaultValue = "title") String sort,
            @RequestParam(defaultValue = "asc") String direction,
            @RequestParam(defaultValue = "") String search) {
        return propertyService.findPaged(
                page,
                size,
                sort,
                direction,
                search);
    }

    @GetMapping("/{id}")
    public PropertyResponse findById(@PathVariable Long id) {
        return propertyService.findById(id);
    }

    @PutMapping("/{id}")
    public PropertyResponse update(
            @PathVariable Long id,
            @Valid @RequestBody UpdatePropertyRequest request) {
        return propertyService.update(id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        propertyService.delete(id);
    }
}