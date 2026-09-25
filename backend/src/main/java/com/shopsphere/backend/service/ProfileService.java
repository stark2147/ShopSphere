package com.shopsphere.backend.service;

import com.shopsphere.backend.dto.ProfileResponse;
import com.shopsphere.backend.dto.UpdateProfileRequest;
import com.shopsphere.backend.entity.User;
import com.shopsphere.backend.exception.ResourceNotFoundException;
import com.shopsphere.backend.repository.UserRepository;

import jakarta.transaction.Transactional;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service
public class ProfileService {

    private final UserRepository userRepository;

    public ProfileService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    private User getAuthenticatedUser() {

        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        String email = authentication.getName();

        return userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new ResourceNotFoundException("User not found"));
    }

    @Transactional
    public ProfileResponse getProfile() {

        User user = getAuthenticatedUser();

        return convertToResponse(user);
    }

    @Transactional
    public ProfileResponse updateProfile(
            UpdateProfileRequest request
    ) {

        User user = getAuthenticatedUser();

        user.setName(request.getName());
        user.setPhoneNumber(request.getPhoneNumber());

        User updatedUser = userRepository.save(user);

        return convertToResponse(updatedUser);
    }

    private ProfileResponse convertToResponse(User user) {

        return new ProfileResponse(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getPhoneNumber(),
                user.getRole()
        );
    }
}