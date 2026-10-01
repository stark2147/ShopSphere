package com.shopsphere.backend.ai;

import org.springframework.ai.document.Document;
import org.springframework.ai.vectorstore.VectorStore;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProductVectorStoreService {

    private final ProductEmbeddingService productEmbeddingService;
    private final VectorStore vectorStore;

    public ProductVectorStoreService(
            ProductEmbeddingService productEmbeddingService,
            VectorStore vectorStore
    ) {
        this.productEmbeddingService = productEmbeddingService;
        this.vectorStore = vectorStore;
    }

    public void indexAllProducts() {

        List<Document> documents =
                productEmbeddingService.createProductDocuments();

        if (documents.isEmpty()) {
            return;
        }

        vectorStore.add(documents);
    }
}