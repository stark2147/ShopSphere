package com.shopsphere.backend.dto;

import java.math.BigDecimal;

public class CreatePaymentResponse {

    private Long orderId;
    private String razorpayOrderId;
    private BigDecimal amount;
    private String currency;
    private String keyId;

    public CreatePaymentResponse() {
    }

    public CreatePaymentResponse(Long orderId,
                                 String razorpayOrderId,
                                 BigDecimal amount,
                                 String currency,
                                 String keyId) {
        this.orderId = orderId;
        this.razorpayOrderId = razorpayOrderId;
        this.amount = amount;
        this.currency = currency;
        this.keyId = keyId;
    }

    public Long getOrderId() {
        return orderId;
    }

    public void setOrderId(Long orderId) {
        this.orderId = orderId;
    }

    public String getRazorpayOrderId() {
        return razorpayOrderId;
    }

    public void setRazorpayOrderId(String razorpayOrderId) {
        this.razorpayOrderId = razorpayOrderId;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }

    public String getCurrency() {
        return currency;
    }

    public void setCurrency(String currency) {
        this.currency = currency;
    }

    public String getKeyId() {
        return keyId;
    }

    public void setKeyId(String keyId) {
        this.keyId = keyId;
    }
}