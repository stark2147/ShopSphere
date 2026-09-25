package com.shopsphere.backend.controller;

import com.shopsphere.backend.dto.*;
import com.shopsphere.backend.service.AdminService;
import com.shopsphere.backend.service.AdminService.AdminDashboardResponse;
import org.springframework.web.bind.annotation.*;
import com.shopsphere.backend.service.SellerService;
import java.util.List;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final AdminService adminService;

    private final SellerService sellerService;

    public AdminController(
            AdminService adminService,
            SellerService sellerService) {

        this.adminService = adminService;
        this.sellerService = sellerService;
    }


    @GetMapping("/products")
    public List<AdminProductResponse> getAllProducts() {
        return adminService.getAllProducts();
    }

    @GetMapping("/dashboard")
    public AdminDashboardResponse getDashboard() {
        return adminService.getDashboardStats();
    }
    @GetMapping("/users")
    public List<AdminUserResponse> getAllUsers() {
        return adminService.getAllUsers();
    }
    @GetMapping("/sellers")
    public List<SellerResponse> getAllSellers() {
        return sellerService.getAllSellers();
    }
    @PutMapping("/sellers/{sellerId}/approve")
    public SellerResponse approveSeller(
            @PathVariable Long sellerId) {

        return sellerService.approveSeller(sellerId);
    }
    @GetMapping("/users/{userId}")
    public AdminUserResponse getUserById(
            @PathVariable Long userId) {

        return adminService.getUserById(userId);
    }
    @GetMapping("/orders")
    public List<AdminOrderResponse> getAllOrders() {
        return adminService.getAllOrders();
    }
    @GetMapping("/sellers/{sellerId}")
    public SellerResponse getSellerById(
            @PathVariable Long sellerId) {

        return adminService.getSellerById(sellerId);
    }
    @GetMapping("/orders/{orderId}")
    public AdminOrderDetailsResponse getOrderById(
            @PathVariable Long orderId) {

        return adminService.getOrderById(orderId);
    }
    @GetMapping("/reviews")
    public List<ReviewResponse> getAllReviews() {
        return adminService.getAllReviews();
    }

    @DeleteMapping("/reviews/{reviewId}")
    public void deleteReview(
            @PathVariable Long reviewId) {

        adminService.deleteReview(reviewId);
    }
}