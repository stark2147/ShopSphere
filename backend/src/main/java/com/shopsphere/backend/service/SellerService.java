package com.shopsphere.backend.service;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import com.shopsphere.backend.dto.SellerRequest;
import com.shopsphere.backend.dto.SellerResponse;
import com.shopsphere.backend.entity.Role;
import com.shopsphere.backend.entity.Seller;
import com.shopsphere.backend.entity.User;
import com.shopsphere.backend.exception.ResourceNotFoundException;
import com.shopsphere.backend.repository.SellerRepository;
import com.shopsphere.backend.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.security.crypto.password.PasswordEncoder;
import java.util.List;

@Service
public class SellerService {

    private final SellerRepository sellerRepository;
    private final UserRepository userRepository;

    private final PasswordEncoder passwordEncoder;
    public SellerService(
            SellerRepository sellerRepository,
            UserRepository userRepository,
            PasswordEncoder passwordEncoder) {

        this.sellerRepository = sellerRepository;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    // Register a new seller
    @Transactional
    public SellerResponse registerSeller(SellerRequest request) {

        // 1. Check if email is already registered
        User existingUser = userRepository
                .findByEmail(request.getEmail())
                .orElse(null);

        if (existingUser != null) {
            throw new RuntimeException("Email is already registered");
        }

        // 2. Create User
        User user = new User();

        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(
                passwordEncoder.encode(request.getPassword())
        );

        // Seller registration gets SELLER role
        user.setRole(Role.SELLER);

        User savedUser = userRepository.save(user);

        // 3. Create Seller profile
        Seller seller = new Seller();

        seller.setStoreName(request.getStoreName());
        seller.setDescription(request.getDescription());
        seller.setStoreImageUrl(null);

        // Seller needs admin approval
        seller.setApproved(false);

        // Connect Seller with User
        seller.setUser(savedUser);

        // 4. Save Seller
        Seller savedSeller = sellerRepository.save(seller);

        // 5. Return response
        return convertToResponse(savedSeller);
    }

    public SellerResponse getMySellerProfile() {

        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        String email = authentication.getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Logged-in user not found"
                        )
                );

        Seller seller = sellerRepository.findByUserId(user.getId())
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Seller profile not found"
                        )
                );

        return convertToResponse(seller);
    }
    // Update logged-in seller profile
    @Transactional
    public SellerResponse updateMySellerProfile(SellerRequest request) {

        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        String email = authentication.getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Logged-in user not found"
                        )
                );

        Seller seller = sellerRepository.findByUserId(user.getId())
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Seller profile not found"
                        )
                );

        // Update user information
        user.setName(request.getName());
        user.setEmail(request.getEmail());

        // Update seller/store information
        seller.setStoreName(request.getStoreName());
        seller.setDescription(request.getDescription());
        seller.setStoreImageUrl(request.getStoreImageUrl());

        userRepository.save(user);

        Seller updatedSeller = sellerRepository.save(seller);

        return convertToResponse(updatedSeller);
    }

    // Get all sellers
    public List<SellerResponse> getAllSellers() {

        return sellerRepository.findAll()
                .stream()
                .map(this::convertToResponse)
                .toList();
    }

    // Get seller by ID
    public SellerResponse getSellerById(Long id) {

        Seller seller = sellerRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Seller not found with id: " + id
                        )
                );

        return convertToResponse(seller);
    }

    // Approve seller
    public SellerResponse approveSeller(Long id) {

        Seller seller = sellerRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Seller not found with id: " + id
                        )
                );

        seller.setApproved(true);

        Seller updatedSeller = sellerRepository.save(seller);

        return convertToResponse(updatedSeller);
    }

    // Convert Seller Entity to SellerResponse
    private SellerResponse convertToResponse(Seller seller) {

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
}