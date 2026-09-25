package com.shopsphere.backend.controller;

import com.shopsphere.backend.dto.UserRequest;
import com.shopsphere.backend.dto.UserResponse;
import com.shopsphere.backend.service.UserService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/register")
    public UserResponse registerUser(
            @Valid @RequestBody UserRequest request) {

        return userService.registerUser(request);
    }
}