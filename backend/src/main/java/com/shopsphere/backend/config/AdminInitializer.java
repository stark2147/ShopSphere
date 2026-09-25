package com.shopsphere.backend.config;

import com.shopsphere.backend.entity.Role;
import com.shopsphere.backend.entity.User;
import com.shopsphere.backend.repository.UserRepository;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class AdminInitializer {

    @Bean
    CommandLineRunner createAdmin(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder) {

        return args -> {

            String adminEmail = "admin@shopsphere.com";

            if (userRepository.findByEmail(adminEmail).isEmpty()) {

                User admin = new User();

                admin.setName("Admin");
                admin.setEmail(adminEmail);
                admin.setPassword(
                        passwordEncoder.encode("Admin@123")
                );
                admin.setRole(Role.ADMIN);

                userRepository.save(admin);

                System.out.println(
                        "===================================="
                );
                System.out.println(
                        "ShopSphere ADMIN created successfully"
                );
                System.out.println(
                        "Email: admin@shopsphere.com"
                );
                System.out.println(
                        "===================================="
                );

            } else {

                System.out.println(
                        "ShopSphere ADMIN already exists."
                );
            }
        };
    }
}