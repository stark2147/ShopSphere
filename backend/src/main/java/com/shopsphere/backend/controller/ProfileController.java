package com.shopsphere.backend.controller;

import com.shopsphere.backend.dto.ProfileResponse;
import com.shopsphere.backend.dto.UpdateProfileRequest;
import com.shopsphere.backend.service.ProfileService;

import jakarta.validation.Valid;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/profile")
public class ProfileController {

    private final ProfileService profileService;

    public ProfileController(ProfileService profileService) {
        this.profileService = profileService;
    }

    @GetMapping
    public ProfileResponse getProfile() {

        return profileService.getProfile();
    }

    @PutMapping
    public ProfileResponse updateProfile(
            @Valid @RequestBody UpdateProfileRequest request
    ) {

        return profileService.updateProfile(request);
    }
}