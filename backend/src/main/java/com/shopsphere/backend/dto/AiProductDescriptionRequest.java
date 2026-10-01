package com.shopsphere.backend.dto;

import jakarta.validation.constraints.NotBlank;

public class AiProductDescriptionRequest {

    @NotBlank(message = "Product name cannot be empty")
    private String productName;

    @NotBlank(message = "Category cannot be empty")
    private String category;

    @NotBlank(message = "Key points cannot be empty")
    private String keyPoints;

    public AiProductDescriptionRequest() {
    }

    public AiProductDescriptionRequest(
            String productName,
            String category,
            String keyPoints) {

        this.productName = productName;
        this.category = category;
        this.keyPoints = keyPoints;
    }

    public String getProductName() {
        return productName;
    }

    public void setProductName(String productName) {
        this.productName = productName;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getKeyPoints() {
        return keyPoints;
    }

    public void setKeyPoints(String keyPoints) {
        this.keyPoints = keyPoints;
    }
}