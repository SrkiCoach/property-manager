package com.srki.backend.property.exception;

public class PropertyNotFoundException extends RuntimeException {

    private final Long propertyId;

    public PropertyNotFoundException(Long propertyId) {
        super("Property with id " + propertyId + " was not found");
        this.propertyId = propertyId;
    }

    public Long getPropertyId() {
        return propertyId;
    }
}
