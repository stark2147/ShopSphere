package com.shopsphere.backend.controller;

import com.shopsphere.backend.ai.ProductSearchService;
import org.springframework.ai.document.Document;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/ai/search")
public class ProductSearchController {

    private final ProductSearchService productSearchService;

    public ProductSearchController(
            ProductSearchService productSearchService) {
        this.productSearchService = productSearchService;
    }

    @GetMapping
    public List<Document> searchProducts(
            @RequestParam String query) {

        return productSearchService.searchProducts(query);
    }
}