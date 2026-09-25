package com.shopsphere.backend.service;

import com.shopsphere.backend.dto.OrderDeliveryAddressResponse;
import com.shopsphere.backend.dto.OrderItemResponse;
import com.shopsphere.backend.dto.OrderResponse;
import com.shopsphere.backend.dto.SellerOrderResponse;

import com.shopsphere.backend.entity.Address;
import com.shopsphere.backend.entity.OrderDeliveryAddress;
import com.shopsphere.backend.entity.Cart;
import com.shopsphere.backend.entity.CartItem;
import com.shopsphere.backend.entity.Order;
import com.shopsphere.backend.entity.OrderItem;
import com.shopsphere.backend.entity.OrderStatus;
import com.shopsphere.backend.entity.Product;
import com.shopsphere.backend.entity.Seller;
import com.shopsphere.backend.entity.SellerOrder;
import com.shopsphere.backend.entity.User;
import com.shopsphere.backend.entity.NotificationType;
import com.shopsphere.backend.exception.ResourceNotFoundException;
import com.shopsphere.backend.repository.AddressRepository;
import com.shopsphere.backend.repository.CartItemRepository;
import com.shopsphere.backend.repository.CartRepository;
import com.shopsphere.backend.repository.OrderRepository;
import com.shopsphere.backend.repository.ProductRepository;
import com.shopsphere.backend.repository.SellerOrderRepository;
import com.shopsphere.backend.repository.SellerRepository;
import com.shopsphere.backend.repository.UserRepository;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class OrderService {

    private final OrderRepository orderRepository;
    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;
    private final SellerRepository sellerRepository;
    private final SellerOrderRepository sellerOrderRepository;
    private final AddressRepository addressRepository;
    private final NotificationService notificationService;

    public OrderService(
            OrderRepository orderRepository,
            CartRepository cartRepository,
            CartItemRepository cartItemRepository,
            ProductRepository productRepository,
            UserRepository userRepository,
            SellerRepository sellerRepository,
            SellerOrderRepository sellerOrderRepository,
            AddressRepository addressRepository,
            NotificationService notificationService) {

        this.orderRepository = orderRepository;
        this.cartRepository = cartRepository;
        this.cartItemRepository = cartItemRepository;
        this.productRepository = productRepository;
        this.userRepository = userRepository;
        this.sellerRepository = sellerRepository;
        this.sellerOrderRepository = sellerOrderRepository;
        this.addressRepository = addressRepository;
        this.notificationService = notificationService;
    }

    // ============================================================
    // CUSTOMER - PLACE ORDER
    // ============================================================

    @Transactional
    public OrderResponse placeOrder(Long addressId) {

        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        String email = authentication.getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "User not found with email: " + email
                        ));

        // ========================================================
        // VERIFY DELIVERY ADDRESS OWNERSHIP
        // ========================================================

        Address address = addressRepository.findByIdAndUserId(
                addressId,
                user.getId()
        ).orElseThrow(() ->
                new ResourceNotFoundException(
                        "Address not found or does not belong to you"
                )
        );

        Cart cart = cartRepository.findByUserId(user.getId())
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Cart not found"
                        ));

        List<CartItem> cartItems =
                cartItemRepository.findByCartId(cart.getId());

        if (cartItems.isEmpty()) {
            throw new IllegalArgumentException(
                    "Cannot place order with an empty cart"
            );
        }

        // ========================================================
        // GROUP CART ITEMS BY SELLER
        // ========================================================

        Map<Long, List<CartItem>> cartItemsBySeller =
                new LinkedHashMap<>();

        Map<Long, Seller> sellersById =
                new LinkedHashMap<>();

        for (CartItem cartItem : cartItems) {

            Product product =
                    cartItem.getProduct();

            Seller seller =
                    product.getSeller();

            if (seller == null) {

                throw new IllegalArgumentException(
                        "Product '" +
                                product.getName() +
                                "' does not have a seller"
                );
            }

            Long sellerId =
                    seller.getId();

            sellersById.put(
                    sellerId,
                    seller
            );

            cartItemsBySeller
                    .computeIfAbsent(
                            sellerId,
                            key -> new ArrayList<>()
                    )
                    .add(cartItem);
        }

        // ========================================================
        // CREATE MAIN ORDER
        // ========================================================

        Order order = new Order();

        order.setUser(user);
        order.setStatus(OrderStatus.PENDING);
        order.setCreatedAt(LocalDateTime.now());

        // ========================================================
        // CREATE DELIVERY ADDRESS SNAPSHOT
        // ========================================================

        OrderDeliveryAddress deliveryAddress =
                new OrderDeliveryAddress();

        deliveryAddress.setFullName(
                address.getFullName()
        );

        deliveryAddress.setPhoneNumber(
                address.getPhoneNumber()
        );

        deliveryAddress.setAddressLine1(
                address.getAddressLine1()
        );

        deliveryAddress.setAddressLine2(
                address.getAddressLine2()
        );

        deliveryAddress.setLandmark(
                address.getLandmark()
        );

        deliveryAddress.setCity(
                address.getCity()
        );

        deliveryAddress.setState(
                address.getState()
        );

        deliveryAddress.setPincode(
                address.getPincode()
        );

        deliveryAddress.setCountry(
                address.getCountry()
        );

        deliveryAddress.setAddressType(
                address.getAddressType()
        );

        order.setDeliveryAddress(
                deliveryAddress
        );

        BigDecimal totalAmount =
                BigDecimal.ZERO;

        List<OrderItem> allOrderItems =
                new ArrayList<>();

        List<SellerOrder> sellerOrders =
                new ArrayList<>();

        // ========================================================
        // CREATE SELLER ORDERS
        // ========================================================

        for (Map.Entry<Long, List<CartItem>> entry :
                cartItemsBySeller.entrySet()) {

            Long sellerId =
                    entry.getKey();

            List<CartItem> sellerCartItems =
                    entry.getValue();

            Seller seller =
                    sellersById.get(sellerId);

            SellerOrder sellerOrder =
                    new SellerOrder();

            sellerOrder.setOrder(order);

            sellerOrder.setSeller(seller);

            sellerOrder.setStatus(
                    OrderStatus.PENDING
            );

            sellerOrder.setCreatedAt(
                    LocalDateTime.now()
            );

            BigDecimal sellerTotal =
                    BigDecimal.ZERO;

            List<OrderItem> sellerOrderItems =
                    new ArrayList<>();

            // ====================================================
            // CREATE ORDER ITEMS
            // ====================================================

            for (CartItem cartItem :
                    sellerCartItems) {

                Product product =
                        cartItem.getProduct();

                Integer requestedQuantity =
                        cartItem.getQuantity();

                // =================================================
                // CHECK STOCK
                // =================================================

                if (product.getStockQuantity() == null ||
                        product.getStockQuantity()
                                < requestedQuantity) {

                    throw new IllegalArgumentException(
                            "Insufficient stock for product: "
                                    + product.getName()
                    );
                }

                BigDecimal price =
                        product.getPrice();

                BigDecimal itemTotal =
                        price.multiply(
                                BigDecimal.valueOf(
                                        requestedQuantity
                                )
                        );

                sellerTotal =
                        sellerTotal.add(itemTotal);

                totalAmount =
                        totalAmount.add(itemTotal);

                // =================================================
                // CREATE ORDER ITEM
                // =================================================

                OrderItem orderItem =
                        new OrderItem();

                orderItem.setOrder(order);

                orderItem.setProduct(product);

                orderItem.setQuantity(
                        requestedQuantity
                );

                orderItem.setPrice(price);

                orderItem.setSellerOrder(
                        sellerOrder
                );

                sellerOrderItems.add(
                        orderItem
                );

                allOrderItems.add(
                        orderItem
                );

                // =================================================
                // REDUCE STOCK
                // =================================================

                product.setStockQuantity(
                        product.getStockQuantity()
                                - requestedQuantity
                );

                productRepository.save(product);
            }

            // ====================================================
            // FINISH SELLER ORDER
            // ====================================================

            sellerOrder.setTotalAmount(
                    sellerTotal
            );

            sellerOrder.setItems(
                    sellerOrderItems
            );

            sellerOrders.add(
                    sellerOrder
            );
        }

        // ========================================================
        // FINISH MAIN ORDER
        // ========================================================

        order.setTotalAmount(
                totalAmount
        );

        order.setItems(
                allOrderItems
        );

        order.setSellerOrders(
                sellerOrders
        );

        // ========================================================
        // SAVE ORDER
        // ========================================================

        Order savedOrder =
                orderRepository.save(order);
        notificationService.createNotification(
                user.getId(),
                "Order Placed Successfully",
                "Your order #" + savedOrder.getId()
                        + " has been placed successfully.",
                NotificationType.ORDER_PLACED
        );

        // ========================================================
// CREATE SELLER NOTIFICATIONS
// ========================================================

        for (Seller seller : sellersById.values()) {

            notificationService.createNotification(
                    seller.getUser().getId(),
                    "New Order Received",
                    "You have received a new order #" +
                            savedOrder.getId() + ".",
                    NotificationType.SELLER_NEW_ORDER
            );
        }
        // ========================================================
        // CLEAR CART
        // ========================================================

        cartItemRepository.deleteAll(
                cartItems
        );

        return convertToResponse(
                savedOrder
        );
    }

    // ============================================================
    // CUSTOMER - GET MY ORDERS
    // ============================================================

    @Transactional(readOnly = true)
    public List<OrderResponse> getMyOrders() {

        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        String email =
                authentication.getName();

        User user =
                userRepository.findByEmail(email)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "User not found with email: "
                                                + email
                                ));

        List<Order> orders =
                orderRepository.findByUserId(
                        user.getId()
                );

        return orders.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    // ============================================================
    // CUSTOMER - GET ORDER BY ID
    // ============================================================

    @Transactional(readOnly = true)
    public OrderResponse getOrderById(
            Long orderId) {

        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        String email =
                authentication.getName();

        User user =
                userRepository.findByEmail(email)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "User not found with email: "
                                                + email
                                ));

        Order order =
                orderRepository.findById(orderId)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Order not found with id: "
                                                + orderId
                                ));

        if (!order.getUser()
                .getId()
                .equals(user.getId())) {

            throw new org.springframework.security.access.AccessDeniedException(
                    "You cannot access this order"
            );
        }

        return convertToResponse(order);
    }

    // ============================================================
    // CUSTOMER - CANCEL ORDER
    // ============================================================

    @Transactional
    public OrderResponse cancelOrder(
            Long orderId) {

        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        String email =
                authentication.getName();

        User user =
                userRepository.findByEmail(email)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "User not found with email: "
                                                + email
                                ));

        Order order =
                orderRepository.findById(orderId)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Order not found with id: "
                                                + orderId
                                ));

        // ========================================================
        // SECURITY CHECK
        // ========================================================

        if (!order.getUser()
                .getId()
                .equals(user.getId())) {

            throw new org.springframework.security.access.AccessDeniedException(
                    "You cannot cancel this order"
            );
        }

        // ========================================================
        // MAIN ORDER MUST BE PENDING
        // ========================================================

        if (order.getStatus()
                != OrderStatus.PENDING) {

            throw new IllegalArgumentException(
                    "Only PENDING orders can be cancelled"
            );
        }

        // ========================================================
        // GET SELLER ORDERS
        // ========================================================

        List<SellerOrder> sellerOrders =
                sellerOrderRepository.findByOrderId(
                        orderId
                );

        // ========================================================
        // SAFETY CHECK
        // ========================================================

        if (sellerOrders.isEmpty()) {

            throw new IllegalArgumentException(
                    "This order cannot be cancelled because seller "
                            + "order details are missing"
            );
        }

        // ========================================================
        // ALL SELLER ORDERS MUST BE PENDING
        // ========================================================

        boolean allSellerOrdersPending =
                sellerOrders.stream()
                        .allMatch(sellerOrder ->
                                sellerOrder.getStatus()
                                        == OrderStatus.PENDING
                        );

        if (!allSellerOrdersPending) {

            throw new IllegalArgumentException(
                    "Order cannot be cancelled because one or more "
                            + "sellers have already started processing "
                            + "the order"
            );
        }

        // ========================================================
        // RESTORE PRODUCT STOCK
        // ========================================================

        for (OrderItem orderItem :
                order.getItems()) {

            Product product =
                    orderItem.getProduct();

            product.setStockQuantity(
                    product.getStockQuantity()
                            + orderItem.getQuantity()
            );

            productRepository.save(
                    product
            );
        }

        // ========================================================
        // CANCEL MAIN ORDER
        // ========================================================

        order.setStatus(
                OrderStatus.CANCELLED
        );

        // ========================================================
        // CANCEL ALL SELLER ORDERS
        // ========================================================

        for (SellerOrder sellerOrder :
                sellerOrders) {

            sellerOrder.setStatus(
                    OrderStatus.CANCELLED
            );

            sellerOrderRepository.save(
                    sellerOrder
            );
        }

        // ========================================================
        // SAVE MAIN ORDER
        // ========================================================

        Order savedOrder =
                orderRepository.save(order);
        notificationService.createNotification(
                user.getId(),
                "Order Cancelled",
                "Your order #" + savedOrder.getId()
                        + " has been cancelled successfully.",
                NotificationType.ORDER_CANCELLED
        );

        return convertToResponse(
                savedOrder
        );
    }

    // ============================================================
    // SELLER - UPDATE ORDER STATUS
    // ============================================================

    @Transactional
    public SellerOrderResponse updateSellerOrderStatus(
            Long sellerOrderId,
            OrderStatus newStatus) {

        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        String email =
                authentication.getName();

        User user =
                userRepository.findByEmail(email)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "User not found with email: "
                                                + email
                                ));

        Seller seller =
                sellerRepository.findByUserId(user.getId())
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Seller profile not found"
                                ));

        SellerOrder sellerOrder =
                sellerOrderRepository.findById(sellerOrderId)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Seller order not found with id: "
                                                + sellerOrderId
                                ));

        // ========================================================
        // SECURITY CHECK
        // ========================================================

        if (!sellerOrder.getSeller()
                .getId()
                .equals(seller.getId())) {

            throw new org.springframework.security.access.AccessDeniedException(
                    "You cannot update another seller's order"
            );
        }

        // ========================================================
        // VALIDATE STATUS
        // ========================================================

        OrderStatus currentStatus =
                sellerOrder.getStatus();

        if (currentStatus == OrderStatus.CANCELLED) {

            throw new IllegalArgumentException(
                    "Cancelled orders cannot be updated"
            );
        }

        if (currentStatus == OrderStatus.DELIVERED) {

            throw new IllegalArgumentException(
                    "Delivered orders cannot be updated"
            );
        }

        if (newStatus == OrderStatus.PENDING) {

            throw new IllegalArgumentException(
                    "Cannot change order status back to PENDING"
            );
        }

        if (newStatus == OrderStatus.CANCELLED) {

            throw new IllegalArgumentException(
                    "Seller cannot cancel an order"
            );
        }

        // ========================================================
        // STATUS TRANSITION
        // ========================================================

        if (currentStatus == OrderStatus.PENDING &&
                newStatus != OrderStatus.CONFIRMED) {

            throw new IllegalArgumentException(
                    "PENDING order can only move to CONFIRMED"
            );
        }

        if (currentStatus == OrderStatus.CONFIRMED &&
                newStatus != OrderStatus.PROCESSING) {

            throw new IllegalArgumentException(
                    "CONFIRMED order can only move to PROCESSING"
            );
        }

        if (currentStatus == OrderStatus.PROCESSING &&
                newStatus != OrderStatus.SHIPPED) {

            throw new IllegalArgumentException(
                    "PROCESSING order can only move to SHIPPED"
            );
        }

        if (currentStatus == OrderStatus.SHIPPED &&
                newStatus != OrderStatus.DELIVERED) {

            throw new IllegalArgumentException(
                    "SHIPPED order can only move to DELIVERED"
            );
        }

        // ========================================================
        // UPDATE SELLER ORDER STATUS
        // ========================================================

        sellerOrder.setStatus(newStatus);

        SellerOrder savedSellerOrder =
                sellerOrderRepository.save(sellerOrder);
        User customer = sellerOrder.getOrder().getUser();

        String title;
        String message;
        NotificationType notificationType;

        switch (newStatus) {

            case CONFIRMED:
                title = "Order Confirmed";
                message = "Your order #" + sellerOrder.getOrder().getId()
                        + " has been confirmed by the seller.";
                notificationType = NotificationType.ORDER_CONFIRMED;
                break;

            case PROCESSING:
                title = "Order Processing";
                message = "Your order #" + sellerOrder.getOrder().getId()
                        + " is now being processed.";
                notificationType = NotificationType.ORDER_PROCESSING;
                break;

            case SHIPPED:
                title = "Order Shipped";
                message = "Your order #" + sellerOrder.getOrder().getId()
                        + " has been shipped.";
                notificationType = NotificationType.ORDER_SHIPPED;
                break;

            case DELIVERED:
                title = "Order Delivered";
                message = "Your order #" + sellerOrder.getOrder().getId()
                        + " has been delivered.";
                notificationType = NotificationType.ORDER_DELIVERED;
                break;

            default:
                return convertToSellerOrderResponse(savedSellerOrder);
        }

        notificationService.createNotification(
                customer.getId(),
                title,
                message,
                notificationType
        );

        // ========================================================
        // UPDATE MAIN ORDER STATUS
        // ========================================================

        updateMainOrderStatus(
                sellerOrder.getOrder()
        );

        return convertToSellerOrderResponse(
                savedSellerOrder
        );
    }

    // ============================================================
    // UPDATE MAIN ORDER STATUS
    // ============================================================

    private void updateMainOrderStatus(
            Order order) {

        List<SellerOrder> sellerOrders =
                sellerOrderRepository.findByOrderId(
                        order.getId()
                );

        if (sellerOrders.isEmpty()) {
            return;
        }

        // ========================================================
        // ALL SELLER ORDERS CANCELLED
        // ========================================================

        boolean allCancelled =
                sellerOrders.stream()
                        .allMatch(sellerOrder ->
                                sellerOrder.getStatus()
                                        == OrderStatus.CANCELLED
                        );

        if (allCancelled) {

            order.setStatus(
                    OrderStatus.CANCELLED
            );

            orderRepository.save(order);

            return;
        }

        // ========================================================
        // ALL SELLER ORDERS DELIVERED
        // ========================================================

        boolean allDelivered =
                sellerOrders.stream()
                        .allMatch(sellerOrder ->
                                sellerOrder.getStatus()
                                        == OrderStatus.DELIVERED
                        );

        if (allDelivered) {

            order.setStatus(
                    OrderStatus.DELIVERED
            );

            orderRepository.save(order);

            return;
        }

        // ========================================================
        // ANY SELLER ORDER PROCESSING
        // ========================================================

        boolean anyProcessing =
                sellerOrders.stream()
                        .anyMatch(sellerOrder ->
                                sellerOrder.getStatus()
                                        == OrderStatus.PROCESSING
                        );

        if (anyProcessing) {

            order.setStatus(
                    OrderStatus.PROCESSING
            );

            orderRepository.save(order);

            return;
        }

        // ========================================================
        // ANY SELLER ORDER SHIPPED
        // ========================================================

        boolean anyShipped =
                sellerOrders.stream()
                        .anyMatch(sellerOrder ->
                                sellerOrder.getStatus()
                                        == OrderStatus.SHIPPED
                        );

        if (anyShipped) {

            order.setStatus(
                    OrderStatus.SHIPPED
            );

            orderRepository.save(order);

            return;
        }

        // ========================================================
        // ANY SELLER ORDER CONFIRMED
        // ========================================================

        boolean anyConfirmed =
                sellerOrders.stream()
                        .anyMatch(sellerOrder ->
                                sellerOrder.getStatus()
                                        == OrderStatus.CONFIRMED
                        );

        if (anyConfirmed) {

            order.setStatus(
                    OrderStatus.CONFIRMED
            );

            orderRepository.save(order);

            return;
        }

        // ========================================================
        // OTHERWISE PENDING
        // ========================================================

        order.setStatus(
                OrderStatus.PENDING
        );

        orderRepository.save(order);
    }

    // ============================================================
    // SELLER - GET MY ORDERS
    // ============================================================

    @Transactional(readOnly = true)
    public List<SellerOrderResponse> getSellerOrders() {

        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        String email =
                authentication.getName();

        User user =
                userRepository.findByEmail(email)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "User not found with email: "
                                                + email
                                ));

        Seller seller =
                sellerRepository.findByUserId(
                                user.getId()
                        )
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Seller profile not found"
                                ));

        List<SellerOrder> sellerOrders =
                sellerOrderRepository.findBySellerId(
                        seller.getId()
                );

        return sellerOrders.stream()
                .map(this::convertToSellerOrderResponse)
                .collect(Collectors.toList());
    }

    // ============================================================
    // SELLER - CONVERT SELLER ORDER RESPONSE
    // ============================================================

    private SellerOrderResponse convertToSellerOrderResponse(
            SellerOrder sellerOrder) {

        List<OrderItemResponse> itemResponses =
                sellerOrder.getItems()
                        .stream()
                        .map(item ->
                                new OrderItemResponse(
                                        item.getId(),
                                        item.getProduct().getId(),
                                        item.getProduct().getName(),
                                        item.getQuantity(),
                                        item.getPrice()
                                )
                        )
                        .collect(Collectors.toList());

        return new SellerOrderResponse(
                sellerOrder.getId(),
                sellerOrder.getOrder().getId(),
                sellerOrder.getTotalAmount(),
                sellerOrder.getStatus(),
                sellerOrder.getCreatedAt(),
                itemResponses
        );
    }

    // ============================================================
    // CUSTOMER ORDER RESPONSE CONVERTER
    // ============================================================

    private OrderResponse convertToResponse(
            Order order) {

        List<OrderItemResponse> itemResponses =
                order.getItems()
                        .stream()
                        .map(item ->
                                new OrderItemResponse(
                                        item.getId(),
                                        item.getProduct().getId(),
                                        item.getProduct().getName(),
                                        item.getQuantity(),
                                        item.getPrice()
                                )
                        )
                        .collect(Collectors.toList());

        // ========================================================
        // CONVERT DELIVERY ADDRESS SNAPSHOT
        // ========================================================

        OrderDeliveryAddressResponse deliveryAddressResponse =
                null;

        if (order.getDeliveryAddress() != null) {

            OrderDeliveryAddress address =
                    order.getDeliveryAddress();

            deliveryAddressResponse =
                    new OrderDeliveryAddressResponse(
                            address.getId(),
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

        return new OrderResponse(
                order.getId(),
                order.getTotalAmount(),
                order.getStatus(),
                order.getCreatedAt(),
                itemResponses,
                deliveryAddressResponse
        );
    }
}