package com.shopsphere.backend.ai;

import org.springframework.ai.document.Document;
import org.springframework.ai.vectorstore.SearchRequest;
import org.springframework.ai.vectorstore.VectorStore;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProductSearchService {

    private final VectorStore vectorStore;

    public ProductSearchService(VectorStore vectorStore) {
        this.vectorStore = vectorStore;
    }

    public List<Document> searchProducts(String query) {

        SearchRequest searchRequest = SearchRequest.builder()
                .query(query)
                .topK(5)
                .build();

        return vectorStore.similaritySearch(searchRequest);
    }
}