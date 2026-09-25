package com.shopsphere.backend.service;

import com.shopsphere.backend.dto.SellerResponse;
import com.shopsphere.backend.dto.AdminOrderDetailsResponse;
import com.shopsphere.backend.exception.ResourceNotFoundException;
import com.shopsphere.backend.dto.ReviewResponse;
import com.shopsphere.backend.entity.Review;
import com.shopsphere.backend.repository.ReviewRepository;
import java.util.List;
import com.shopsphere.backend.entity.Order;
import com.shopsphere.backend.entity.Product;
import com.shopsphere.backend.entity.Role;
import com.shopsphere.backend.entity.Seller;
import com.shopsphere.backend.entity.User;
import com.shopsphere.backend.dto.AdminUserResponse;
import com.shopsphere.backend.dto.AdminProductResponse;
import com.shopsphere.backend.entity.Category;
import java.util.List;
import com.shopsphere.backend.dto.AdminOrderResponse;
import java.util.stream.Collectors;

import com.shopsphere.backend.exception.ResourceNotFoundException;
import com.shopsphere.backend.repository.OrderRepository;
import com.shopsphere.backend.repository.ProductRepository;
import com.shopsphere.backend.repository.SellerRepository;
import com.shopsphere.backend.repository.UserRepository;

import org.springframework.stereotype.Service;

@Service
public class AdminService {

    private final UserRepository userRepository;
    private final SellerRepository sellerRepository;
    private final ProductRepository productRepository;
    private final OrderRepository orderRepository;
    private final ReviewRepository reviewRepository;

    public AdminService(
            UserRepository userRepository,
            SellerRepository sellerRepository,
            ProductRepository productRepository,
            OrderRepository orderRepository,
            ReviewRepository reviewRepository) {

        this.userRepository = userRepository;
        this.sellerRepository = sellerRepository;
        this.productRepository = productRepository;
        this.orderRepository = orderRepository;
        this.reviewRepository = reviewRepository;
    }

    public AdminDashboardResponse getDashboardStats() {

        long totalUsers =
                userRepository.countByRole(Role.CUSTOMER);

        long totalSellers =
                userRepository.countByRole(Role.SELLER);

        long totalProducts =
                productRepository.count();

        long totalOrders =
                orderRepository.count();

        return new AdminDashboardResponse(
                totalUsers,
                totalSellers,
                totalProducts,
                totalOrders
        );
    }
    public List<AdminUserResponse> getAllUsers() {

        return userRepository.findAll()
                .stream()
                .map(user -> new AdminUserResponse(
                        user.getId(),
                        user.getName(),
                        user.getEmail(),
                        user.getPhoneNumber(),
                        user.getRole()
                ))
                .collect(Collectors.toList());
    }
    public AdminUserResponse getUserById(Long userId) {

        User user = userRepository.findById(userId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "User not found with id: " + userId
                        ));

        return new AdminUserResponse(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getPhoneNumber(),
                user.getRole()
        );
    }
    public List<AdminProductResponse> getAllProducts() {

        return productRepository.findAll()
                .stream()
                .map(product -> {

                    Category category = product.getCategory();

                    Seller seller = product.getSeller();

                    return new AdminProductResponse(
                            product.getId(),
                            product.getName(),
                            product.getDescription(),
                            product.getPrice(),
                            product.getStockQuantity(),

                            category != null
                                    ? category.getId()
                                    : null,

                            category != null
                                    ? category.getName()
                                    : null,

                            seller != null
                                    ? seller.getId()
                                    : null,

                            seller != null && seller.getUser() != null
                                    ? seller.getUser().getName()
                                    : null,

                            seller != null
                                    ? seller.getStoreName()
                                    : null
                    );
                })
                .collect(Collectors.toList());
    }
    public List<AdminOrderResponse> getAllOrders() {

        return orderRepository.findAll()
                .stream()
                .map(order -> {

                    User customer = order.getUser();

                    return new AdminOrderResponse(
                            order.getId(),
                            customer != null ? customer.getId() : null,
                            customer != null ? customer.getName() : null,
                            customer != null ? customer.getEmail() : null,
                            order.getTotalAmount(),
                            order.getStatus(),
                            order.getCreatedAt()
                    );
                })
                .collect(Collectors.toList());
    }
    public AdminOrderDetailsResponse getOrderById(Long orderId) {

        Order order = orderRepository.findById(orderId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Order not found with id: " + orderId
                        ));

        User customer = order.getUser();

        List<AdminOrderDetailsResponse.AdminOrderItemResponse> items =
                order.getItems()
                        .stream()
                        .map(item -> {

                            Product product = item.getProduct();
                            Seller seller = product != null
                                    ? product.getSeller()
                                    : null;

                            return new AdminOrderDetailsResponse
                                    .AdminOrderItemResponse(
                                    product != null
                                            ? product.getId()
                                            : null,

                                    product != null
                                            ? product.getName()
                                            : null,

                                    item.getQuantity(),

                                    item.getPrice(),

                                    seller != null
                                            ? seller.getId()
                                            : null,

                                    seller != null &&
                                            seller.getUser() != null
                                            ? seller.getUser().getName()
                                            : null,

                                    seller != null
                                            ? seller.getStoreName()
                                            : null
                            );
                        })
                        .toList();

        AdminOrderDetailsResponse.AdminDeliveryAddressResponse
                deliveryAddress = null;

        if (order.getDeliveryAddress() != null) {

            var address = order.getDeliveryAddress();

            deliveryAddress =
                    new AdminOrderDetailsResponse
                            .AdminDeliveryAddressResponse(
                            address.getFullName(),
                            address.getPhoneNumber(),
                            address.getAddressLine1(),
                            address.getAddressLine2(),
                            address.getLandmark(),
                            address.getCity(),
                            address.getState(),
                            address.getPincode(),
                            address.getCountry(),
                            address.getAddressType()
                    );
        }

        return new AdminOrderDetailsResponse(
                order.getId(),

                customer != null
                        ? customer.getId()
                        : null,

                customer != null
                        ? customer.getName()
                        : null,

                customer != null
                        ? customer.getEmail()
                        : null,

                order.getTotalAmount(),

                order.getStatus(),

                order.getCreatedAt(),

                deliveryAddress,

                items
        );
    }

    public static class AdminDashboardResponse {

        private long totalUsers;
        private long totalSellers;
        private long totalProducts;
        private long totalOrders;

        public AdminDashboardResponse() {
        }

        public AdminDashboardResponse(
                long totalUsers,
                long totalSellers,
                long totalProducts,
                long totalOrders) {

            this.totalUsers = totalUsers;
            this.totalSellers = totalSellers;
            this.totalProducts = totalProducts;
            this.totalOrders = totalOrders;
        }

        public long getTotalUsers() {
            return totalUsers;
        }

        public void setTotalUsers(long totalUsers) {
            this.totalUsers = totalUsers;
        }

        public long getTotalSellers() {
            return totalSellers;
        }

        public void setTotalSellers(long totalSellers) {
            this.totalSellers = totalSellers;
        }

        public long getTotalProducts() {
            return totalProducts;
        }

        public void setTotalProducts(long totalProducts) {
            this.totalProducts = totalProducts;
        }

        public long getTotalOrders() {
            return totalOrders;
        }

        public void setTotalOrders(long totalOrders) {
            this.totalOrders = totalOrders;
        }
    }
    public SellerResponse getSellerById(Long sellerId) {

        Seller seller = sellerRepository.findById(sellerId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Seller not found with id: " + sellerId
                        ));

        return new SellerResponse(
                seller.getId(),
                seller.getUser().getName(),
                seller.getUser().getEmail(),
                seller.getStoreName(),
                seller.getDescription(),
                seller.getStoreImageUrl(),
                seller.isApproved(),
                seller.getUser().getId()
        );
    }
    public List<ReviewResponse> getAllReviews() {

        return reviewRepository.findAll()
                .stream()
                .map(review -> new ReviewResponse(
                        review.getId(),
                        review.getProduct().getId(),
                        review.getProduct().getName(),
                        review.getUser().getId(),
                        review.getUser().getName(),
                        review.getRating(),
                        review.getComment(),
                        review.getCreatedAt(),
                        review.getUpdatedAt()
                ))
                .toList();
    }
    public void deleteReview(Long reviewId) {

        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Review not found with id: " + reviewId
                        ));

        reviewRepository.delete(review);
    }
}