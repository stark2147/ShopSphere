package com.shopsphere.backend.controller;

import com.shopsphere.backend.dto.ProductRequest;
import com.shopsphere.backend.dto.ProductResponse;
import com.shopsphere.backend.service.ProductImageStorageService;
import com.shopsphere.backend.service.ProductService;

import jakarta.validation.Valid;

import org.springframework.data.domain.Page;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/products")
public class ProductController {

    private final ProductService productService;
    private final ProductImageStorageService productImageStorageService;

    public ProductController(
            ProductService productService,
            ProductImageStorageService productImageStorageService) {

        this.productService = productService;
        this.productImageStorageService = productImageStorageService;
    }


    // =========================================================
    // SEARCH PRODUCTS
    // =========================================================

    @GetMapping("/search")
    public List<ProductResponse> searchProducts(
            @RequestParam String keyword) {

        return productService.searchProducts(keyword);
    }


    // =========================================================
    // GET ALL PRODUCTS WITH PAGINATION
    // =========================================================

    @GetMapping
    public Page<ProductResponse> getAllProducts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "asc") String direction) {

        return productService.getAllProducts(
                page,
                size,
                sortBy,
                direction
        );
    }


    // =========================================================
    // CREATE PRODUCT
    // =========================================================

    @PostMapping
    public ProductResponse createProduct(
            @Valid @RequestBody ProductRequest request) {

        return productService.createProduct(request);
    }


    // =========================================================
    // GET LOGGED-IN SELLER'S PRODUCTS
    // =========================================================

    @GetMapping("/my-products")
    public List<ProductResponse> getMyProducts() {

        return productService.getMyProducts();
    }


    // =========================================================
    // GET PRODUCTS BY SELLER
    // =========================================================

    @GetMapping("/seller/{sellerId}")
    public List<ProductResponse> getProductsBySeller(
            @PathVariable Long sellerId) {

        return productService.getProductsBySeller(sellerId);
    }


    // =========================================================
    // GET PRODUCT BY ID
    // =========================================================

    @GetMapping("/{id}")
    public ProductResponse getProductById(
            @PathVariable Long id) {

        return productService.getProductById(id);
    }


    // =========================================================
    // UPDATE PRODUCT
    // =========================================================

    @PutMapping("/{id}")
    public ProductResponse updateProduct(
            @PathVariable Long id,
            @Valid @RequestBody ProductRequest request) {

        return productService.updateProduct(id, request);
    }


    // =========================================================
    // QUICK UPDATE STOCK
    // =========================================================

    @PutMapping("/{id}/stock")
    public ProductResponse updateStock(
            @PathVariable Long id,
            @RequestParam Integer quantity) {

        return productService.updateStock(id, quantity);
    }


    // =========================================================
    // UPLOAD PRODUCT IMAGE
    // =========================================================

    @PostMapping(
            value = "/upload-image",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )
    public Map<String, String> uploadProductImage(
            @RequestParam("file") MultipartFile file) {

        String filename = productImageStorageService.store(file);

        String baseUrl = ServletUriComponentsBuilder
                .fromCurrentContextPath()
                .build()
                .toUri()
                .toString();

        String imageUrl =
                baseUrl + "/uploads/products/" + filename;

        return Map.of("imageUrl", imageUrl);
    }


    // =========================================================
    // DELETE PRODUCT
    // =========================================================

    @DeleteMapping("/{id}")
    public String deleteProduct(
            @PathVariable Long id) {

        productService.deleteProduct(id);

        return "Product deleted successfully";
    }
}