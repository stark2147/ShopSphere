package com.shopsphere.backend.service;

import com.razorpay.RazorpayClient;
import com.razorpay.Utils;

import com.shopsphere.backend.dto.CreatePaymentResponse;
import com.shopsphere.backend.dto.VerifyPaymentRequest;
import com.shopsphere.backend.entity.Order;
import com.shopsphere.backend.entity.OrderStatus;
import com.shopsphere.backend.entity.Payment;
import com.shopsphere.backend.entity.PaymentStatus;
import com.shopsphere.backend.entity.User;
import com.shopsphere.backend.repository.OrderRepository;
import com.shopsphere.backend.repository.PaymentRepository;
import com.shopsphere.backend.repository.UserRepository;

import jakarta.transaction.Transactional;

import org.json.JSONObject;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Service
public class PaymentService {

    private final PaymentRepository paymentRepository;
    private final OrderRepository orderRepository;
    private final UserRepository userRepository;
    private final RazorpayClient razorpayClient;

    @Value("${razorpay.key.id}")
    private String razorpayKeyId;

    @Value("${razorpay.key.secret}")
    private String razorpayKeySecret;

    public PaymentService(
            PaymentRepository paymentRepository,
            OrderRepository orderRepository,
            UserRepository userRepository,
            RazorpayClient razorpayClient) {

        this.paymentRepository = paymentRepository;
        this.orderRepository = orderRepository;
        this.userRepository = userRepository;
        this.razorpayClient = razorpayClient;
    }

    /*
     * ============================================================
     * CREATE RAZORPAY PAYMENT
     * ============================================================
     */

    @Transactional
    public CreatePaymentResponse createPayment(Long orderId)
            throws Exception {

        User user = getAuthenticatedUser();

        /*
         * Find ShopSphere order
         */
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Order not found with id: " + orderId));

        /*
         * Check order ownership
         *
         * A customer can only pay for their own order.
         */
        if (!order.getUser().getId().equals(user.getId())) {

            throw new AccessDeniedException(
                    "You cannot make payment for this order");
        }

        /*
         * Payment is allowed only for PENDING orders.
         */
        if (order.getStatus() != OrderStatus.PENDING) {

            throw new IllegalArgumentException(
                    "Payment can only be created for a PENDING order");
        }

        /*
         * Prevent duplicate payment creation.
         */
        if (paymentRepository.findByOrderId(orderId).isPresent()) {

            throw new IllegalArgumentException(
                    "Payment has already been created for this order");
        }

        /*
         * Calculate total amount from ShopSphere order items.
         */
        BigDecimal amount = calculateOrderTotal(order);

        /*
         * Razorpay expects amount in the smallest currency unit.
         *
         * Example:
         *
         * ₹29,999.00
         *
         * becomes
         *
         * 2,999,900 paise
         */
        long amountInPaise = amount
                .multiply(BigDecimal.valueOf(100))
                .longValueExact();

        /*
         * Create Razorpay order request.
         */
        JSONObject orderRequest = new JSONObject();

        orderRequest.put(
                "amount",
                amountInPaise
        );

        orderRequest.put(
                "currency",
                "INR"
        );

        orderRequest.put(
                "receipt",
                "shopsphere_order_" + order.getId()
        );

        /*
         * Create Razorpay order.
         */
        com.razorpay.Order razorpayOrder =
                razorpayClient.orders.create(orderRequest);

        /*
         * Get Razorpay Order ID.
         */
        String razorpayOrderId =
                razorpayOrder.get("id");

        /*
         * Save payment information
         * in ShopSphere database.
         */
        Payment payment = new Payment();

        payment.setOrder(order);

        payment.setRazorpayOrderId(
                razorpayOrderId
        );

        payment.setAmount(
                amount
        );

        payment.setStatus(
                PaymentStatus.CREATED
        );

        payment.setCreatedAt(
                LocalDateTime.now()
        );

        payment.setUpdatedAt(
                LocalDateTime.now()
        );

        paymentRepository.save(payment);

        /*
         * Return payment information
         * required by the frontend.
         */
        return new CreatePaymentResponse(
                order.getId(),
                razorpayOrderId,
                BigDecimal.valueOf(amountInPaise),
                "INR",
                razorpayKeyId
        );
    }


    /*
     * ============================================================
     * VERIFY RAZORPAY PAYMENT
     * ============================================================
     */

    @Transactional
    public String verifyPayment(
            VerifyPaymentRequest request)
            throws Exception {

        User user = getAuthenticatedUser();

        /*
         * Find the ShopSphere payment using
         * the Razorpay Order ID.
         */
        Payment payment = paymentRepository
                .findByRazorpayOrderId(
                        request.getRazorpayOrderId()
                )
                .orElseThrow(() ->
                        new RuntimeException(
                                "Payment not found for Razorpay order: "
                                        + request.getRazorpayOrderId()
                        ));

        Order order = payment.getOrder();

        /*
         * Make sure the logged-in customer
         * owns this order.
         */
        if (!order.getUser().getId().equals(user.getId())) {

            throw new AccessDeniedException(
                    "You cannot verify payment for this order");
        }

        /*
         * Prevent duplicate verification.
         */
        if (payment.getStatus() == PaymentStatus.SUCCESS) {

            return "Payment already verified successfully";
        }

        /*
         * Use the Razorpay Order ID stored
         * in our database.
         */
        String storedRazorpayOrderId =
                payment.getRazorpayOrderId();

        /*
         * Prepare signature verification data.
         */
        JSONObject options = new JSONObject();

        options.put(
                "razorpay_order_id",
                storedRazorpayOrderId
        );

        options.put(
                "razorpay_payment_id",
                request.getRazorpayPaymentId()
        );

        options.put(
                "razorpay_signature",
                request.getRazorpaySignature()
        );

        /*
         * STEP 1:
         * Verify Razorpay signature.
         */
        try {

            Utils.verifyPaymentSignature(
                    options,
                    razorpayKeySecret
            );

        } catch (Exception e) {

            payment.setStatus(
                    PaymentStatus.FAILED
            );

            payment.setUpdatedAt(
                    LocalDateTime.now()
            );

            paymentRepository.save(payment);

            throw new IllegalArgumentException(
                    "Invalid Razorpay payment signature"
            );
        }

        /*
         * STEP 2:
         * Fetch the actual payment directly
         * from Razorpay.
         */
        com.razorpay.Payment razorpayPayment =
                razorpayClient.payments.fetch(
                        request.getRazorpayPaymentId()
                );

        /*
         * Get payment details from Razorpay.
         */
        String razorpayPaymentOrderId =
                razorpayPayment.get("order_id");

        Number razorpayPaymentAmount =
                razorpayPayment.get("amount");

        Boolean captured =
                razorpayPayment.get("captured");

        String razorpayPaymentStatus =
                razorpayPayment.get("status");

        /*
         * STEP 3:
         * Make sure the payment belongs
         * to our Razorpay Order.
         */
        if (!storedRazorpayOrderId.equals(
                razorpayPaymentOrderId)) {

            payment.setStatus(
                    PaymentStatus.FAILED
            );

            payment.setUpdatedAt(
                    LocalDateTime.now()
            );

            paymentRepository.save(payment);

            throw new IllegalArgumentException(
                    "Razorpay payment does not belong to this order"
            );
        }

        /*
         * STEP 4:
         * Make sure the Razorpay amount matches
         * our ShopSphere order amount.
         */
        long expectedAmountInPaise =
                payment.getAmount()
                        .multiply(BigDecimal.valueOf(100))
                        .longValueExact();

        if (razorpayPaymentAmount == null ||
                razorpayPaymentAmount.longValue()
                        != expectedAmountInPaise) {

            payment.setStatus(
                    PaymentStatus.FAILED
            );

            payment.setUpdatedAt(
                    LocalDateTime.now()
            );

            paymentRepository.save(payment);

            throw new IllegalArgumentException(
                    "Razorpay payment amount does not match order amount"
            );
        }

        /*
         * STEP 5:
         * Make sure the payment was actually captured.
         */
        if (!Boolean.TRUE.equals(captured) ||
                !"captured".equalsIgnoreCase(
                        razorpayPaymentStatus)) {

            payment.setStatus(
                    PaymentStatus.FAILED
            );

            payment.setUpdatedAt(
                    LocalDateTime.now()
            );

            paymentRepository.save(payment);

            throw new IllegalArgumentException(
                    "Razorpay payment has not been captured"
            );
        }

        /*
         * All security checks passed.
         *
         * Save Razorpay payment information.
         */
        payment.setRazorpayPaymentId(
                request.getRazorpayPaymentId()
        );

        payment.setRazorpaySignature(
                request.getRazorpaySignature()
        );

        payment.setStatus(
                PaymentStatus.SUCCESS
        );

        payment.setUpdatedAt(
                LocalDateTime.now()
        );

        paymentRepository.save(payment);

        /*
         * Payment successfully verified.
         *
         * PENDING → CONFIRMED
         */
        if (order.getStatus() == OrderStatus.PENDING) {

            order.setStatus(
                    OrderStatus.CONFIRMED
            );

            orderRepository.save(order);
        }

        return "Payment verified successfully";
    }

    /*
     * ============================================================
     * CALCULATE ORDER TOTAL
     * ============================================================
     */

    private BigDecimal calculateOrderTotal(
            Order order) {

        return order.getItems()
                .stream()
                .map(item ->
                        item.getPrice()
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
    }


    /*
     * ============================================================
     * GET AUTHENTICATED USER
     * ============================================================
     */

    private User getAuthenticatedUser() {

        Authentication authentication =
                SecurityContextHolder
                        .getContext()
                        .getAuthentication();

        String email =
                authentication.getName();

        return userRepository
                .findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Authenticated user not found"
                        ));
    }
}