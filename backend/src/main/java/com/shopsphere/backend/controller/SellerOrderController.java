package com.shopsphere.backend.controller;

import com.shopsphere.backend.dto.SellerOrderResponse;
import com.shopsphere.backend.dto.UpdateOrderStatusRequest;
import com.shopsphere.backend.service.OrderService;

import jakarta.validation.Valid;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/seller-orders")
public class SellerOrderController {

    private final OrderService orderService;

    public SellerOrderController(
            OrderService orderService) {
        this.orderService = orderService;
    }

    // ============================================================
    // SELLER - UPDATE ORDER STATUS
    // ============================================================

    @PutMapping("/{sellerOrderId}/status")
    public SellerOrderResponse updateOrderStatus(
            @PathVariable Long sellerOrderId,
            @Valid @RequestBody UpdateOrderStatusRequest request) {

        return orderService.updateSellerOrderStatus(
                sellerOrderId,
                request.getStatus()
        );
    }
}