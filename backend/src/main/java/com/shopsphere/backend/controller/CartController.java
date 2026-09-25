package com.shopsphere.backend.controller;

import com.shopsphere.backend.dto.AddToCartRequest;
import com.shopsphere.backend.dto.CartItemResponse;
import com.shopsphere.backend.dto.CartResponse;
import com.shopsphere.backend.dto.UpdateCartItemRequest;
import com.shopsphere.backend.service.CartService;
import com.shopsphere.backend.dto.CartResponse;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/cart")
public class CartController {

    private final CartService cartService;

    public CartController(CartService cartService) {
        this.cartService = cartService;
    }

    // Add product to cart
    @PostMapping("/items")
    @ResponseStatus(HttpStatus.CREATED)
    public CartItemResponse addToCart(
            @Valid @RequestBody AddToCartRequest request) {

        return cartService.addToCart(
                request.getProductId(),
                request.getQuantity()
        );
    }

    // View complete cart
    @GetMapping
    public CartResponse getCart() {
        return cartService.getCart();
    }

    @DeleteMapping
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void clearCart() {
        cartService.clearCart();
    }

    // Update cart item quantity
    @PutMapping("/items/{itemId}")
    public CartItemResponse updateCartItem(
            @PathVariable Long itemId,
            @Valid @RequestBody UpdateCartItemRequest request) {

        return cartService.updateCartItem(
                itemId,
                request.getQuantity()
        );
    }

    // Remove cart item
    @DeleteMapping("/items/{itemId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void removeCartItem(
            @PathVariable Long itemId) {

        cartService.removeCartItem(itemId);
    }
}