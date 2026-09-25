package com.shopsphere.backend.service;

import com.shopsphere.backend.dto.SellerAnalyticsResponse;
import com.shopsphere.backend.entity.Seller;
import com.shopsphere.backend.entity.User;
import com.shopsphere.backend.repository.ProductRepository;
import com.shopsphere.backend.repository.SellerAnalyticsRepository;
import com.shopsphere.backend.repository.SellerRepository;
import com.shopsphere.backend.repository.UserRepository;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;

@Service
public class SellerAnalyticsService {

    private final ProductRepository productRepository;
    private final SellerAnalyticsRepository sellerAnalyticsRepository;
    private final UserRepository userRepository;
    private final SellerRepository sellerRepository;


    public SellerAnalyticsService(
            ProductRepository productRepository,
            SellerAnalyticsRepository sellerAnalyticsRepository,
            UserRepository userRepository,
            SellerRepository sellerRepository) {

        this.productRepository = productRepository;
        this.sellerAnalyticsRepository = sellerAnalyticsRepository;
        this.userRepository = userRepository;
        this.sellerRepository = sellerRepository;
    }


    // =========================================================
    // GET LOGGED-IN SELLER
    // =========================================================

    private Seller getLoggedInSeller() {

        String email =
                SecurityContextHolder
                        .getContext()
                        .getAuthentication()
                        .getName();

        User user =
                userRepository
                        .findByEmail(email)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "User not found"
                                )
                        );

        return sellerRepository
                .findByUserId(user.getId())
                .orElseThrow(() ->
                        new RuntimeException(
                                "Seller profile not found"
                        )
                );
    }


    // =========================================================
    // SELLER ANALYTICS
    // =========================================================

    public SellerAnalyticsResponse getAnalytics() {

        Seller seller = getLoggedInSeller();

        Long sellerId = seller.getId();


        // Total products
        long totalProducts =
                productRepository
                        .findBySellerId(sellerId)
                        .size();


        // Total orders
        long totalOrders =
                sellerAnalyticsRepository
                        .countOrdersBySeller(sellerId);


        // Total revenue
        BigDecimal totalRevenue =
                sellerAnalyticsRepository
                        .calculateRevenueBySeller(sellerId);


        if (totalRevenue == null) {
            totalRevenue = BigDecimal.ZERO;
        }


        // Total items sold
        Long itemsSold =
                sellerAnalyticsRepository
                        .countItemsSoldBySeller(sellerId);

        long totalItemsSold =
                itemsSold == null
                        ? 0
                        : itemsSold;


        return new SellerAnalyticsResponse(
                totalProducts,
                totalOrders,
                totalRevenue,
                totalItemsSold,
                0,
                0
        );
    }
}