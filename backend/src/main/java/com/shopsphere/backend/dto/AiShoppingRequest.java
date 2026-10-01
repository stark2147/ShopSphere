package com.shopsphere.backend.dto;

import jakarta.validation.constraints.NotBlank;

public class AiShoppingRequest {

    @NotBlank(message = "Question cannot be empty")
    private String question;

    public AiShoppingRequest() {
    }

    public AiShoppingRequest(String question) {
        this.question = question;
    }

    public String getQuestion() {
        return question;
    }

    public void setQuestion(String question) {
        this.question = question;
    }
}