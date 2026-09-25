package com.shopsphere.backend.service;

import com.shopsphere.backend.dto.ProductRequest;
import com.shopsphere.backend.dto.ProductResponse;
import com.shopsphere.backend.entity.Category;
import com.shopsphere.backend.entity.Product;
import com.shopsphere.backend.entity.Seller;
import com.shopsphere.backend.entity.User;
import com.shopsphere.backend.exception.ResourceNotFoundException;
import com.shopsphere.backend.repository.CategoryRepository;
import com.shopsphere.backend.repository.ProductRepository;
import com.shopsphere.backend.repository.SellerRepository;
import com.shopsphere.backend.repository.UserRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final UserRepository userRepository;
    private final SellerRepository sellerRepository;

    public ProductService(ProductRepository productRepository,
                          CategoryRepository categoryRepository,
                          SellerRepository sellerRepository,
                          UserRepository userRepository) {

        this.productRepository = productRepository;
        this.categoryRepository = categoryRepository;
        this.sellerRepository = sellerRepository;
        this.userRepository = userRepository;
    }

    // =========================================================
    // GET ALL PRODUCTS WITH PAGINATION
    // =========================================================

    public Page<ProductResponse> getAllProducts(
            int page,
            int size,
            String sortBy,
            String direction) {

        if (page < 0) {
            throw new IllegalArgumentException(
                    "Page number cannot be negative"
            );
        }

        if (size < 1 || size > 50) {
            throw new IllegalArgumentException(
                    "Page size must be between 1 and 50"
            );
        }

        if (!sortBy.equals("id")
                && !sortBy.equals("name")
                && !sortBy.equals("price")
                && !sortBy.equals("stockQuantity")) {

            throw new IllegalArgumentException(
                    "Invalid sort field: " + sortBy
            );
        }

        if (!direction.equalsIgnoreCase("asc")
                && !direction.equalsIgnoreCase("desc")) {

            throw new IllegalArgumentException(
                    "Sort direction must be 'asc' or 'desc'"
            );
        }

        Sort sort = direction.equalsIgnoreCase("desc")
                ? Sort.by(sortBy).descending()
                : Sort.by(sortBy).ascending();

        Pageable pageable = PageRequest.of(page, size, sort);

        return productRepository.findAll(pageable)
                .map(this::convertToResponse);
    }


    // =========================================================
    // SEARCH PRODUCTS
    // =========================================================

    public List<ProductResponse> searchProducts(String keyword) {

        return productRepository.findByNameContainingIgnoreCase(keyword)
                .stream()
                .map(this::convertToResponse)
                .toList();
    }


    // =========================================================
    // GET LOGGED-IN SELLER'S PRODUCTS
    // =========================================================

    public List<ProductResponse> getMyProducts() {

        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        String email = authentication.getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "User not found with email: " + email
                ));

        Seller seller = sellerRepository.findByUserId(user.getId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Seller profile not found for user: " + user.getId()
                ));

        return productRepository.findBySellerId(seller.getId())
                .stream()
                .map(this::convertToResponse)
                .toList();
    }


    // =========================================================
    // CREATE PRODUCT
    // =========================================================

    public ProductResponse createProduct(ProductRequest request) {

        Category category = categoryRepository
                .findById(request.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Category not found with id: "
                                + request.getCategoryId()
                ));

        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        String email = authentication.getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "User not found with email: " + email
                ));

        Seller seller = sellerRepository.findByUserId(user.getId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Seller profile not found for user: " + user.getId()
                ));

        Product product = new Product();

        product.setName(request.getName());
        product.setDescription(request.getDescription());
        product.setPrice(request.getPrice());
        product.setStockQuantity(request.getStockQuantity());

        // NEW: Save product image URL
        product.setImageUrl(request.getImageUrl());

        product.setCategory(category);

        // Connect product with logged-in seller
        product.setSeller(seller);

        Product savedProduct = productRepository.save(product);

        return convertToResponse(savedProduct);
    }


    // =========================================================
    // GET PRODUCT BY ID
    // =========================================================

    public ProductResponse getProductById(Long id) {

        Product product = productRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Product not found with id: " + id
                        )
                );

        return convertToResponse(product);
    }


    // =========================================================
    // UPDATE PRODUCT
    // =========================================================

    public ProductResponse updateProduct(
            Long id,
            ProductRequest request) {

        Product existingProduct = productRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Product not found with id: " + id
                        ));

        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        String email = authentication.getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "User not found with email: " + email
                ));

        Seller seller = sellerRepository.findByUserId(user.getId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Seller profile not found for user: " + user.getId()
                ));

        // Check product ownership
        if (existingProduct.getSeller() == null ||
                !existingProduct.getSeller().getId().equals(seller.getId())) {

            throw new org.springframework.security.access.AccessDeniedException(
                    "You are not allowed to update this product"
            );
        }

        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Category not found with id: "
                                        + request.getCategoryId()
                        ));

        existingProduct.setName(request.getName());
        existingProduct.setDescription(request.getDescription());
        existingProduct.setPrice(request.getPrice());
        existingProduct.setStockQuantity(request.getStockQuantity());

        // NEW: Update product image URL
        existingProduct.setImageUrl(request.getImageUrl());

        existingProduct.setCategory(category);

        Product updatedProduct =
                productRepository.save(existingProduct);

        return convertToResponse(updatedProduct);
    }


    // =========================================================
    // DELETE PRODUCT
    // =========================================================
// =========================================================
// QUICK UPDATE PRODUCT STOCK
// =========================================================

    public ProductResponse updateStock(Long id, Integer quantity) {

        if (quantity == null) {
            throw new IllegalArgumentException(
                    "Stock quantity is required"
            );
        }

        if (quantity < 0) {
            throw new IllegalArgumentException(
                    "Stock quantity cannot be negative"
            );
        }

        Product existingProduct = productRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Product not found with id: " + id
                        ));

        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        String email = authentication.getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "User not found with email: " + email
                        ));

        Seller seller = sellerRepository.findByUserId(user.getId())
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Seller profile not found for user: "
                                        + user.getId()
                        ));

        // Check product ownership
        if (existingProduct.getSeller() == null ||
                !existingProduct.getSeller()
                        .getId()
                        .equals(seller.getId())) {

            throw new org.springframework.security.access.AccessDeniedException(
                    "You are not allowed to update this product"
            );
        }

        // Update only stock quantity
        existingProduct.setStockQuantity(quantity);

        Product updatedProduct =
                productRepository.save(existingProduct);

        return convertToResponse(updatedProduct);
    }
    public void deleteProduct(Long id) {

        Product existingProduct = productRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Product not found with id: " + id
                        ));

        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        String email = authentication.getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "User not found with email: " + email
                ));

        Seller seller = sellerRepository.findByUserId(user.getId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Seller profile not found for user: " + user.getId()
                ));

        // Check product ownership
        if (existingProduct.getSeller() == null ||
                !existingProduct.getSeller().getId().equals(seller.getId())) {

            throw new org.springframework.security.access.AccessDeniedException(
                    "You are not allowed to delete this product"
            );
        }

        productRepository.delete(existingProduct);
    }


    // =========================================================
    // CONVERT ENTITY TO RESPONSE DTO
    // =========================================================

    public List<ProductResponse> getProductsBySeller(Long sellerId) {

        return productRepository.findBySellerId(sellerId)
                .stream()
                .map(this::convertToResponse)
                .toList();
    }

    private ProductResponse convertToResponse(Product product) {

        Long categoryId = null;
        String categoryName = null;

        if (product.getCategory() != null) {
            categoryId = product.getCategory().getId();
            categoryName = product.getCategory().getName();
        }

        Long sellerId = null;
        String sellerName = null;
        String storeName = null;

        if (product.getSeller() != null) {

            sellerId = product.getSeller().getId();
            storeName = product.getSeller().getStoreName();

            if (product.getSeller().getUser() != null) {
                sellerName = product.getSeller().getUser().getName();
            }
        }

        return new ProductResponse(
                product.getId(),
                product.getName(),
                product.getDescription(),
                product.getPrice(),
                product.getStockQuantity(),
                product.getImageUrl(),
                categoryId,
                categoryName,
                sellerId,
                sellerName,
                storeName
        );
    }
}