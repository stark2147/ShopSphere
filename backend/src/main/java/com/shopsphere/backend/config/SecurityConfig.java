package com.shopsphere.backend.config;
import org.springframework.beans.factory.annotation.Value;
import com.shopsphere.backend.security.CustomUserDetailsService;
import com.shopsphere.backend.security.JwtAuthenticationFilter;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

import org.springframework.http.HttpMethod;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;


@Configuration
public class SecurityConfig {

    private final CustomUserDetailsService customUserDetailsService;
    private final JwtAuthenticationFilter jwtAuthenticationFilter;


    public SecurityConfig(
            CustomUserDetailsService customUserDetailsService,
            JwtAuthenticationFilter jwtAuthenticationFilter) {

        this.customUserDetailsService = customUserDetailsService;
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
    }

    @Value("${app.cors.allowed-origin:http://localhost:5173}")
    private String allowedOrigin;
    // ============================================================
    // PASSWORD ENCODER
    // ============================================================

    @Bean
    public PasswordEncoder passwordEncoder() {

        return new BCryptPasswordEncoder();
    }


    // ============================================================
    // AUTHENTICATION PROVIDER
    // ============================================================

    @Bean
    public AuthenticationProvider authenticationProvider() {

        DaoAuthenticationProvider provider =
                new DaoAuthenticationProvider(customUserDetailsService);

        provider.setPasswordEncoder(passwordEncoder());

        return provider;
    }


    // ============================================================
    // AUTHENTICATION MANAGER
    // ============================================================

    @Bean
    public AuthenticationManager authenticationManager(
            AuthenticationConfiguration configuration)
            throws Exception {

        return configuration.getAuthenticationManager();
    }


    // ============================================================
    // SECURITY FILTER CHAIN
    // ============================================================

    @Bean
    public SecurityFilterChain securityFilterChain(
            HttpSecurity http)
            throws Exception {

        http

                // ------------------------------------------------
                // Disable CSRF
                // ------------------------------------------------

                .csrf(AbstractHttpConfigurer::disable)

                .cors(cors -> {})

                .authenticationProvider(authenticationProvider())


                // ------------------------------------------------
                // Authorization Rules
                // ------------------------------------------------

                .authorizeHttpRequests(auth -> auth

                                .requestMatchers(
                                        HttpMethod.OPTIONS,
                                        "/**"
                                ).permitAll()
                        // ====================================================
                        // PUBLIC ENDPOINTS
                        // ====================================================

                        // Public product reviews
                        .requestMatchers(
                                HttpMethod.GET,
                                "/api/reviews/product/**"
                        )
                        .permitAll()


                        // User / Seller registration and login
                        .requestMatchers(
                                "/api/users/register",
                                "/api/sellers/register",
                                "/api/auth/login"
                        )
                        .permitAll()

                                .requestMatchers(
                                        HttpMethod.POST,
                                        "/api/ai/products/index"
                                ).hasRole("ADMIN")

                                .requestMatchers(
                                        HttpMethod.POST,
                                        "/api/ai/search"
                                )
                                .permitAll()

                                .requestMatchers(
                                        HttpMethod.GET,
                                        "/api/ai/ask"
                                )
                                .permitAll()

                                .requestMatchers(
                                        HttpMethod.POST,
                                        "/api/ai/products/generate-description"
                                ).hasRole("SELLER")

                                .requestMatchers(
                                        HttpMethod.POST,
                                        "/api/ai/shopping/ask"
                                )
                                .permitAll()

                                .requestMatchers("/error").permitAll()
                        
                        // ====================================================
                        // ADMIN ENDPOINTS
                        // ====================================================

                        .requestMatchers(
                                "/api/admin/**"
                        )
                        .hasRole("ADMIN")


                        // Seller approval → ADMIN only
                        .requestMatchers(
                                HttpMethod.PUT,
                                "/api/sellers/*/approve"
                        )
                        .hasRole("ADMIN")


                        // ====================================================
                        // SELLER ORDER MANAGEMENT
                        // ====================================================

                        .requestMatchers(
                                HttpMethod.GET,
                                "/api/orders/seller-orders"
                        )
                        .hasRole("SELLER")


                        .requestMatchers(
                                HttpMethod.PUT,
                                "/api/seller-orders/**"
                        )
                        .hasRole("SELLER")


                        // ====================================================
                        // PUBLIC PRODUCT ENDPOINTS
                        // ====================================================

                        // Public seller/store catalog
                        // Example:
                        // GET /api/products/seller/3
                        .requestMatchers(
                                HttpMethod.GET,
                                "/api/products/seller/**"
                        )
                        .permitAll()


                        // All product GET requests are public.
                        // This includes:
                        // GET /api/products
                        // GET /api/products/search
                        // GET /api/products/{id}
                        .requestMatchers(
                                HttpMethod.GET,
                                "/api/products/**"
                        )
                        .permitAll()


                        // ====================================================
                        // PRODUCT MANAGEMENT
                        // ====================================================

                                // Product image upload → SELLER only
                                .requestMatchers(
                                        HttpMethod.POST,
                                        "/api/products/upload-image"
                                )
                                .hasRole("SELLER")

// Product creation → SELLER only
                                .requestMatchers(
                                        HttpMethod.POST,
                                        "/api/products"
                                )
                                .hasRole("SELLER")
                        // Only SELLER can update products
                        .requestMatchers(
                                HttpMethod.PUT,
                                "/api/products/**"
                        )
                        .hasRole("SELLER")


                        // Only SELLER can delete products
                        .requestMatchers(
                                HttpMethod.DELETE,
                                "/api/products/**"
                        )
                        .hasRole("SELLER")


                        // ====================================================
                        // CUSTOMER ORDER ENDPOINTS
                        // ====================================================

                        // Customer can cancel their own order
                        .requestMatchers(
                                HttpMethod.PUT,
                                "/api/orders/**"
                        )
                        .hasRole("CUSTOMER")


                        // ====================================================
                        // CUSTOMER PAYMENT ENDPOINTS
                        // ====================================================

                        // Only CUSTOMER can create payments
                        .requestMatchers(
                                HttpMethod.POST,
                                "/api/payments/create/**"
                        )
                        .hasRole("CUSTOMER")


                        // Payment verification requires login.
                        // PaymentService checks that the payment/order
                        // belongs to the authenticated user.
                        .requestMatchers(
                                HttpMethod.POST,
                                "/api/payments/verify"
                        )
                        .authenticated()


                        // ====================================================
                        // EVERYTHING ELSE
                        // ====================================================

                                // ====================================================
// SELLER ANALYTICS
// ====================================================

                                .requestMatchers(
                                        HttpMethod.GET,
                                        "/api/sellers/analytics"
                                )
                                .hasRole("SELLER")

                                // ====================================================
// PUBLIC PRODUCT IMAGES
// ====================================================

                                .requestMatchers(
                                        "/uploads/products/**"
                                )
                                .permitAll()
                        .anyRequest()
                        .authenticated()
                )


                // ------------------------------------------------
                // JWT FILTER
                // ------------------------------------------------

                .addFilterBefore(
                        jwtAuthenticationFilter,
                        UsernamePasswordAuthenticationFilter.class
                );


        return http.build();
    }


    // ============================================================
    // CORS CONFIGURATION
    // ============================================================
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {

        CorsConfiguration configuration = new CorsConfiguration();

        configuration.setAllowedOrigins(
                List.of(allowedOrigin)
        );

        configuration.setAllowedMethods(
                List.of(
                        "GET",
                        "POST",
                        "PUT",
                        "DELETE",
                        "OPTIONS"
                )
        );

        configuration.setAllowedHeaders(
                List.of("*")
        );

        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source =
                new UrlBasedCorsConfigurationSource();

        source.registerCorsConfiguration(
                "/**",
                configuration
        );

        return source;
    }

}