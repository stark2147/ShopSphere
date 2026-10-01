package com.shopsphere.backend.ai;

import com.shopsphere.backend.dto.AiProductDescriptionRequest;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.stereotype.Service;

@Service
public class AiProductDescriptionService {

    private final ChatClient chatClient;

    public AiProductDescriptionService(
            ChatClient.Builder chatClientBuilder) {

        this.chatClient = chatClientBuilder.build();
    }

    public String generateDescription(
            AiProductDescriptionRequest request) {

        String prompt = """
                You are an AI product description writer
                for an e-commerce website called ShopSphere.

                Create a professional and attractive product
                description using ONLY the information provided
                by the seller.

                Do not invent specifications, features, warranty,
                performance claims, prices, or other information.

                Product Name:
                %s

                Category:
                %s

                Key Points:
                %s

                Requirements:

                - Write 1 professional product description.
                - Keep it between 80 and 150 words.
                - Make it suitable for an e-commerce product page.
                - Clearly explain the important features.
                - Use natural and easy-to-understand language.
                - Do not use emojis.
                - Do not include a price.
                - Do not add information that was not provided.
                """.formatted(
                request.getProductName(),
                request.getCategory(),
                request.getKeyPoints()
        );

        try {

            return chatClient
                    .prompt()
                    .user(prompt)
                    .call()
                    .content();

        } catch (Exception e) {

            System.out.println("========================================");
            System.out.println("AI PRODUCT DESCRIPTION GENERATION FAILED");
            System.out.println("========================================");

            e.printStackTrace();

            System.out.println("========================================");

            return "Sorry, AI product description generation is "
                    + "temporarily unavailable. Please try again later.";
        }
    }
}