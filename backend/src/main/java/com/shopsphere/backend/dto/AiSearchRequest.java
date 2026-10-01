package com.shopsphere.backend.dto;

import jakarta.validation.constraints.NotBlank;

public class AiSearchRequest {

    @NotBlank(message = "Search query cannot be empty")
    private String query;

    public AiSearchRequest() {
    }

    public AiSearchRequest(String query) {
        this.query = query;
    }

    public String getQuery() {
        return query;
    }

    public void setQuery(String query) {
        this.query = query;
    }
}