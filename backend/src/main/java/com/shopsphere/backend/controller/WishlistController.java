package com.shopsphere.backend.controller;

import com.shopsphere.backend.dto.WishlistResponse;
import com.shopsphere.backend.service.WishlistService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/wishlist")
public class WishlistController {

    private final WishlistService wishlistService;

    public WishlistController(WishlistService wishlistService) {
        this.wishlistService = wishlistService;
    }

    @PostMapping("/{productId}")
    @ResponseStatus(HttpStatus.CREATED)
    public WishlistResponse addToWishlist(
            @PathVariable Long productId
    ) {
        return wishlistService.addToWishlist(productId);
    }

    @GetMapping
    public WishlistResponse getWishlist() {
        return wishlistService.getWishlist();
    }

    @DeleteMapping("/{productId}")
    public WishlistResponse removeFromWishlist(
            @PathVariable Long productId
    ) {
        return wishlistService.removeFromWishlist(productId);
    }
}