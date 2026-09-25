package com.shopsphere.backend.service;
import com.shopsphere.backend.entity.Role;
import com.shopsphere.backend.dto.UserRequest;
import com.shopsphere.backend.dto.UserResponse;
import com.shopsphere.backend.entity.Role;
import com.shopsphere.backend.entity.User;
import org.springframework.security.crypto.password.PasswordEncoder;
import com.shopsphere.backend.repository.UserRepository;
import org.springframework.stereotype.Service;
@Service
public class UserService {

    private final UserRepository userRepository;

    private final PasswordEncoder passwordEncoder;

    public UserService(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder) {

        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }
    // Register a new user
    public UserResponse registerUser(UserRequest request) {

        User existingUser = userRepository
                .findByEmail(request.getEmail())
                .orElse(null);

        if (existingUser != null) {
            throw new RuntimeException("Email is already registered");
        }

        User user = new User();

        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(
                passwordEncoder.encode(request.getPassword())
        );
        // Every normal registration starts as CUSTOMER
        user.setRole(Role.CUSTOMER);

        User savedUser = userRepository.save(user);

        return convertToResponse(savedUser);
    }

    // Find user by email
    public User findByEmail(String email) {

        return userRepository.findByEmail(email)
                .orElse(null);
    }

    // Convert User Entity to UserResponse DTO
    private UserResponse convertToResponse(User user) {

        return new UserResponse(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getRole()
        );
    }
}