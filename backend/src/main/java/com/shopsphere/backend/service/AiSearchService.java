package com.shopsphere.backend.service;

import com.shopsphere.backend.dto.AiSearchCriteria;
import com.shopsphere.backend.dto.AiSearchProductResponse;
import com.shopsphere.backend.entity.Product;
import com.shopsphere.backend.repository.ProductRepository;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class AiSearchService {

    private final ProductRepository productRepository;
    private final AiSearchParsingService aiSearchParsingService;

    public AiSearchService(
            ProductRepository productRepository,
            AiSearchParsingService aiSearchParsingService
    ) {
        this.productRepository = productRepository;
        this.aiSearchParsingService = aiSearchParsingService;
    }

    public List<AiSearchProductResponse> searchProducts(String query) {

        if (query == null || query.isBlank()) {
            return List.of();
        }

        AiSearchCriteria criteria =
                aiSearchParsingService.parseQuery(query);

        System.out.println("========================================");
        System.out.println("AI SEARCH CRITERIA");
        System.out.println("Keyword: " + criteria.getKeyword());
        System.out.println("Min Price: " + criteria.getMinPrice());
        System.out.println("Max Price: " + criteria.getMaxPrice());
        System.out.println("Category: " + criteria.getCategory());
        System.out.println("========================================");

        List<Product> products =
                productRepository.searchProducts(
                        null,
                        criteria.getMinPrice(),
                        criteria.getMaxPrice(),
                        criteria.getCategory()
                );

        String keyword = criteria.getKeyword();

        if (keyword != null && !keyword.isBlank()) {

            String[] words = keyword
                    .toLowerCase()
                    .trim()
                    .split("\\s+");

            products = products.stream()
                    .filter(product -> {

                        String name = product.getName() == null
                                ? ""
                                : product.getName().toLowerCase();

                        String description = product.getDescription() == null
                                ? ""
                                : product.getDescription().toLowerCase();

                        String searchableText =
                                name + " " + description;

                        for (String word : words) {

                            String normalizedWord = word;

                            if (normalizedWord.endsWith("s")
                                    && normalizedWord.length() > 3) {
                                normalizedWord =
                                        normalizedWord.substring(
                                                0,
                                                normalizedWord.length() - 1
                                        );
                            }

                            if (!searchableText.contains(normalizedWord)) {
                                return false;
                            }
                        }

                        return true;
                    })
                    .toList();
        }

        return products.stream()
                .map(product -> {

                    String categoryName = null;

                    if (product.getCategory() != null) {
                        categoryName =
                                product.getCategory().getName();
                    }

                    return new AiSearchProductResponse(
                            product.getId(),
                            product.getName(),
                            product.getDescription(),
                            product.getPrice().doubleValue(),
                            product.getStockQuantity(),
                            categoryName,
                            product.getImageUrl()
                    );
                })
                .toList();
    }
}