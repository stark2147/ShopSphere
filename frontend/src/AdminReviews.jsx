import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "./api";
import "./App.css";

function AdminReviews() {

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

            const response =
                await api.get("/api/admin/reviews");

            setReviews(response.data || []);

        } catch (err) {

            console.error(
                "Failed to load admin reviews:",
                err
            );

            setError(
                err.response?.data?.message ||
                "Unable to load reviews."
            );

        } finally {

            setLoading(false);
        }
    };


    // ============================================================
    // DELETE REVIEW
    // ============================================================

    const handleDeleteReview = async (reviewId) => {

        const confirmed = window.confirm(
            "Are you sure you want to delete this review?"
        );

        if (!confirmed) {
            return;
        }

        try {

            await api.delete(
                `/api/admin/reviews/${reviewId}`
            );

            // Remove deleted review from UI immediately
            setReviews((previousReviews) =>
                previousReviews.filter(
                    (review) => review.id !== reviewId
                )
            );

            alert("Review deleted successfully.");

        } catch (err) {

            console.error(
                "Failed to delete review:",
                err
            );

            alert(
                err.response?.data?.message ||
                "Failed to delete review."
            );
        }
    };


    // ============================================================
    // LOGOUT
    // ============================================================

    const handleLogout = () => {

        const confirmed = window.confirm(
            "Are you sure you want to logout?"
        );

        if (!confirmed) return;

        localStorage.removeItem("token");
        localStorage.removeItem("user");

        window.location.href = "/login";
    };


    // ============================================================
    // RENDER STARS
    // ============================================================

    const renderStars = (rating) => {

        const stars = [];

        for (let i = 1; i <= 5; i++) {

            stars.push(
                <span
                    key={i}
                    className={
                        i <= rating
                            ? "admin-review-star active"
                            : "admin-review-star"
                    }
                >
                    ★
                </span>
            );
        }

        return stars;
    };


    // ============================================================
    // FORMAT DATE
    // ============================================================

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


    // ============================================================
    // LOADING
    // ============================================================

    if (loading) {

        return (
            <div className="admin-loading-page">

                <div className="admin-loading-icon">
                    ⭐
                </div>

                <h2>
                    Loading Reviews...
                </h2>

                <p>
                    Please wait while we fetch customer reviews.
                </p>

            </div>
        );
    }


    // ============================================================
    // PAGE
    // ============================================================

    return (
        <div className="admin-reviews-page">

            {/* ====================================================
                ADMIN NAVBAR
            ==================================================== */}

            <nav className="admin-navbar">

                <div className="admin-navbar-brand">

                    <span className="admin-brand-icon">
                        👨‍💼
                    </span>

                    <span>
                        ShopSphere Admin
                    </span>

                </div>


                <div className="admin-navbar-links">

                    <Link to="/admin">
                        Dashboard
                    </Link>

                    <Link to="/admin/users">
                        Users
                    </Link>

                    <Link to="/admin/sellers">
                        Sellers
                    </Link>

                    <Link to="/admin/products">
                        Products
                    </Link>

                    <Link to="/admin/orders">
                        Orders
                    </Link>

                    <Link
                        to="/admin/reviews"
                        className="active"
                    >
                        Reviews
                    </Link>

                </div>


                <button
                    className="admin-logout-button"
                    onClick={handleLogout}
                >
                    Logout
                </button>

            </nav>


            {/* ====================================================
                MAIN CONTENT
            ==================================================== */}

            <main className="admin-dashboard-container">

                {/* PAGE HEADER */}

                <section className="admin-dashboard-header">

                    <div>

                        <p className="admin-eyebrow">
                            SHOPSPHERE ADMIN CENTER
                        </p>

                        <h1>
                            Customer Reviews
                        </h1>

                        <p>
                            Monitor customer feedback and
                            product ratings across the marketplace.
                        </p>

                    </div>


                    <button
                        className="admin-primary-button"
                        onClick={loadReviews}
                    >
                        Refresh Reviews
                    </button>

                </section>


                {/* =================================================
                    ERROR MESSAGE
                ================================================= */}

                {error && (

                    <div className="admin-error-message">
                        {error}
                    </div>

                )}


                {/* =================================================
                    REVIEW SUMMARY
                ================================================= */}

                <section className="admin-stats-grid">

                    <div className="admin-stat-card">

                        <div className="admin-stat-icon">
                            ⭐
                        </div>

                        <div>

                            <span>
                                Total Reviews
                            </span>

                            <strong>
                                {reviews.length}
                            </strong>

                        </div>

                    </div>


                    <div className="admin-stat-card">

                        <div className="admin-stat-icon">
                            💬
                        </div>

                        <div>

                            <span>
                                Customer Feedback
                            </span>

                            <strong>
                                {reviews.length > 0
                                    ? "Active"
                                    : "None"}
                            </strong>

                        </div>

                    </div>

                </section>


                {/* =================================================
                    REVIEWS
                ================================================= */}

                <section className="admin-quick-section">

                    <div className="admin-section-heading">

                        <div>

                            <p className="admin-eyebrow">
                                CUSTOMER FEEDBACK
                            </p>

                            <h2>
                                All Reviews
                            </h2>

                        </div>

                    </div>


                    {/* =================================================
                        NO REVIEWS
                    ================================================= */}

                    {reviews.length === 0 ? (

                        <div className="admin-empty-state">

                            <div className="admin-empty-icon">
                                ⭐
                            </div>

                            <h2>
                                No Reviews Yet
                            </h2>

                            <p>
                                Customers have not submitted
                                any reviews yet.
                            </p>

                        </div>

                    ) : (

                        <div className="admin-reviews-list">

                            {reviews.map((review) => (

                                <article
                                    className="admin-review-card"
                                    key={review.id}
                                >

                                    {/* =================================================
                                        PRODUCT
                                    ================================================= */}

                                    <div className="admin-review-card-top">

                                        <div>

                                            <span className="admin-review-label">
                                                PRODUCT
                                            </span>

                                            <h3>
                                                {review.productName}
                                            </h3>

                                        </div>

                                        <span className="admin-review-date">
                                            {formatDate(
                                                review.createdAt
                                            )}
                                        </span>

                                    </div>


                                    {/* =================================================
                                        CUSTOMER + RATING
                                    ================================================= */}

                                    <div className="admin-review-meta">

                                        <div>

                                            <span className="admin-review-label">
                                                CUSTOMER
                                            </span>

                                            <strong>
                                                {review.customerName}
                                            </strong>

                                            <small>
                                                Customer ID:{" "}
                                                {review.customerId}
                                            </small>

                                        </div>


                                        <div className="admin-review-rating">

                                            <span className="admin-review-label">
                                                RATING
                                            </span>

                                            <div>

                                                {renderStars(
                                                    review.rating
                                                )}

                                                <strong>
                                                    {review.rating}/5
                                                </strong>

                                            </div>

                                        </div>

                                    </div>


                                    {/* =================================================
                                        COMMENT
                                    ================================================= */}

                                    <div className="admin-review-comment">

                                        <span className="admin-review-label">
                                            CUSTOMER COMMENT
                                        </span>

                                        <p>
                                            "{review.comment}"
                                        </p>

                                    </div>


                                    {/* =================================================
                                        REVIEW INFO
                                    ================================================= */}

                                    <div className="admin-review-footer">

                                        <span>
                                            Review ID:{" "}
                                            #{review.id}
                                        </span>

                                        {review.updatedAt &&
                                            review.updatedAt !==
                                            review.createdAt && (

                                                <span>
                                                    Updated:{" "}
                                                    {formatDate(
                                                        review.updatedAt
                                                    )}
                                                </span>

                                            )}

                                    </div>


                                    {/* =================================================
                                        DELETE ACTION
                                    ================================================= */}

                                    <div className="admin-review-actions">

                                        <button
                                            className="admin-delete-review-button"
                                            onClick={() =>
                                                handleDeleteReview(
                                                    review.id
                                                )
                                            }
                                        >
                                            🗑 Delete Review
                                        </button>

                                    </div>

                                </article>

                            ))}

                        </div>

                    )}

                </section>

            </main>


            {/* ====================================================
                FOOTER
            ==================================================== */}

            <footer className="admin-footer">

                <p>
                    © 2026 ShopSphere. Admin Center.
                </p>

            </footer>

        </div>
    );
}

export default AdminReviews;