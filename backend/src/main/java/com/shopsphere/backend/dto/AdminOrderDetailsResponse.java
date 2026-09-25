package com.shopsphere.backend.dto;

import com.shopsphere.backend.entity.OrderStatus;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public class AdminOrderDetailsResponse {

    private Long orderId;

    private Long customerId;
    private String customerName;
    private String customerEmail;

    private BigDecimal totalAmount;

    private OrderStatus status;

    private LocalDateTime createdAt;

    private AdminDeliveryAddressResponse deliveryAddress;

    private List<AdminOrderItemResponse> items;

    public AdminOrderDetailsResponse() {
    }

    public AdminOrderDetailsResponse(
            Long orderId,
            Long customerId,
            String customerName,
            String customerEmail,
            BigDecimal totalAmount,
            OrderStatus status,
            LocalDateTime createdAt,
            AdminDeliveryAddressResponse deliveryAddress,
            List<AdminOrderItemResponse> items) {

        this.orderId = orderId;
        this.customerId = customerId;
        this.customerName = customerName;
        this.customerEmail = customerEmail;
        this.totalAmount = totalAmount;
        this.status = status;
        this.createdAt = createdAt;
        this.deliveryAddress = deliveryAddress;
        this.items = items;
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

    public AdminDeliveryAddressResponse getDeliveryAddress() {
        return deliveryAddress;
    }

    public void setDeliveryAddress(
            AdminDeliveryAddressResponse deliveryAddress) {
        this.deliveryAddress = deliveryAddress;
    }

    public List<AdminOrderItemResponse> getItems() {
        return items;
    }

    public void setItems(List<AdminOrderItemResponse> items) {
        this.items = items;
    }

    public static class AdminDeliveryAddressResponse {

        private String fullName;
        private String phoneNumber;
        private String addressLine1;
        private String addressLine2;
        private String landmark;
        private String city;
        private String state;
        private String pincode;
        private String country;
        private String addressType;

        public AdminDeliveryAddressResponse() {
        }

        public AdminDeliveryAddressResponse(
                String fullName,
                String phoneNumber,
                String addressLine1,
                String addressLine2,
                String landmark,
                String city,
                String state,
                String pincode,
                String country,
                String addressType) {

            this.fullName = fullName;
            this.phoneNumber = phoneNumber;
            this.addressLine1 = addressLine1;
            this.addressLine2 = addressLine2;
            this.landmark = landmark;
            this.city = city;
            this.state = state;
            this.pincode = pincode;
            this.country = country;
            this.addressType = addressType;
        }

        public String getFullName() {
            return fullName;
        }

        public void setFullName(String fullName) {
            this.fullName = fullName;
        }

        public String getPhoneNumber() {
            return phoneNumber;
        }

        public void setPhoneNumber(String phoneNumber) {
            this.phoneNumber = phoneNumber;
        }

        public String getAddressLine1() {
            return addressLine1;
        }

        public void setAddressLine1(String addressLine1) {
            this.addressLine1 = addressLine1;
        }

        public String getAddressLine2() {
            return addressLine2;
        }

        public void setAddressLine2(String addressLine2) {
            this.addressLine2 = addressLine2;
        }

        public String getLandmark() {
            return landmark;
        }

        public void setLandmark(String landmark) {
            this.landmark = landmark;
        }

        public String getCity() {
            return city;
        }

        public void setCity(String city) {
            this.city = city;
        }

        public String getState() {
            return state;
        }

        public void setState(String state) {
            this.state = state;
        }

        public String getPincode() {
            return pincode;
        }

        public void setPincode(String pincode) {
            this.pincode = pincode;
        }

        public String getCountry() {
            return country;
        }

        public void setCountry(String country) {
            this.country = country;
        }

        public String getAddressType() {
            return addressType;
        }

        public void setAddressType(String addressType) {
            this.addressType = addressType;
        }
    }

    public static class AdminOrderItemResponse {

        private Long productId;
        private String productName;

        private Integer quantity;

        private BigDecimal price;

        private Long sellerId;
        private String sellerName;
        private String storeName;

        public AdminOrderItemResponse() {
        }

        public AdminOrderItemResponse(
                Long productId,
                String productName,
                Integer quantity,
                BigDecimal price,
                Long sellerId,
                String sellerName,
                String storeName) {

            this.productId = productId;
            this.productName = productName;
            this.quantity = quantity;
            this.price = price;
            this.sellerId = sellerId;
            this.sellerName = sellerName;
            this.storeName = storeName;
        }

        public Long getProductId() {
            return productId;
        }

        public void setProductId(Long productId) {
            this.productId = productId;
        }

        public String getProductName() {
            return productName;
        }

        public void setProductName(String productName) {
            this.productName = productName;
        }

        public Integer getQuantity() {
            return quantity;
        }

        public void setQuantity(Integer quantity) {
            this.quantity = quantity;
        }

        public BigDecimal getPrice() {
            return price;
        }

        public void setPrice(BigDecimal price) {
            this.price = price;
        }

        public Long getSellerId() {
            return sellerId;
        }

        public void setSellerId(Long sellerId) {
            this.sellerId = sellerId;
        }

        public String getSellerName() {
            return sellerName;
        }

        public void setSellerName(String sellerName) {
            this.sellerName = sellerName;
        }

        public String getStoreName() {
            return storeName;
        }

        public void setStoreName(String storeName) {
            this.storeName = storeName;
        }
    }
}