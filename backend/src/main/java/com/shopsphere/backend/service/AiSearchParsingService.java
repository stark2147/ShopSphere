package com.shopsphere.backend.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.shopsphere.backend.dto.AiSearchCriteria;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.stereotype.Service;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
public class AiSearchParsingService {

    private final ChatClient chatClient;
    private final ObjectMapper objectMapper;

    public AiSearchParsingService(
            ChatClient.Builder chatClientBuilder
    ) {
        this.chatClient = chatClientBuilder.build();
        this.objectMapper = new ObjectMapper();
    }

    public AiSearchCriteria parseQuery(String query) {

        if (query == null || query.isBlank()) {
            return new AiSearchCriteria();
        }

        String prompt = """
        You are a product search query parser for ShopSphere.

        Convert the user's natural-language shopping query
        into JSON search criteria.

        Return ONLY valid JSON.
        Do not use markdown.
        Do not add explanations.

        JSON format:
        {
          "keyword": "string or null",
          "minPrice": number or null,
          "maxPrice": number or null,
          "category": "string or null"
        }

        IMPORTANT RULE:

        The "category" field must contain ONLY an actual
        ShopSphere product category.

        Product types such as:
        laptop
        phone
        smartphone
        mouse
        keyboard
        earbuds
        headphones
        speakers
        watch

        are PRODUCT TYPES, not database categories.

        Product types should be included in the "keyword"
        field instead.

        For example:

        User query:
        gaming laptop

        JSON:
        {
          "keyword": "gaming laptop",
          "minPrice": null,
          "maxPrice": null,
          "category": null
        }

        User query:
        Samsung phone

        JSON:
        {
          "keyword": "Samsung phone",
          "minPrice": null,
          "maxPrice": null,
          "category": null
        }

        User query:
        Dell mouse under 5000

        JSON:
        {
          "keyword": "Dell mouse",
          "minPrice": null,
          "maxPrice": 5000,
          "category": null
        }

        User query:
        phones between 20000 and 40000

        JSON:
        {
          "keyword": "phones",
          "minPrice": 20000,
          "maxPrice": 40000,
          "category": null
        }

        User query:
        electronics

        JSON:
        {
          "keyword": null,
          "minPrice": null,
          "maxPrice": null,
          "category": "electronics"
        }

        User query:
        electronics under 700000

        JSON:
        {
          "keyword": null,
          "minPrice": null,
          "maxPrice": 700000,
          "category": "electronics"
        }

        User query:
        Dell laptop

        JSON:
        {
          "keyword": "Dell laptop",
          "minPrice": null,
          "maxPrice": null,
          "category": null
        }

        User query:
        %s
        """.formatted(query);

        try {

            String response = chatClient
                    .prompt()
                    .user(prompt)
                    .call()
                    .content();

            String cleanedResponse = response
                    .replace("```json", "")
                    .replace("```", "")
                    .trim();

            AiSearchCriteria criteria = objectMapper.readValue(
                    cleanedResponse,
                    AiSearchCriteria.class
            );

            if (criteria.getKeyword() != null
                    && criteria.getCategory() != null
                    && criteria.getKeyword().trim()
                    .equalsIgnoreCase(criteria.getCategory().trim())) {

                criteria.setKeyword(null);
            }

            return criteria;

        } catch (Exception e) {

            System.err.println(
                    "AI search parsing failed: " + e.getMessage()
            );

            return fallbackParse(query);
        }
    }

    private AiSearchCriteria fallbackParse(String query) {

        AiSearchCriteria criteria = new AiSearchCriteria();

        String cleanedQuery = query.trim();

        /*
         * Detect:
         *
         * laptop under 700000
         * laptop below 700000
         * laptop less than 700000
         */

        Pattern maxPricePattern = Pattern.compile(
                "(?i)\\b(under|below|less than)\\s*[₹rs\\.]*\\s*(\\d+(?:\\.\\d+)?)"
        );

        Matcher maxPriceMatcher =
                maxPricePattern.matcher(cleanedQuery);

        if (maxPriceMatcher.find()) {

            Double maxPrice =
                    Double.parseDouble(maxPriceMatcher.group(2));

            criteria.setMaxPrice(maxPrice);

            cleanedQuery =
                    maxPriceMatcher.replaceAll("").trim();
        }

        /*
         * Detect:
         *
         * laptop above 50000
         * laptop over 50000
         * laptop more than 50000
         */

        Pattern minPricePattern = Pattern.compile(
                "(?i)\\b(above|over|more than)\\s*[₹rs\\.]*\\s*(\\d+(?:\\.\\d+)?)"
        );

        Matcher minPriceMatcher =
                minPricePattern.matcher(cleanedQuery);

        if (minPriceMatcher.find()) {

            Double minPrice =
                    Double.parseDouble(minPriceMatcher.group(2));

            criteria.setMinPrice(minPrice);

            cleanedQuery =
                    minPriceMatcher.replaceAll("").trim();
        }

        /*
         * Detect:
         *
         * laptop between 50000 and 80000
         */

        Pattern betweenPattern = Pattern.compile(
                "(?i)\\bbetween\\s*[₹rs\\.]*\\s*(\\d+(?:\\.\\d+)?)\\s*(?:and|-|to)\\s*[₹rs\\.]*\\s*(\\d+(?:\\.\\d+)?)"
        );

        Matcher betweenMatcher =
                betweenPattern.matcher(cleanedQuery);

        if (betweenMatcher.find()) {

            Double minPrice =
                    Double.parseDouble(betweenMatcher.group(1));

            Double maxPrice =
                    Double.parseDouble(betweenMatcher.group(2));

            criteria.setMinPrice(minPrice);
            criteria.setMaxPrice(maxPrice);

            cleanedQuery =
                    betweenMatcher.replaceAll("").trim();
        }

        /*
         * Remove common search words that are not useful
         * as product keywords.
         */

        cleanedQuery = cleanedQuery
                .replaceAll(
                        "(?i)\\b(under|below|above|over|less than|more than|between)\\b",
                        ""
                )
                .replaceAll("\\s+", " ")
                .trim();

        String lowerQuery = cleanedQuery.toLowerCase();

        if (lowerQuery.equals("electronics")) {
            criteria.setCategory("electronics");
            criteria.setKeyword(null);
            return criteria;
        }

        if (!cleanedQuery.isEmpty()) {
            criteria.setKeyword(cleanedQuery);
        }

        return criteria;
    }
}