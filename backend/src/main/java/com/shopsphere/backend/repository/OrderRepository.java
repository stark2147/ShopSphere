package com.shopsphere.backend.repository;

import com.shopsphere.backend.entity.Order;
import com.shopsphere.backend.entity.OrderStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface OrderRepository
        extends JpaRepository<Order, Long> {

    List<Order> findByUserId(Long userId);

    List<Order> findByUserIdAndStatus(
            Long userId,
            OrderStatus status
    );
}