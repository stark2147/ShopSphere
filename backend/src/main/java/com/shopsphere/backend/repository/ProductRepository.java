package com.shopsphere.backend.repository;

import com.shopsphere.backend.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ProductRepository extends JpaRepository<Product, Long> {

    List<Product> findBySellerId(Long sellerId);

    List<Product> findByNameContainingIgnoreCase(String keyword);

    @Query("""
            SELECT p
            FROM Product p
            WHERE
                (:keyword IS NULL OR
                 LOWER(p.name) LIKE LOWER(CONCAT('%', :keyword, '%')) OR
                 LOWER(p.description) LIKE LOWER(CONCAT('%', :keyword, '%')))
            AND
                (:minPrice IS NULL OR p.price >= :minPrice)
            AND
                (:maxPrice IS NULL OR p.price <= :maxPrice)
            AND
                (:category IS NULL OR
                 LOWER(p.category.name) LIKE LOWER(CONCAT('%', :category, '%')))
            """)
    List<Product> searchProducts(
            @Param("keyword") String keyword,
            @Param("minPrice") Double minPrice,
            @Param("maxPrice") Double maxPrice,
            @Param("category") String category
    );
}