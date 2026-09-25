package com.shopsphere.backend.service;
import com.shopsphere.backend.entity.User;
import com.shopsphere.backend.dto.ReviewRequest;
import com.shopsphere.backend.dto.ReviewResponse;
import com.shopsphere.backend.entity.Order;
import com.shopsphere.backend.entity.OrderItem;
import com.shopsphere.backend.entity.OrderStatus;
import com.shopsphere.backend.entity.Product;
import com.shopsphere.backend.entity.Review;
import com.shopsphere.backend.entity.User;
import com.shopsphere.backend.entity.Seller;
import com.shopsphere.backend.entity.Seller;
import com.shopsphere.backend.repository.SellerRepository;
import com.shopsphere.backend.repository.SellerRepository;
import com.shopsphere.backend.repository.OrderItemRepository;
import com.shopsphere.backend.repository.OrderRepository;
import com.shopsphere.backend.repository.ProductRepository;
import com.shopsphere.backend.repository.ReviewRepository;
import com.shopsphere.backend.repository.UserRepository;
import com.shopsphere.backend.dto.ProductRatingResponse;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final SellerRepository sellerRepository;

    public ReviewService(
            ReviewRepository reviewRepository,
            UserRepository userRepository,
            ProductRepository productRepository,
            OrderRepository orderRepository,
            OrderItemRepository orderItemRepository,
            SellerRepository sellerRepository
    ) {
        this.reviewRepository = reviewRepository;
        this.userRepository = userRepository;
        this.productRepository = productRepository;
        this.orderRepository = orderRepository;
        this.orderItemRepository = orderItemRepository;
        this.sellerRepository = sellerRepository;

    }

    // =========================================================
    // CREATE REVIEW
    // =========================================================

    public ReviewResponse createReview(ReviewRequest request) {

        User user = getCurrentUser();

        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() ->
                        new RuntimeException("Product not found")
                );

        // Only customers can review
        if (user.getRole() == null ||
                !"CUSTOMER".equals(user.getRole().name())) {

            throw new RuntimeException(
                    "Only customers can submit reviews"
            );
        }

        // Prevent duplicate review
        if (reviewRepository.existsByUserIdAndProductId(
                user.getId(),
                product.getId()
        )) {

            throw new RuntimeException(
                    "You have already reviewed this product"
            );
        }

        // Customer must have purchased and received the product
        if (!hasPurchasedAndReceivedProduct(
                user.getId(),
                product.getId()
        )) {

            throw new RuntimeException(
                    "You can review a product only after it has been delivered"
            );
        }

        LocalDateTime now = LocalDateTime.now();

        Review review = new Review();

        review.setUser(user);
        review.setProduct(product);
        review.setRating(request.getRating());
        review.setComment(request.getComment().trim());
        review.setCreatedAt(now);
        review.setUpdatedAt(now);

        Review savedReview = reviewRepository.save(review);

        return convertToResponse(savedReview);
    }

    // =========================================================
    // GET REVIEWS FOR PRODUCT
    // =========================================================

    public List<ReviewResponse> getReviewsByProduct(Long productId) {

        // Make sure product exists
        productRepository.findById(productId)
                .orElseThrow(() ->
                        new RuntimeException("Product not found")
                );

        return reviewRepository.findByProductId(productId)
                .stream()
                .map(this::convertToResponse)
                .toList();
    }

    public List<ReviewResponse> getReviewsForSeller() {

        User user = getCurrentUser();

        Seller seller = sellerRepository.findByUserId(user.getId())
                .orElseThrow(() ->
                        new RuntimeException("Seller profile not found")
                );

        return reviewRepository
                .findByProductSellerId(seller.getId())
                .stream()
                .map(this::convertToResponse)
                .toList();
    }

    public ProductRatingResponse getProductRating(Long productId) {

        productRepository.findById(productId)
                .orElseThrow(() ->
                        new RuntimeException("Product not found")
                );

        Double averageRating =
                reviewRepository.findAverageRatingByProductId(productId);

        long totalReviews =
                reviewRepository.countByProductId(productId);

        if (averageRating == null) {
            averageRating = 0.0;
        }

        return new ProductRatingResponse(
                productId,
                Math.round(averageRating * 100.0) / 100.0,
                totalReviews
        );
    }

    // =========================================================
    // GET CURRENT USER'S REVIEW FOR PRODUCT
    // =========================================================

    public ReviewResponse getMyReviewForProduct(Long productId) {

        User user = getCurrentUser();

        Review review = reviewRepository
                .findByUserIdAndProductId(
                        user.getId(),
                        productId
                )
                .orElseThrow(() ->
                        new RuntimeException(
                                "You have not reviewed this product"
                        )
                );

        return convertToResponse(review);
    }

    // =========================================================
    // UPDATE REVIEW
    // =========================================================

    public ReviewResponse updateReview(
            Long reviewId,
            ReviewRequest request
    ) {

        User user = getCurrentUser();

        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() ->
                        new RuntimeException("Review not found")
                );

        // Only review owner can update
        if (!review.getUser().getId().equals(user.getId())) {

            throw new RuntimeException(
                    "You can update only your own review"
            );
        }

        // Product cannot be changed during update
        if (!review.getProduct().getId()
                .equals(request.getProductId())) {

            throw new RuntimeException(
                    "Product cannot be changed"
            );
        }

        review.setRating(request.getRating());
        review.setComment(request.getComment().trim());
        review.setUpdatedAt(LocalDateTime.now());

        Review updatedReview = reviewRepository.save(review);

        return convertToResponse(updatedReview);
    }

    // =========================================================
    // DELETE REVIEW
    // =========================================================

    public void deleteReview(Long reviewId) {

        User user = getCurrentUser();

        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() ->
                        new RuntimeException("Review not found")
                );

        // Only review owner can delete
        if (!review.getUser().getId().equals(user.getId())) {

            throw new RuntimeException(
                    "You can delete only your own review"
            );
        }

        reviewRepository.delete(review);
    }

    // =========================================================
    // PURCHASE + DELIVERY VERIFICATION
    // =========================================================

    private boolean hasPurchasedAndReceivedProduct(
            Long userId,
            Long productId
    ) {

        // Get all delivered orders belonging to this customer
        List<Order> deliveredOrders =
                orderRepository.findByUserIdAndStatus(
                        userId,
                        OrderStatus.DELIVERED
                );

        // Check whether any delivered order contains this product
        for (Order order : deliveredOrders) {

            List<OrderItem> orderItems =
                    orderItemRepository.findByOrderId(
                            order.getId()
                    );

            for (OrderItem item : orderItems) {

                if (item.getProduct() != null &&
                        item.getProduct().getId()
                                .equals(productId)) {

                    return true;
                }
            }
        }

        return false;
    }

    // =========================================================
    // GET CURRENT USER
    // =========================================================

    private User getCurrentUser() {

        Authentication authentication =
                SecurityContextHolder
                        .getContext()
                        .getAuthentication();

        if (authentication == null ||
                !authentication.isAuthenticated()) {

            throw new RuntimeException(
                    "User is not authenticated"
            );
        }

        String email = authentication.getName();

        return userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException(
                                "User not found"
                        )
                );
    }

    // =========================================================
    // CONVERT ENTITY → RESPONSE
    // =========================================================

    private ReviewResponse convertToResponse(
            Review review
    ) {

        return new ReviewResponse(
                review.getId(),

                review.getProduct().getId(),
                review.getProduct().getName(),

                review.getUser().getId(),
                review.getUser().getName(),

                review.getRating(),
                review.getComment(),

                review.getCreatedAt(),
                review.getUpdatedAt()
        );
    }
}