package com.shopsphere.backend.controller;

import com.shopsphere.backend.ai.ProductRagService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/ai")
public class ProductRagController {

    private final ProductRagService productRagService;

    public ProductRagController(ProductRagService productRagService) {
        this.productRagService = productRagService;
    }

    @GetMapping("/ask")
    public String ask(
            @RequestParam String question) {

        return productRagService.ask(question);
    }
}