package com.shopsphere.backend.ai;

import com.shopsphere.backend.entity.Product;
import com.shopsphere.backend.repository.ProductRepository;
import org.springframework.ai.document.Document;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class ProductEmbeddingService {

    private final ProductRepository productRepository;

    public ProductEmbeddingService(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    public List<Document> createProductDocuments() {

        List<Product> products = productRepository.findAll();

        List<Document> documents = new ArrayList<>();

        for (Product product : products) {

            String categoryName = "Unknown";

            if (product.getCategory() != null) {
                categoryName = product.getCategory().getName();
            }

            String content = """
        Product ID: %s
        Product Name: %s
        Description: %s
        Price: ₹%s
        Stock Available: %s
        Category: %s
        """.formatted(
                    product.getId(),
                    product.getName(),
                    product.getDescription(),
                    product.getPrice(),
                    product.getStockQuantity(),
                    categoryName
            );

            Document document = new Document(
                    content
            );

            document.getMetadata().put("productId", product.getId());
            document.getMetadata().put("productName", product.getName());
            document.getMetadata().put("price", product.getPrice().doubleValue());
            document.getMetadata().put("stockQuantity", product.getStockQuantity());
            document.getMetadata().put("category", categoryName);

            documents.add(document);
        }

        return documents;
    }
}