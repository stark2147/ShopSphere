package com.shopsphere.backend.dto;

import com.shopsphere.backend.entity.OrderStatus;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class AdminOrderResponse {

    private Long orderId;

    private Long customerId;
    private String customerName;
    private String customerEmail;

    private BigDecimal totalAmount;

    private OrderStatus status;

    private LocalDateTime createdAt;

    public AdminOrderResponse() {
    }

    public AdminOrderResponse(
            Long orderId,
            Long customerId,
            String customerName,
            String customerEmail,
            BigDecimal totalAmount,
            OrderStatus status,
            LocalDateTime createdAt) {

        this.orderId = orderId;
        this.customerId = customerId;
        this.customerName = customerName;
        this.customerEmail = customerEmail;
        this.totalAmount = totalAmount;
        this.status = status;
        this.createdAt = createdAt;
    }

    public Long getOrderId() {
        return orderId;
    }

    public void setOrderId(Long orderId) {
        this.orderId = orderId;
    }

    public Long getCustomerId() {
        return customerId;
    }

    public void setCustomerId(Long customerId) {
        this.customerId = customerId;
    }

    public String getCustomerName() {
        return customerName;
    }

    public void setCustomerName(String customerName) {
        this.customerName = customerName;
    }

    public String getCustomerEmail() {
        return customerEmail;
    }

    public void setCustomerEmail(String customerEmail) {
        this.customerEmail = customerEmail;
    }

    public BigDecimal getTotalAmount() {
        return totalAmount;
    }

    public void setTotalAmount(BigDecimal totalAmount) {
        this.totalAmount = totalAmount;
    }

    public OrderStatus getStatus() {
        return status;
    }

    public void setStatus(OrderStatus status) {
        this.status = status;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}