package com.shopsphere.backend.controller;

import com.shopsphere.backend.ai.AiProductDescriptionService;
import com.shopsphere.backend.dto.AiProductDescriptionRequest;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/ai/products")
public class AiProductDescriptionController {

    private final AiProductDescriptionService aiProductDescriptionService;

    public AiProductDescriptionController(
            AiProductDescriptionService aiProductDescriptionService) {

        this.aiProductDescriptionService =
                aiProductDescriptionService;
    }

    @PostMapping("/generate-description")
    public String generateDescription(
            @Valid @RequestBody AiProductDescriptionRequest request) {

        return aiProductDescriptionService
                .generateDescription(request);
    }
}