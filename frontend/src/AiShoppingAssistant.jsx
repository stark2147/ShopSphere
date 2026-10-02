import { useState } from "react";
import { Link } from "react-router-dom";
import api from "./api";
import "./App.css";

const AiShoppingAssistant = () => {

    const [isOpen, setIsOpen] = useState(false);
    const [question, setQuestion] = useState("");
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);

    const quickQuestions = [
        "I want a gaming laptop",
        "Show me products under ₹50,000",
        "Which product has the highest stock?"
    ];


    const askAssistant = async (questionText = question) => {

        if (!questionText.trim() || loading) {
            return;
        }

        const userQuestion = questionText.trim();

        setMessages((previousMessages) => [
            ...previousMessages,
            {
                type: "user",
                text: userQuestion
            }
        ]);

        setQuestion("");
        setLoading(true);

        try {

            const response = await api.post(
                "/api/ai/shopping/ask",
                {
                    question: userQuestion
                }
            );

            setMessages((previousMessages) => [
                ...previousMessages,
                {
                    type: "assistant",
                    text: response.data
                }
            ]);

        } catch (error) {

            console.error(
                "AI Assistant Error:",
                error
            );

            setMessages((previousMessages) => [
                ...previousMessages,
                {
                    type: "assistant",
                    text:
                        "Sorry, the AI assistant is temporarily unavailable. Please try again later."
                }
            ]);

        } finally {

            setLoading(false);

        }

    };


    const handleSubmit = (event) => {

        event.preventDefault();

        askAssistant();

    };


    const handleQuickQuestion = (quickQuestion) => {

        askAssistant(quickQuestion);

    };


    return (

        <>

            {/* =====================================================
                FLOATING AI BUTTON
            ===================================================== */}

            {!isOpen && (

                <button
                    type="button"
                    className="ai-floating-button"
                    onClick={() => setIsOpen(true)}
                    aria-label="Open ShopSphere AI Assistant"
                >

                    <span className="ai-floating-icon">
                        ✨
                    </span>

                    <span className="ai-floating-text">
                        AI Assistant
                    </span>

                </button>

            )}


            {/* =====================================================
                AI CHAT POPUP
            ===================================================== */}

            {isOpen && (

                <div className="ai-popup">

                    {/* ================= HEADER ================= */}

                    <div className="ai-popup-header">

                        <div className="ai-popup-title">

                            <div className="ai-popup-icon">
                                ✨
                            </div>

                            <div>

                                <h3>
                                    ShopSphere AI
                                </h3>

                                <span>
                                    Shopping Assistant
                                </span>

                            </div>

                        </div>


                        <button
                            type="button"
                            className="ai-popup-close"
                            onClick={() => setIsOpen(false)}
                            aria-label="Close AI Assistant"
                        >
                            ×
                        </button>

                    </div>


                    {/* ================= CHAT ================= */}

                    <div className="ai-popup-chat">

                        {messages.length === 0 ? (

                            <div className="ai-popup-welcome">

                                <div className="ai-popup-welcome-icon">
                                    ✨
                                </div>

                                <h4>
                                    How can I help?
                                </h4>

                                <p>
                                    Ask me about products,
                                    prices or shopping options.
                                </p>


                                <div className="ai-popup-quick-questions">

                                    {quickQuestions.map(
                                        (quickQuestion, index) => (

                                            <button
                                                key={index}
                                                type="button"
                                                className="ai-popup-quick-button"
                                                onClick={() =>
                                                    handleQuickQuestion(
                                                        quickQuestion
                                                    )
                                                }
                                                disabled={loading}
                                            >
                                                {quickQuestion}
                                            </button>

                                        )
                                    )}

                                </div>

                            </div>

                        ) : (

                            <div className="ai-popup-messages">

                                {messages.map(
                                    (message, index) => (

                                        <div
                                            key={index}
                                            className={
                                                message.type === "user"
                                                    ? "ai-popup-message user"
                                                    : "ai-popup-message assistant"
                                            }
                                        >

                                            <div className="ai-popup-message-label">

                                                {message.type === "user"
                                                    ? "You"
                                                    : "ShopSphere AI"}

                                            </div>


                                            <div className="ai-popup-message-text">

                                                {message.text
                                                    .split("\n")
                                                    .map(
                                                        (
                                                            line,
                                                            lineIndex
                                                        ) => {

                                                            const productIdMatch =
                                                                line.match(
                                                                    /\[PRODUCT_ID:(\d+)\]/
                                                                );


                                                            if (
                                                                productIdMatch
                                                            ) {

                                                                const productId =
                                                                    productIdMatch[1];

                                                                return (

                                                                    <div
                                                                        key={
                                                                            lineIndex
                                                                        }
                                                                        className="ai-popup-product-link-container"
                                                                    >

                                                                        <Link
                                                                            to={`/products/${productId}`}
                                                                            className="ai-product-link"
                                                                            onClick={() => setIsOpen(false)}
                                                                        >
                                                                            View Product
                                                                        </Link>

                                                                    </div>

                                                                );

                                                            }


                                                            return (

                                                                <div
                                                                    key={
                                                                        lineIndex
                                                                    }
                                                                >

                                                                    {line
                                                                        .replace(
                                                                            /\*\*/g,
                                                                            ""
                                                                        )
                                                                        .replace(
                                                                            /\*/g,
                                                                            "•"
                                                                        )}

                                                                </div>

                                                            );

                                                        }
                                                    )}

                                            </div>

                                        </div>

                                    )
                                )}


                                {loading && (

                                    <div className="ai-popup-message assistant">

                                        <div className="ai-popup-message-label">
                                            ShopSphere AI
                                        </div>

                                        <div className="ai-popup-typing">

                                            Thinking
                                            <span>.</span>
                                            <span>.</span>
                                            <span>.</span>

                                        </div>

                                    </div>

                                )}

                            </div>

                        )}

                    </div>


                    {/* ================= INPUT ================= */}

                    <form
                        className="ai-popup-input-area"
                        onSubmit={handleSubmit}
                    >

                        <input
                            type="text"
                            value={question}
                            onChange={(event) =>
                                setQuestion(
                                    event.target.value
                                )
                            }
                            placeholder="Ask about a product..."
                            disabled={loading}
                        />


                        <button
                            type="submit"
                            className="ai-popup-send-button"
                            disabled={
                                loading ||
                                !question.trim()
                            }
                        >
                            {loading
                                ? "..."
                                : "Send"}
                        </button>

                    </form>


                    <div className="ai-popup-disclaimer">
                        AI responses are based on ShopSphere product information.
                    </div>

                </div>

            )}

        </>

    );

};

export default AiShoppingAssistant;