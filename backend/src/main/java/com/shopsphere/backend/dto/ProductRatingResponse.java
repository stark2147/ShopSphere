package com.shopsphere.backend.dto;

public class ProductRatingResponse {

    private Long productId;
    private Double averageRating;
    private Long totalReviews;

    public ProductRatingResponse() {
    }

    public ProductRatingResponse(
            Long productId,
            Double averageRating,
            Long totalReviews
    ) {
        this.productId = productId;
        this.averageRating = averageRating;
        this.totalReviews = totalReviews;
    }

    public Long getProductId() {
        return productId;
    }

    public void setProductId(Long productId) {
        this.productId = productId;
    }

    public Double getAverageRating() {
        return averageRating;
    }

    public void setAverageRating(Double averageRating) {
        this.averageRating = averageRating;
    }

    public Long getTotalReviews() {
        return totalReviews;
    }

    public void setTotalReviews(Long totalReviews) {
        this.totalReviews = totalReviews;
    }
}