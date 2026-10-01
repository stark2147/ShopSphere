package com.shopsphere.backend.controller;

import com.shopsphere.backend.ai.ProductVectorStoreService;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/ai/products")
public class ProductEmbeddingController {

    private final ProductVectorStoreService productVectorStoreService;

    public ProductEmbeddingController(
            ProductVectorStoreService productVectorStoreService
    ) {
        this.productVectorStoreService = productVectorStoreService;
    }

    @PostMapping("/index")
    public String indexProducts() {

        productVectorStoreService.indexAllProducts();

        return "Products indexed successfully into Qdrant";
    }
}