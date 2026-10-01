package com.shopsphere.backend.controller;

import com.shopsphere.backend.ai.ProductRagService;
import com.shopsphere.backend.dto.AiShoppingRequest;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/ai/shopping")
public class AiShoppingController {

    private final ProductRagService productRagService;

    public AiShoppingController(ProductRagService productRagService) {
        this.productRagService = productRagService;
    }

    @PostMapping("/ask")
    public String askShoppingAssistant(
            @Valid @RequestBody AiShoppingRequest request) {

        return productRagService.ask(request.getQuestion());
    }
}