package com.shopsphere.backend.entity;

import jakarta.persistence.*;

import java.math.BigDecimal;

@Entity
@Table(name = "order_items")
public class OrderItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "order_id", nullable = false)
    private Order order;

    @ManyToOne
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    private Integer quantity;

    private BigDecimal price;

    // New relationship:
    // Each OrderItem can belong to one SellerOrder.
    @ManyToOne
    @JoinColumn(name = "seller_order_id")
    private SellerOrder sellerOrder;


    public OrderItem() {
    }


    public OrderItem(
            Long id,
            Order order,
            Product product,
            Integer quantity,
            BigDecimal price) {

        this.id = id;
        this.order = order;
        this.product = product;
        this.quantity = quantity;
        this.price = price;
    }


    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }


    public Order getOrder() {
        return order;
    }

    public void setOrder(Order order) {
        this.order = order;
    }


    public Product getProduct() {
        return product;
    }

    public void setProduct(Product product) {
        this.product = product;
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


    public SellerOrder getSellerOrder() {
        return sellerOrder;
    }

    public void setSellerOrder(SellerOrder sellerOrder) {
        this.sellerOrder = sellerOrder;
    }
}