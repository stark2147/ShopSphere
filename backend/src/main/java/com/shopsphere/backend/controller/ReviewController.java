package com.shopsphere.backend.controller;

import com.shopsphere.backend.dto.ProductRatingResponse;
import com.shopsphere.backend.dto.ReviewRequest;
import com.shopsphere.backend.dto.ReviewResponse;
import com.shopsphere.backend.service.ReviewService;

import jakarta.validation.Valid;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reviews")
public class ReviewController {

    private final ReviewService reviewService;

    public ReviewController(ReviewService reviewService) {
        this.reviewService = reviewService;
    }

    // =========================================================
    // CREATE REVIEW
    // =========================================================

    @PostMapping
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<ReviewResponse> createReview(
            @Valid @RequestBody ReviewRequest request
    ) {

        ReviewResponse response =
                reviewService.createReview(request);

        return ResponseEntity.ok(response);
    }

    // =========================================================
    // GET REVIEWS FOR PRODUCT
    // =========================================================

    @GetMapping("/product/{productId}")
    public ResponseEntity<List<ReviewResponse>> getReviewsByProduct(
            @PathVariable Long productId
    ) {

        return ResponseEntity.ok(
                reviewService.getReviewsByProduct(productId)
        );
    }
    @GetMapping("/seller")
    @PreAuthorize("hasRole('SELLER')")
    public ResponseEntity<List<ReviewResponse>> getSellerReviews() {

        return ResponseEntity.ok(
                reviewService.getReviewsForSeller()
        );
    }
    @GetMapping("/product/{productId}/rating")
    public ResponseEntity<ProductRatingResponse> getProductRating(
            @PathVariable Long productId
    ) {

        return ResponseEntity.ok(
                reviewService.getProductRating(productId)
        );
    }

    // =========================================================
    // GET MY REVIEW FOR PRODUCT
    // =========================================================

    @GetMapping("/product/{productId}/my")
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<ReviewResponse> getMyReviewForProduct(
            @PathVariable Long productId
    ) {

        return ResponseEntity.ok(
                reviewService.getMyReviewForProduct(productId)
        );
    }

    // =========================================================
    // UPDATE REVIEW
    // =========================================================

    @PutMapping("/{reviewId}")
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<ReviewResponse> updateReview(
            @PathVariable Long reviewId,
            @Valid @RequestBody ReviewRequest request
    ) {

        return ResponseEntity.ok(
                reviewService.updateReview(
                        reviewId,
                        request
                )
        );
    }

    // =========================================================
    // DELETE REVIEW
    // =========================================================

    @DeleteMapping("/{reviewId}")
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<Void> deleteReview(
            @PathVariable Long reviewId
    ) {

        reviewService.deleteReview(reviewId);

        return ResponseEntity.noContent().build();
    }
}