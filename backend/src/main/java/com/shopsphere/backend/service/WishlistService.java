package com.shopsphere.backend.service;

import com.shopsphere.backend.dto.WishlistItemResponse;
import com.shopsphere.backend.dto.WishlistResponse;
import com.shopsphere.backend.entity.Product;
import com.shopsphere.backend.entity.User;
import com.shopsphere.backend.entity.Wishlist;
import com.shopsphere.backend.entity.WishlistItem;
import com.shopsphere.backend.repository.ProductRepository;
import com.shopsphere.backend.repository.UserRepository;
import com.shopsphere.backend.repository.WishlistItemRepository;
import com.shopsphere.backend.repository.WishlistRepository;
import com.shopsphere.backend.exception.ResourceNotFoundException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class WishlistService {

    private final WishlistRepository wishlistRepository;
    private final WishlistItemRepository wishlistItemRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    public WishlistService(
            WishlistRepository wishlistRepository,
            WishlistItemRepository wishlistItemRepository,
            ProductRepository productRepository,
            UserRepository userRepository
    ) {
        this.wishlistRepository = wishlistRepository;
        this.wishlistItemRepository = wishlistItemRepository;
        this.productRepository = productRepository;
        this.userRepository = userRepository;
    }

    private User getAuthenticatedUser() {

        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        String email = authentication.getName();

        return userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new ResourceNotFoundException("User not found"));
    }

    private Wishlist getOrCreateWishlist(User user) {

        return wishlistRepository.findByUserId(user.getId())
                .orElseGet(() -> {

                    Wishlist wishlist = new Wishlist();
                    wishlist.setUser(user);

                    return wishlistRepository.save(wishlist);
                });
    }

    @Transactional
    public WishlistResponse addToWishlist(Long productId) {

        User user = getAuthenticatedUser();

        Wishlist wishlist = getOrCreateWishlist(user);

        Product product = productRepository.findById(productId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Product not found with id: " + productId
                        ));

        if (wishlistItemRepository
                .findByWishlistIdAndProductId(
                        wishlist.getId(),
                        productId
                )
                .isPresent()) {

            throw new IllegalArgumentException(
                    "Product is already in your wishlist"
            );
        }

        WishlistItem item = new WishlistItem();
        item.setWishlist(wishlist);
        item.setProduct(product);

        wishlistItemRepository.save(item);

        return getWishlist();
    }

    @Transactional
    public WishlistResponse getWishlist() {

        User user = getAuthenticatedUser();

        Wishlist wishlist = getOrCreateWishlist(user);

        List<WishlistItemResponse> items =
                wishlistItemRepository
                        .findByWishlistId(wishlist.getId())
                        .stream()
                        .map(this::convertToResponse)
                        .toList();

        return new WishlistResponse(
                wishlist.getId(),
                items
        );
    }

    @Transactional
    public WishlistResponse removeFromWishlist(Long productId) {

        User user = getAuthenticatedUser();

        Wishlist wishlist = wishlistRepository.findByUserId(user.getId())
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Wishlist not found"
                        ));

        WishlistItem item =
                wishlistItemRepository
                        .findByWishlistIdAndProductId(
                                wishlist.getId(),
                                productId
                        )
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Product is not in your wishlist"
                                ));

        wishlistItemRepository.delete(item);

        return getWishlist();
    }

    private WishlistItemResponse convertToResponse(
            WishlistItem item
    ) {

        Product product = item.getProduct();

        String categoryName = null;
        String storeName = null;

        if (product.getCategory() != null) {
            categoryName = product.getCategory().getName();
        }

        if (product.getSeller() != null) {
            storeName = product.getSeller().getStoreName();
        }

        return new WishlistItemResponse(
                item.getId(),
                product.getId(),
                product.getName(),
                product.getDescription(),
                product.getPrice(),
                product.getStockQuantity(),
                categoryName,
                storeName
        );
    }
}