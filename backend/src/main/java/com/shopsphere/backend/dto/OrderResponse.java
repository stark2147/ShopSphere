package com.shopsphere.backend.dto;

import com.shopsphere.backend.entity.OrderStatus;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public class OrderResponse {

    private Long id;
    private BigDecimal totalAmount;
    private OrderStatus status;
    private LocalDateTime createdAt;
    private List<OrderItemResponse> items;

    private OrderDeliveryAddressResponse deliveryAddress;


    public OrderResponse() {
    }


    public OrderResponse(
            Long id,
            BigDecimal totalAmount,
            OrderStatus status,
            LocalDateTime createdAt,
            List<OrderItemResponse> items,
            OrderDeliveryAddressResponse deliveryAddress) {

        this.id = id;
        this.totalAmount = totalAmount;
        this.status = status;
        this.createdAt = createdAt;
        this.items = items;
        this.deliveryAddress = deliveryAddress;
    }


    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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


    public List<OrderItemResponse> getItems() {
        return items;
    }

    public void setItems(List<OrderItemResponse> items) {
        this.items = items;
    }


    public OrderDeliveryAddressResponse getDeliveryAddress() {
        return deliveryAddress;
    }

    public void setDeliveryAddress(
            OrderDeliveryAddressResponse deliveryAddress) {

        this.deliveryAddress = deliveryAddress;
    }
}