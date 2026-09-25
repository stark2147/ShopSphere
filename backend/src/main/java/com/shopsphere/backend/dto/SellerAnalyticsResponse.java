package com.shopsphere.backend.dto;

import java.math.BigDecimal;

public class SellerAnalyticsResponse {

    private long totalProducts;

    private long totalOrders;

    private BigDecimal totalRevenue;

    private long totalItemsSold;

    private long pendingOrders;

    private long completedOrders;


    public SellerAnalyticsResponse() {
    }


    public SellerAnalyticsResponse(
            long totalProducts,
            long totalOrders,
            BigDecimal totalRevenue,
            long totalItemsSold,
            long pendingOrders,
            long completedOrders) {

        this.totalProducts = totalProducts;
        this.totalOrders = totalOrders;
        this.totalRevenue = totalRevenue;
        this.totalItemsSold = totalItemsSold;
        this.pendingOrders = pendingOrders;
        this.completedOrders = completedOrders;
    }


    public long getTotalProducts() {
        return totalProducts;
    }

    public void setTotalProducts(long totalProducts) {
        this.totalProducts = totalProducts;
    }


    public long getTotalOrders() {
        return totalOrders;
    }

    public void setTotalOrders(long totalOrders) {
        this.totalOrders = totalOrders;
    }


    public BigDecimal getTotalRevenue() {
        return totalRevenue;
    }

    public void setTotalRevenue(BigDecimal totalRevenue) {
        this.totalRevenue = totalRevenue;
    }


    public long getTotalItemsSold() {
        return totalItemsSold;
    }

    public void setTotalItemsSold(long totalItemsSold) {
        this.totalItemsSold = totalItemsSold;
    }


    public long getPendingOrders() {
        return pendingOrders;
    }

    public void setPendingOrders(long pendingOrders) {
        this.pendingOrders = pendingOrders;
    }


    public long getCompletedOrders() {
        return completedOrders;
    }

    public void setCompletedOrders(long completedOrders) {
        this.completedOrders = completedOrders;
    }
}