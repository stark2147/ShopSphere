package com.shopsphere.backend.controller;

import com.shopsphere.backend.service.AiReviewSummaryService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/ai/reviews")
public class AiReviewSummaryController {

    private final AiReviewSummaryService aiReviewSummaryService;

    public AiReviewSummaryController(
            AiReviewSummaryService aiReviewSummaryService
    ) {
        this.aiReviewSummaryService = aiReviewSummaryService;
    }

    // =========================================================
    // AI REVIEW SUMMARY
    // =========================================================

    @GetMapping("/product/{productId}/summary")
    public ResponseEntity<String> generateReviewSummary(
            @PathVariable Long productId
    ) {

        return ResponseEntity.ok(
                aiReviewSummaryService.generateSummary(productId)
        );
    }
}