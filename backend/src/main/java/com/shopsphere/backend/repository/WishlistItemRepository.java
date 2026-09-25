package com.shopsphere.backend.repository;

import com.shopsphere.backend.entity.WishlistItem;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface WishlistItemRepository extends JpaRepository<WishlistItem, Long> {

    List<WishlistItem> findByWishlistId(Long wishlistId);

    Optional<WishlistItem> findByWishlistIdAndProductId(
            Long wishlistId,
            Long productId
    );
}