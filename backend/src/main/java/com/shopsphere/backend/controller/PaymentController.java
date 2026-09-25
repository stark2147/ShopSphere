package com.shopsphere.backend.controller;

import com.shopsphere.backend.dto.CreatePaymentResponse;
import com.shopsphere.backend.dto.VerifyPaymentRequest;
import com.shopsphere.backend.service.PaymentService;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/payments")
public class PaymentController {

    private final PaymentService paymentService;

    public PaymentController(PaymentService paymentService) {
        this.paymentService = paymentService;
    }

    @PostMapping("/create/{orderId}")
    @ResponseStatus(HttpStatus.CREATED)
    public CreatePaymentResponse createPayment(
            @PathVariable Long orderId) throws Exception {

        return paymentService.createPayment(orderId);
    }

    @PostMapping("/verify")
    public String verifyPayment(
            @Valid @RequestBody VerifyPaymentRequest request)
            throws Exception {

        return paymentService.verifyPayment(request);
    }
}