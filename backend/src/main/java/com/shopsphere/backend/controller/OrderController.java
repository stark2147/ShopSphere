package com.shopsphere.backend.controller;

import com.shopsphere.backend.dto.OrderResponse;
import com.shopsphere.backend.dto.SellerOrderResponse;
import com.shopsphere.backend.service.OrderService;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    // ============================================================
    // CUSTOMER - PLACE ORDER
    // ============================================================

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public OrderResponse placeOrder(
            @RequestParam Long addressId) {

        return orderService.placeOrder(addressId);
    }

    // ============================================================
    // CUSTOMER - CANCEL ORDER
    // ============================================================

    @PutMapping("/{orderId}/cancel")
    public OrderResponse cancelOrder(
            @PathVariable Long orderId) {

        return orderService.cancelOrder(orderId);
    }

    // ============================================================
    // CUSTOMER - GET MY ORDERS
    // ============================================================

    @GetMapping("/my-orders")
    public List<OrderResponse> getMyOrders() {

        return orderService.getMyOrders();
    }

    // ============================================================
    // CUSTOMER - GET ORDER BY ID
    // ============================================================

    @GetMapping("/{orderId:\\d+}")
    public OrderResponse getOrderById(
            @PathVariable Long orderId) {

        return orderService.getOrderById(orderId);
    }

    // ============================================================
    // SELLER - GET MY SELLER ORDERS
    // ============================================================

    @GetMapping("/seller-orders")
    public List<SellerOrderResponse> getSellerOrders() {

        return orderService.getSellerOrders();
    }
}