package com.shopsphere.backend.repository;

import com.shopsphere.backend.entity.SellerOrder;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SellerOrderRepository
        extends JpaRepository<SellerOrder, Long> {

    List<SellerOrder> findBySellerId(Long sellerId);

    List<SellerOrder> findByOrderId(Long orderId);

    List<SellerOrder> findBySellerIdAndStatus(
            Long sellerId,
            com.shopsphere.backend.entity.OrderStatus status
    );
}