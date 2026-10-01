package com.shopsphere.backend.ai;

import org.springframework.ai.document.Document;
import org.springframework.ai.vectorstore.SearchRequest;
import org.springframework.ai.vectorstore.VectorStore;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProductRagService {

    private final VectorStore vectorStore;
    private final ChatClient chatClient;

    public ProductRagService(
            VectorStore vectorStore,
            ChatClient.Builder chatClientBuilder) {

        this.vectorStore = vectorStore;
        this.chatClient = chatClientBuilder.build();
    }

    public String ask(String question) {

        SearchRequest searchRequest = SearchRequest.builder()
                .query(question)
                .topK(5)
                .build();

        List<Document> documents =
                vectorStore.similaritySearch(searchRequest);

        String productContext = documents.stream()
                .map(Document::getText)
                .collect(Collectors.joining("\n\n"));

        String prompt = """
                You are ShopSphere's AI shopping assistant.

                Your job is to answer the user's question using ONLY
                the product information provided in the Product Context.

                IMPORTANT RULES:

                1. Never invent or guess product information.

                2. Never change any product information.

                3. When discussing a product, preserve the exact:
                   - Product ID
                   - Product Name
                   - Description
                   - Price
                   - Stock Available
                   - Category

                4. Never omit the price when the price is available
                   in the Product Context.

                5. Never omit the stock quantity when it is available.

                6. If multiple products are relevant, clearly separate
                   each product.

                7. When you mention a product, include its exact
                   Product ID from the Product Context using this format:

                   [PRODUCT_ID:123]

                8. Never create, guess, or modify a Product ID.

                9. If the requested information is not present in the
                   Product Context, clearly say that the information
                   is not available.

                10. Keep the response simple and easy to understand.

                For product information, prefer this format:

                Product Name: <exact product name>
                Description: <exact description>
                Price: ₹<exact price>
                Stock Available: <exact stock>
                Category: <exact category>
                [PRODUCT_ID:<exact product id>]

                Product Context:
                %s

                User Question:
                %s
                """.formatted(productContext, question);

        try {

            String response = chatClient
                    .prompt()
                    .user(prompt)
                    .call()
                    .content();

            return response;

        } catch (Exception e) {

            System.out.println("========================================");
            System.out.println("GEMINI AI REQUEST FAILED");
            System.out.println("========================================");

            e.printStackTrace();

            System.out.println("========================================");

            return "Sorry, the ShopSphere AI assistant is "
                    + "temporarily unavailable. Please try again "
                    + "in a moment.";
        }
    }
}