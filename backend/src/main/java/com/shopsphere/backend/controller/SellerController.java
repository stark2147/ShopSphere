package com.shopsphere.backend.controller;

import com.shopsphere.backend.dto.SellerRequest;
import com.shopsphere.backend.dto.SellerResponse;
import com.shopsphere.backend.service.SellerService;

import jakarta.validation.Valid;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/sellers")
public class SellerController {

    private final SellerService sellerService;

    public SellerController(SellerService sellerService) {
        this.sellerService = sellerService;
    }


    // =========================================================
    // GET MY SELLER PROFILE
    // =========================================================

    @GetMapping("/me")
    public SellerResponse getMySellerProfile() {

        return sellerService.getMySellerProfile();
    }
    // =========================================================
// UPDATE MY SELLER PROFILE
// =========================================================

    @PutMapping("/me")
    public SellerResponse updateMySellerProfile(
            @Valid @RequestBody SellerRequest request) {

        return sellerService.updateMySellerProfile(request);
    }


    // =========================================================
    // GET SELLER BY ID
    // =========================================================

    @GetMapping("/{id}")
    public SellerResponse getSellerById(
            @PathVariable Long id) {

        return sellerService.getSellerById(id);
    }


    // =========================================================
    // APPROVE SELLER
    // =========================================================

    @PutMapping("/{id}/approve")
    public SellerResponse approveSeller(
            @PathVariable Long id) {

        return sellerService.approveSeller(id);
    }


    // =========================================================
    // SELLER REGISTRATION
    // =========================================================

    @PostMapping("/register")
    public SellerResponse registerSeller(
            @Valid @RequestBody SellerRequest request) {

        return sellerService.registerSeller(request);
    }


    // =========================================================
    // GET ALL SELLERS
    // =========================================================

    @GetMapping
    public List<SellerResponse> getAllSellers() {

        return sellerService.getAllSellers();
    }
}