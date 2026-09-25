package com.shopsphere.backend.repository;

import com.shopsphere.backend.entity.OrderItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.util.List;

public interface SellerAnalyticsRepository
        extends JpaRepository<OrderItem, Long> {

    // =========================================================
    // TOTAL ORDERS
    // =========================================================

    @Query("""
            SELECT COUNT(DISTINCT oi.order.id)
            FROM OrderItem oi
            WHERE oi.product.seller.id = :sellerId
            """)
    long countOrdersBySeller(
            @Param("sellerId") Long sellerId
    );


    // =========================================================
    // TOTAL REVENUE
    // =========================================================

    @Query("""
            SELECT COALESCE(
                SUM(oi.price * oi.quantity),
                0
            )
            FROM OrderItem oi
            WHERE oi.product.seller.id = :sellerId
            """)
    BigDecimal calculateRevenueBySeller(
            @Param("sellerId") Long sellerId
    );


    // =========================================================
    // TOTAL ITEMS SOLD
    // =========================================================

    @Query("""
            SELECT COALESCE(
                SUM(oi.quantity),
                0
            )
            FROM OrderItem oi
            WHERE oi.product.seller.id = :sellerId
            """)
    Long countItemsSoldBySeller(
            @Param("sellerId") Long sellerId
    );


    // =========================================================
    // SELLER ORDER ITEMS
    // =========================================================

    @Query("""
            SELECT oi
            FROM OrderItem oi
            WHERE oi.product.seller.id = :sellerId
            """)
    List<OrderItem> findItemsBySeller(
            @Param("sellerId") Long sellerId
    );
}