package com.shopsphere.backend.service;

import com.shopsphere.backend.entity.Review;
import com.shopsphere.backend.repository.ReviewRepository;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class AiReviewSummaryService {

    private final ReviewRepository reviewRepository;
    private final ChatClient chatClient;

    public AiReviewSummaryService(
            ReviewRepository reviewRepository,
            ChatClient.Builder chatClientBuilder
    ) {
        this.reviewRepository = reviewRepository;
        this.chatClient = chatClientBuilder.build();
    }

    // =========================================================
    // GENERATE AI REVIEW SUMMARY
    // =========================================================

    public String generateSummary(Long productId) {

        // -----------------------------------------------------
        // GET REVIEWS
        // -----------------------------------------------------

        List<Review> reviews =
                reviewRepository.findByProductId(productId);

        // -----------------------------------------------------
        // NO REVIEWS
        // -----------------------------------------------------

        if (reviews.isEmpty()) {

            return "There are no customer reviews for this product yet.";
        }

        // -----------------------------------------------------
        // PREPARE REVIEW DATA
        // -----------------------------------------------------

        String reviewContext = reviews.stream()
                .map(review -> """
                        Rating: %s/5
                        Review: %s
                        """.formatted(
                        review.getRating(),
                        review.getComment()
                ))
                .collect(Collectors.joining("\n"));

        // -----------------------------------------------------
        // AI PROMPT
        // -----------------------------------------------------

        String prompt = """
                You are ShopSphere's AI review summarizer.

                Summarize the customer reviews provided below.

                IMPORTANT RULES:

                1. Use ONLY the reviews provided.
                2. Do not invent information.
                3. Do not add product specifications.
                4. Do not make claims that are not supported by
                   the customer reviews.
                5. Do not mention customer names.
                6. Keep the summary concise and useful.
                7. Clearly mention common positive points.
                8. Clearly mention common negative points if present.
                9. If there are mixed opinions, mention that.
                10. Do not use emojis.

                Use this structure:

                Overall Summary:
                <2-3 sentences>

                What Customers Like:
                - <point>
                - <point>

                Common Concerns:
                - <point>
                - <point>

                Customer Reviews:
                %s
                """.formatted(reviewContext);

        // -----------------------------------------------------
        // CALL GEMINI
        // -----------------------------------------------------

        try {

            return chatClient
                    .prompt()
                    .user(prompt)
                    .call()
                    .content();

        } catch (Exception e) {

            System.err.println(
                    "AI review summary generation failed: "
                            + e.getMessage()
            );

            return "Sorry, AI review summarization is temporarily unavailable. Please try again later.";
        }
    }
}