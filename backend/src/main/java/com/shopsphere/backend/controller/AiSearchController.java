package com.shopsphere.backend.controller;

import com.shopsphere.backend.dto.AiSearchProductResponse;
import com.shopsphere.backend.dto.AiSearchRequest;
import com.shopsphere.backend.service.AiSearchService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/ai")
public class AiSearchController {

    private final AiSearchService aiSearchService;

    public AiSearchController(AiSearchService aiSearchService) {
        this.aiSearchService = aiSearchService;
    }

    @PostMapping("/search")
    public List<AiSearchProductResponse> searchProducts(
            @Valid @RequestBody AiSearchRequest request
    ) {

        return aiSearchService.searchProducts(
                request.getQuery()
        );
    }
}