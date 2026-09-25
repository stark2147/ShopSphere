package com.shopsphere.backend.service;
import com.shopsphere.backend.dto.CartResponse;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;
import com.shopsphere.backend.entity.Cart;
import com.shopsphere.backend.dto.CartItemResponse;
import com.shopsphere.backend.entity.CartItem;
import com.shopsphere.backend.entity.Product;
import com.shopsphere.backend.entity.User;
import com.shopsphere.backend.exception.ResourceNotFoundException;
import com.shopsphere.backend.repository.CartItemRepository;
import com.shopsphere.backend.repository.CartRepository;
import com.shopsphere.backend.repository.ProductRepository;
import com.shopsphere.backend.repository.UserRepository;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class CartService {

    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    public CartService(
            CartRepository cartRepository,
            CartItemRepository cartItemRepository,
            ProductRepository productRepository,
            UserRepository userRepository) {

        this.cartRepository = cartRepository;
        this.cartItemRepository = cartItemRepository;
        this.productRepository = productRepository;
        this.userRepository = userRepository;
    }
    @Transactional
    public CartItemResponse updateCartItem(
            Long itemId,
            Integer quantity) {

        if (quantity == null || quantity <= 0) {
            throw new IllegalArgumentException(
                    "Quantity must be greater than 0");
        }

        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        String email = authentication.getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "User not found with email: " + email));

        Cart cart = cartRepository.findByUserId(user.getId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Cart not found"));

        CartItem cartItem = cartItemRepository.findById(itemId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Cart item not found with id: " + itemId));

        if (!cartItem.getCart().getId().equals(cart.getId())) {
            throw new org.springframework.security.access.AccessDeniedException(
                    "You cannot modify this cart item");
        }

        Product product = cartItem.getProduct();

        if (product.getStockQuantity() == null ||
                quantity > product.getStockQuantity()) {

            throw new IllegalArgumentException(
                    "Requested quantity exceeds available stock");
        }

        cartItem.setQuantity(quantity);

        CartItem savedCartItem =
                cartItemRepository.save(cartItem);

        return new CartItemResponse(
                savedCartItem.getId(),
                savedCartItem.getProduct().getId(),
                savedCartItem.getProduct().getName(),
                savedCartItem.getProduct().getPrice(),
                savedCartItem.getQuantity()
        );
    }

    @Transactional
    public void removeCartItem(Long itemId) {

        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        String email = authentication.getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "User not found with email: " + email));

        Cart cart = cartRepository.findByUserId(user.getId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Cart not found"));

        CartItem cartItem = cartItemRepository.findById(itemId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Cart item not found with id: " + itemId));

        if (!cartItem.getCart().getId().equals(cart.getId())) {
            throw new org.springframework.security.access.AccessDeniedException(
                    "You cannot delete this cart item");
        }

        cartItemRepository.delete(cartItem);
    }


    @Transactional
    public CartItemResponse addToCart(Long productId, Integer quantity) {

        // 1. Validate quantity
        if (quantity == null || quantity <= 0) {
            throw new IllegalArgumentException(
                    "Quantity must be greater than 0"
            );
        }

        // 2. Get currently logged-in user
        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        String email = authentication.getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "User not found with email: " + email
                ));

        // 3. Find the product
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Product not found with id: " + productId
                ));

        // 4. Check stock
        if (product.getStockQuantity() == null ||
                product.getStockQuantity() <= 0) {

            throw new IllegalArgumentException(
                    "Product is out of stock"
            );
        }

        // 5. Find or create customer's cart
        Cart cart = cartRepository.findByUserId(user.getId())
                .orElseGet(() -> {

                    Cart newCart = new Cart();
                    newCart.setUser(user);

                    return cartRepository.save(newCart);
                });

        // 6. Check whether product already exists in cart
        CartItem cartItem =
                cartItemRepository
                        .findByCartIdAndProductId(
                                cart.getId(),
                                productId
                        )
                        .orElse(null);

        if (cartItem != null) {

            // Product already exists → increase quantity

            int newQuantity =
                    cartItem.getQuantity() + quantity;

            if (newQuantity > product.getStockQuantity()) {
                throw new IllegalArgumentException(
                        "Requested quantity exceeds available stock"
                );
            }

            cartItem.setQuantity(newQuantity);

        } else {

            // Product doesn't exist → create new cart item

            if (quantity > product.getStockQuantity()) {
                throw new IllegalArgumentException(
                        "Requested quantity exceeds available stock"
                );
            }

            cartItem = new CartItem();

            cartItem.setCart(cart);
            cartItem.setProduct(product);
            cartItem.setQuantity(quantity);
        }

        CartItem savedCartItem = cartItemRepository.save(cartItem);

        return new CartItemResponse(
                savedCartItem.getId(),
                savedCartItem.getProduct().getId(),
                savedCartItem.getProduct().getName(),
                savedCartItem.getProduct().getPrice(),
                savedCartItem.getQuantity()
        );
    }
    @Transactional
    public void clearCart() {

        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        String email = authentication.getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "User not found with email: " + email));

        Cart cart = cartRepository.findByUserId(user.getId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Cart not found"));

        List<CartItem> cartItems =
                cartItemRepository.findByCartId(cart.getId());

        cartItemRepository.deleteAll(cartItems);
    }
    @Transactional(readOnly = true)
    public CartResponse getCart() {

        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        String email = authentication.getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "User not found with email: " + email));

        Cart cart = cartRepository.findByUserId(user.getId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Cart not found"));

        List<CartItem> cartItems =
                cartItemRepository.findByCartId(cart.getId());

        List<CartItemResponse> itemResponses =
                cartItems.stream()
                        .map(item -> new CartItemResponse(
                                item.getId(),
                                item.getProduct().getId(),
                                item.getProduct().getName(),
                                item.getProduct().getPrice(),
                                item.getQuantity()
                        ))
                        .collect(Collectors.toList());

        BigDecimal totalAmount =
                cartItems.stream()
                        .map(item ->
                                item.getProduct()
                                        .getPrice()
                                        .multiply(
                                                BigDecimal.valueOf(
                                                        item.getQuantity()
                                                )
                                        )
                        )
                        .reduce(
                                BigDecimal.ZERO,
                                BigDecimal::add
                        );

        return new CartResponse(
                itemResponses,
                totalAmount
        );
    }
}