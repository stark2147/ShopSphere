package com.shopsphere.backend.controller;

import com.shopsphere.backend.dto.SellerAnalyticsResponse;
import com.shopsphere.backend.service.SellerAnalyticsService;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/sellers")
public class SellerAnalyticsController {

    private final SellerAnalyticsService sellerAnalyticsService;


    public SellerAnalyticsController(
            SellerAnalyticsService sellerAnalyticsService) {

        this.sellerAnalyticsService =
                sellerAnalyticsService;
    }


    // =========================================================
    // SELLER ANALYTICS
    // =========================================================

    @GetMapping("/analytics")
    public SellerAnalyticsResponse getAnalytics() {

        return sellerAnalyticsService.getAnalytics();
    }
}