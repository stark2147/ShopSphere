package com.shopsphere.backend.dto;

public class SellerResponse {

    private Long id;
    private String name;
    private String email;
    private String storeName;
    private String description;
    private String storeImageUrl;
    private boolean approved;
    private Long userId;

    public SellerResponse() {
    }

    public SellerResponse(Long id,
                          String name,
                          String email,
                          String storeName,
                          String description,
                          String storeImageUrl,
                          boolean approved,
                          Long userId) {

        this.id = id;
        this.name = name;
        this.email = email;
        this.storeName = storeName;
        this.description = description;
        this.storeImageUrl = storeImageUrl;
        this.approved = approved;
        this.userId = userId;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getStoreName() {
        return storeName;
    }

    public void setStoreName(String storeName) {
        this.storeName = storeName;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getStoreImageUrl() {
        return storeImageUrl;
    }

    public void setStoreImageUrl(String storeImageUrl) {
        this.storeImageUrl = storeImageUrl;
    }

    public boolean isApproved() {
        return approved;
    }

    public void setApproved(boolean approved) {
        this.approved = approved;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }
}