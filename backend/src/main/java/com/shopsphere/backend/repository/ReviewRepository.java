package com.shopsphere.backend.repository;

import com.shopsphere.backend.entity.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ReviewRepository extends JpaRepository<Review, Long> {

    List<Review> findByProductId(Long productId);
    List<Review> findByProductSellerId(Long sellerId);

    Optional<Review> findByUserIdAndProductId(
            Long userId,
            Long productId
    );

    boolean existsByUserIdAndProductId(
            Long userId,
            Long productId
    );

    long countByProductId(Long productId);

    @Query("""
            SELECT AVG(r.rating)
            FROM Review r
            WHERE r.product.id = :productId
            """)
    Double findAverageRatingByProductId(
            @Param("productId") Long productId
    );
}