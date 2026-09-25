import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import api from "./api";
import "./App.css";

const SellerReviews = () => {

    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        loadReviews();
    }, []);

    const loadReviews = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await api.get("/api/reviews/seller");

            setReviews(response.data || []);

        } catch (err) {
            console.error("Failed to load seller reviews:", err);

            if (err.response?.status === 401 ||
                err.response?.status === 403) {

                setError("You are not authorized to view seller reviews.");

            } else {
                setError(
                    err.response?.data?.message ||
                    "Failed to load reviews."
                );
            }

        } finally {
            setLoading(false);
        }
    };

    const averageRating = useMemo(() => {

        if (reviews.length === 0) {
            return 0;
        }

        const total = reviews.reduce(
            (sum, review) => sum + Number(review.rating || 0),
            0
        );

        return (total / reviews.length).toFixed(1);

    }, [reviews]);

    const renderStars = (rating) => {

        const stars = [];

        for (let i = 1; i <= 5; i++) {
            stars.push(
                <span
                    key={i}
                    style={{
                        color: i <= rating ? "#f59e0b" : "#d1d5db",
                        fontSize: "18px"
                    }}
                >
                    ★
                </span>
            );
        }

        return stars;
    };

    const formatDate = (dateString) => {

        if (!dateString) {
            return "Unknown date";
        }

        return new Date(dateString).toLocaleDateString(
            "en-IN",
            {
                day: "2-digit",
                month: "short",
                year: "numeric"
            }
        );
    };

    return (
        <div className="seller-reviews-page">
            {/* ================= NAVBAR ================= */}

            <nav className="seller-navbar">

                <div className="seller-navbar-brand">
                    <Link to="/seller">
                        ShopSphere Seller
                    </Link>
                </div>

                <div className="seller-navbar-links">

                    <Link to="/seller">
                        Home
                    </Link>

                    <Link to="/seller/dashboard">
                        Dashboard
                    </Link>

                    <Link to="/seller/products">
                        My Products
                    </Link>

                    <Link to="/seller/orders">
                        Seller Orders
                    </Link>

                    <Link
                        to="/seller/reviews"
                        className="active"
                    >
                        Reviews
                    </Link>

                    <Link to="/seller/profile">
                        My Profile
                    </Link>

                </div>

            </nav>


            {/* ================= MAIN CONTENT ================= */}

            <main className="seller-main-content">

                <div className="seller-page-header">

                    <div>
                        <h1>Customer Reviews</h1>

                        <p>
                            See what customers are saying about your products.
                        </p>
                    </div>

                    <button
                        className="seller-secondary-button"
                        onClick={loadReviews}
                    >
                        Refresh Reviews
                    </button>

                </div>


                {/* ================= ERROR ================= */}

                {error && (
                    <div className="error-message">
                        {error}
                    </div>
                )}


                {/* ================= LOADING ================= */}

                {loading ? (

                    <div className="seller-loading">
                        Loading reviews...
                    </div>

                ) : (

                    <>
                        {/* ================= SUMMARY ================= */}

                        <div className="seller-stats-grid">

                            <div className="seller-stat-card">

                                <div className="seller-stat-icon">
                                    ⭐
                                </div>

                                <div>
                                    <h3>
                                        {averageRating}
                                    </h3>

                                    <p>
                                        Average Rating
                                    </p>
                                </div>

                            </div>


                            <div className="seller-stat-card">

                                <div className="seller-stat-icon">
                                    💬
                                </div>

                                <div>
                                    <h3>
                                        {reviews.length}
                                    </h3>

                                    <p>
                                        Total Reviews
                                    </p>
                                </div>

                            </div>

                        </div>


                        {/* ================= NO REVIEWS ================= */}

                        {reviews.length === 0 ? (

                            <div className="seller-empty-state">

                                <div className="seller-empty-icon">
                                    ⭐
                                </div>

                                <h2>
                                    No Reviews Yet
                                </h2>

                                <p>
                                    Your products have not received any
                                    customer reviews yet.
                                </p>

                                <Link
                                    to="/seller/products"
                                    className="seller-primary-button"
                                >
                                    View My Products
                                </Link>

                            </div>

                        ) : (

                            /* ================= REVIEWS ================= */

                            <div className="seller-reviews-list">

                                {reviews.map((review) => (

                                    <div
                                        className="seller-review-card"
                                        key={review.id}
                                    >

                                        {/* PRODUCT */}

                                        <div className="seller-review-product">

                                            <div>

                                                <span className="seller-review-label">
                                                    Product
                                                </span>

                                                <h3>
                                                    {review.productName}
                                                </h3>

                                            </div>

                                            <span className="seller-review-date">
                                                {formatDate(review.createdAt)}
                                            </span>

                                        </div>


                                        {/* CUSTOMER + RATING */}

                                        <div className="seller-review-meta">

                                            <div>

                                                <span className="seller-review-label">
                                                    Customer
                                                </span>

                                                <strong>
                                                    {review.customerName}
                                                </strong>

                                            </div>


                                            <div className="seller-review-rating">

                                                <span className="seller-review-label">
                                                    Rating
                                                </span>

                                                <div>
                                                    {renderStars(review.rating)}

                                                    <span className="seller-review-rating-number">
                                                        {review.rating}/5
                                                    </span>
                                                </div>

                                            </div>

                                        </div>


                                        {/* COMMENT */}

                                        <div className="seller-review-comment">

                                            <span className="seller-review-label">
                                                Customer Comment
                                            </span>

                                            <p>
                                                "{review.comment}"
                                            </p>

                                        </div>

                                    </div>

                                ))}

                            </div>

                        )}

                    </>

                )}

            </main>


            {/* ================= FOOTER ================= */}

            <footer className="seller-footer">

                <p>
                    © 2026 ShopSphere. All rights reserved.
                </p>

            </footer>

        </div>
    );
};

export default SellerReviews;