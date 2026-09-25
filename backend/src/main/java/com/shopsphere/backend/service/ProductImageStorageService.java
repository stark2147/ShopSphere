package com.shopsphere.backend.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Set;
import java.util.UUID;

@Service
public class ProductImageStorageService {

    @Value("${app.upload.dir:uploads/products}")
    private String uploadDirectory;

    private static final Set<String> ALLOWED_TYPES =
            Set.of(
                    "image/jpeg",
                    "image/png",
                    "image/webp"
            );


    // =========================================================
    // STORE PRODUCT IMAGE
    // =========================================================

    public String store(MultipartFile file) {

        // Check file
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException(
                    "Product image is required."
            );
        }


        // Check content type
        if (!ALLOWED_TYPES.contains(file.getContentType())) {
            throw new IllegalArgumentException(
                    "Only JPG, JPEG, PNG and WEBP images are allowed."
            );
        }


        // Check file size
        if (file.getSize() > 5 * 1024 * 1024) {
            throw new IllegalArgumentException(
                    "Product image must be 5 MB or smaller."
            );
        }


        // Get original filename
        String originalName =
                file.getOriginalFilename() == null
                        ? ""
                        : file.getOriginalFilename();


        // Get extension
        String extension = "";

        int dotIndex = originalName.lastIndexOf('.');

        if (dotIndex >= 0) {
            extension =
                    originalName
                            .substring(dotIndex)
                            .toLowerCase();
        }


        // Check extension
        if (!Set.of(
                ".jpg",
                ".jpeg",
                ".png",
                ".webp"
        ).contains(extension)) {

            throw new IllegalArgumentException(
                    "Unsupported image extension."
            );
        }


        // Generate unique filename
        String filename =
                UUID.randomUUID() + extension;


        try {

            // Create upload directory
            Path directory =
                    Paths
                            .get(uploadDirectory)
                            .toAbsolutePath()
                            .normalize();

            Files.createDirectories(directory);


            // Create target file
            Path target =
                    directory
                            .resolve(filename)
                            .normalize();


            // Security check
            if (!target.getParent().equals(directory)) {
                throw new IllegalArgumentException(
                        "Invalid image path."
                );
            }


            // Save image
            try (InputStream inputStream =
                         file.getInputStream()) {

                Files.copy(
                        inputStream,
                        target,
                        StandardCopyOption.REPLACE_EXISTING
                );
            }


            // Return generated filename
            return filename;

        } catch (IOException exception) {

            throw new RuntimeException(
                    "Unable to store product image.",
                    exception
            );
        }
    }
}