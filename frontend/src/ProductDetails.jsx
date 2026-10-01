import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import api from "./api";
import "./App.css";

function ProductDetails() {

    const { id } = useParams();
    const navigate = useNavigate();

    const [product, setProduct] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [loading, setLoading] = useState(true);
    const [addedToCart, setAddedToCart] = useState(false);

    const [deleteLoading, setDeleteLoading] = useState(false);

    // =====================================================
    // REVIEW + RATING STATE
    // =====================================================

    const [reviews, setReviews] = useState([]);
    const [averageRating, setAverageRating] = useState(0);
    const [totalReviews, setTotalReviews] = useState(0);
    const [reviewsLoading, setReviewsLoading] = useState(true);

    // =====================================================
    // AI REVIEW SUMMARY STATE
    // =====================================================

    const [aiReviewSummary, setAiReviewSummary] = useState("");
    const [aiReviewSummaryLoading, setAiReviewSummaryLoading] =
        useState(false);
    const [aiReviewSummaryError, setAiReviewSummaryError] =
        useState("");

    const [selectedRating, setSelectedRating] = useState(0);
    const [reviewComment, setReviewComment] = useState("");
    const [reviewSubmitting, setReviewSubmitting] = useState(false);
    const [reviewMessage, setReviewMessage] = useState("");
    const [reviewError, setReviewError] = useState("");

    // =====================================================
    // CUSTOMER OWN REVIEW STATE
    // =====================================================

    const [myReview, setMyReview] = useState(null);
    const [myReviewLoading, setMyReviewLoading] = useState(false);
    const [editingReview, setEditingReview] = useState(false);
    const [reviewUpdating, setReviewUpdating] = useState(false);
    const [reviewDeleting, setReviewDeleting] = useState(false);

    // =====================================================
    // CHECK LOGGED-IN USER ROLE
    // =====================================================

    const getLoggedInUser = () => {

        try {

            const storedUser = localStorage.getItem("user");

            if (!storedUser) {
                return null;
            }

            return JSON.parse(storedUser);

        } catch (error) {

            console.error(
                "Unable to read logged-in user:",
                error
            );

            return null;
        }
    };

    const loggedInUser = getLoggedInUser();

    const isSeller =
        loggedInUser?.role === "SELLER";

    const isCustomer =
        loggedInUser?.role === "CUSTOMER";

    // =====================================================
    // LOAD PRODUCT
    // =====================================================

    useEffect(() => {

        const loadProduct = async () => {

            try {

                setLoading(true);

                const response =
                    await api.get(`/api/products/${id}`);

                console.log(
                    "Product details:",
                    response.data
                );

                setProduct(response.data);

            } catch (error) {

                console.error(
                    "Error loading product:",
                    error
                );

            } finally {

                setLoading(false);
            }
        };

        loadProduct();

    }, [id]);

    // =====================================================
    // LOAD PRODUCT REVIEWS + RATING
    // =====================================================

    useEffect(() => {

        const loadReviews = async () => {

            try {

                setReviewsLoading(true);

                const [
                    reviewsResponse,
                    ratingResponse
                ] = await Promise.all([

                    api.get(
                        `/api/reviews/product/${id}`
                    ),

                    api.get(
                        `/api/reviews/product/${id}/rating`
                    )

                ]);

                setReviews(
                    reviewsResponse.data
                );

                setAverageRating(
                    ratingResponse.data.averageRating || 0
                );

                setTotalReviews(
                    ratingResponse.data.totalReviews || 0
                );

            } catch (error) {

                console.error(
                    "Error loading reviews:",
                    error
                );

                setReviews([]);
                setAverageRating(0);
                setTotalReviews(0);

            } finally {

                setReviewsLoading(false);
            }
        };

        loadReviews();

    }, [id]);

    // =====================================================
    // CLEAR AI SUMMARY WHEN PRODUCT CHANGES
    // =====================================================

    useEffect(() => {

        setAiReviewSummary("");
        setAiReviewSummaryError("");
        setAiReviewSummaryLoading(false);

    }, [id]);

    // =====================================================
    // LOAD CUSTOMER'S OWN REVIEW
    // =====================================================

    useEffect(() => {

        const loadMyReview = async () => {

            if (!isCustomer) {

                setMyReview(null);

                return;
            }

            try {

                setMyReviewLoading(true);

                const response =
                    await api.get(
                        `/api/reviews/product/${id}/my`
                    );

                console.log(
                    "My review:",
                    response.data
                );

                setMyReview(response.data);

            } catch (error) {

                const status =
                    error.response?.status;

                /*
                 * When the customer has not reviewed the
                 * product yet, the current backend throws
                 * "You have not reviewed this product".
                 *
                 * Depending on the GlobalExceptionHandler,
                 * this can appear as 404 or 500.
                 *
                 * 401/403 are NOT treated as "no review"
                 * because those indicate authentication/
                 * authorization problems.
                 */

                if (
                    status === 404 ||
                    status === 500
                ) {

                    setMyReview(null);

                } else {

                    console.error(
                        "Error loading my review:",
                        error
                    );

                    setMyReview(null);
                }

            } finally {

                setMyReviewLoading(false);
            }
        };

        loadMyReview();

    }, [id, isCustomer]);

    // =====================================================
    // AI REVIEW SUMMARY
    // =====================================================

    const generateAiReviewSummary = async () => {

        try {

            setAiReviewSummaryLoading(true);
            setAiReviewSummaryError("");

            const response = await api.get(
                `/api/ai/reviews/product/${id}/summary`
            );

            setAiReviewSummary(response.data);

        } catch (error) {

            console.error(
                "AI review summary failed:",
                error
            );

            if (error.response?.status === 429) {

                setAiReviewSummaryError(
                    "AI usage limit reached. Please try again later."
                );

            } else if (error.response?.status === 401) {

                setAiReviewSummaryError(
                    "Please login to use AI review summarization."
                );

            } else if (error.response?.status === 403) {

                setAiReviewSummaryError(
                    "You are not authorized to use AI review summarization."
                );

            } else {

                setAiReviewSummaryError(
                    "AI review summary is temporarily unavailable."
                );
            }

        } finally {

            setAiReviewSummaryLoading(false);
        }
    };

    // =====================================================
    // REFRESH REVIEWS
    // =====================================================

    const refreshReviews = async () => {

        try {

            setReviewsLoading(true);

            const [
                reviewsResponse,
                ratingResponse
            ] = await Promise.all([

                api.get(
                    `/api/reviews/product/${id}`
                ),

                api.get(
                    `/api/reviews/product/${id}/rating`
                )

            ]);

            const reviewsData =
                Array.isArray(reviewsResponse.data)
                    ? reviewsResponse.data
                    : [];

            const ratingData =
                ratingResponse.data;

            const average =
                typeof ratingData === "number"
                    ? ratingData
                    : Number(
                        ratingData?.averageRating || 0
                    );

            const reviewCount =
                typeof ratingData === "object" &&
                ratingData?.totalReviews != null
                    ? Number(
                        ratingData.totalReviews
                    )
                    : reviewsData.length;

            setReviews(reviewsData);
            setAverageRating(average);
            setTotalReviews(reviewCount);

        } catch (error) {

            console.error(
                "Error refreshing reviews:",
                error
            );

        } finally {

            setReviewsLoading(false);
        }
    };

    // =====================================================
    // REFRESH CUSTOMER'S OWN REVIEW
    // =====================================================

    const refreshMyReview = async () => {

        if (!isCustomer) {
            return;
        }

        try {

            const response =
                await api.get(
                    `/api/reviews/product/${id}/my`
                );

            setMyReview(response.data);

        } catch (error) {

            const status =
                error.response?.status;

            if (
                status === 404 ||
                status === 500
            ) {

                setMyReview(null);

            } else {

                console.error(
                    "Error refreshing my review:",
                    error
                );
            }
        }
    };

    // =====================================================
    // CUSTOMER - SUBMIT REVIEW
    // =====================================================

    const submitReview = async (event) => {

        event.preventDefault();

        setReviewMessage("");
        setReviewError("");

        if (!loggedInUser) {

            setReviewError(
                "Please login as a customer to submit a review."
            );

            return;
        }

        if (!isCustomer) {

            setReviewError(
                "Only customers can submit reviews."
            );

            return;
        }

        if (myReview) {

            setReviewError(
                "You have already reviewed this product. Please edit your existing review."
            );

            return;
        }

        if (
            selectedRating < 1 ||
            selectedRating > 5
        ) {

            setReviewError(
                "Please select a rating between 1 and 5 stars."
            );

            return;
        }

        if (!reviewComment.trim()) {

            setReviewError(
                "Please write a review comment."
            );

            return;
        }

        if (reviewComment.trim().length > 1000) {

            setReviewError(
                "Review cannot exceed 1000 characters."
            );

            return;
        }

        try {

            setReviewSubmitting(true);

            const response =
                await api.post(
                    "/api/reviews",
                    {
                        productId: Number(id),
                        rating: selectedRating,
                        comment: reviewComment.trim()
                    }
                );

            setMyReview(response.data);

            setReviewMessage(
                "Your review has been submitted successfully! ⭐"
            );

            setReviewError("");

            setSelectedRating(0);
            setReviewComment("");

            await refreshReviews();

        } catch (error) {

            console.error(
                "Error submitting review:",
                error
            );

            setReviewError(
                error.response?.data?.message ||
                error.response?.data ||
                "Could not submit your review."
            );

        } finally {

            setReviewSubmitting(false);
        }
    };

    // =====================================================
    // CUSTOMER - START EDITING REVIEW
    // =====================================================

    const startEditingReview = () => {

        if (!myReview) {
            return;
        }

        setSelectedRating(
            myReview.rating
        );

        setReviewComment(
            myReview.comment || ""
        );

        setReviewMessage("");
        setReviewError("");

        setEditingReview(true);

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    };

    // =====================================================
    // CUSTOMER - CANCEL EDITING REVIEW
    // =====================================================

    const cancelEditingReview = () => {

        setEditingReview(false);

        setSelectedRating(0);
        setReviewComment("");

        setReviewMessage("");
        setReviewError("");
    };

    // =====================================================
    // CUSTOMER - UPDATE REVIEW
    // =====================================================

    const updateReview = async (event) => {

        event.preventDefault();

        setReviewMessage("");
        setReviewError("");

        if (!myReview) {
            return;
        }

        if (
            selectedRating < 1 ||
            selectedRating > 5
        ) {

            setReviewError(
                "Please select a rating between 1 and 5 stars."
            );

            return;
        }

        if (!reviewComment.trim()) {

            setReviewError(
                "Please write a review comment."
            );

            return;
        }

        if (reviewComment.trim().length > 1000) {

            setReviewError(
                "Review cannot exceed 1000 characters."
            );

            return;
        }

        try {

            setReviewUpdating(true);

            const response =
                await api.put(
                    `/api/reviews/${myReview.id}`,
                    {
                        productId: Number(id),
                        rating: selectedRating,
                        comment: reviewComment.trim()
                    }
                );

            setMyReview(response.data);

            setEditingReview(false);

            setSelectedRating(0);
            setReviewComment("");

            setReviewMessage(
                "Your review has been updated successfully! ⭐"
            );

            setReviewError("");

            await refreshReviews();

        } catch (error) {

            console.error(
                "Error updating review:",
                error
            );

            setReviewError(
                error.response?.data?.message ||
                error.response?.data ||
                "Could not update your review."
            );

        } finally {

            setReviewUpdating(false);
        }
    };

    // =====================================================
    // CUSTOMER - DELETE REVIEW
    // =====================================================

    const deleteReview = async () => {

        if (!myReview) {
            return;
        }

        const confirmed =
            window.confirm(
                "Are you sure you want to delete your review?"
            );

        if (!confirmed) {
            return;
        }

        try {

            setReviewDeleting(true);

            await api.delete(
                `/api/reviews/${myReview.id}`
            );

            setMyReview(null);

            setEditingReview(false);

            setSelectedRating(0);
            setReviewComment("");

            setReviewMessage(
                "Your review has been deleted successfully."
            );

            setReviewError("");

            await refreshReviews();

        } catch (error) {

            console.error(
                "Error deleting review:",
                error
            );

            setReviewError(
                error.response?.data?.message ||
                error.response?.data ||
                "Could not delete your review."
            );

        } finally {

            setReviewDeleting(false);
        }
    };

    // =====================================================
    // CUSTOMER - ADD TO CART
    // =====================================================

    const addToCart = async () => {

        try {

            await api.post(
                "/api/cart/items",
                {
                    productId: product.id,
                    quantity: quantity
                }
            );

            setAddedToCart(true);

        } catch (error) {

            console.error(
                "Error adding product to cart:",
                error
            );

            alert(
                error.response?.data?.message ||
                "Could not add product to cart."
            );
        }
    };

    // =====================================================
    // CUSTOMER - ADD TO WISHLIST
    // =====================================================

    const addToWishlist = async () => {

        try {

            await api.post(
                `/api/wishlist/${product.id}`
            );

            alert(
                `${product.name} added to wishlist ❤️`
            );

        } catch (error) {

            console.error(
                "Error adding product to wishlist:",
                error
            );

            alert(
                error.response?.data?.message ||
                "Could not add product to wishlist."
            );
        }
    };

    // =====================================================
    // CUSTOMER - BUY NOW
    // =====================================================

    const buyNow = async () => {

        try {

            await api.post(
                "/api/cart/items",
                {
                    productId: product.id,
                    quantity: quantity
                }
            );

            window.location.href = "/cart";

        } catch (error) {

            console.error(
                "Error with Buy Now:",
                error
            );

            alert(
                error.response?.data?.message ||
                "Could not proceed with purchase."
            );
        }
    };

    // =====================================================
    // SELLER - DELETE PRODUCT
    // =====================================================

    const deleteProduct = async () => {

        const confirmed =
            window.confirm(
                `Are you sure you want to delete "${product.name}"?`
            );

        if (!confirmed) {
            return;
        }

        try {

            setDeleteLoading(true);

            await api.delete(
                `/api/products/${product.id}`
            );

            navigate("/seller/products");

        } catch (error) {

            console.error(
                "Error deleting product:",
                error
            );

            alert(
                error.response?.data?.message ||
                "Could not delete product."
            );

        } finally {

            setDeleteLoading(false);
        }
    };

    // =====================================================
    // LOADING
    // =====================================================

    if (loading) {

        return (
            <div className="product-details-loading">

                <div className="product-loading-icon">
                    🛍️
                </div>

                <h2>
                    Loading product...
                </h2>

                <p>
                    Please wait while we load the
                    product details.
                </p>

            </div>
        );
    }

    // =====================================================
    // PRODUCT NOT FOUND
    // =====================================================

    if (!product) {

        return (
            <div className="product-not-found">

                <div className="product-not-found-icon">
                    🔍
                </div>

                <h1>
                    Product Not Found
                </h1>

                <p>
                    Sorry, we couldn't find the product
                    you're looking for.
                </p>

                <Link
                    to={
                        isSeller
                            ? "/seller/products"
                            : "/products"
                    }
                    className="back-to-products-button"
                >
                    ← Back
                </Link>

            </div>
        );
    }

    const isInStock =
        product.stockQuantity > 0;

    // =====================================================
    // SELLER VIEW
    // =====================================================

    if (isSeller) {

        return (
            <div className="premium-dashboard-page">

                <nav className="dashboard-navbar">

                    <div className="dashboard-brand">

                        <Link to="/seller/home">
                            🏪 ShopSphere
                        </Link>

                    </div>

                    <div className="dashboard-nav-links">

                        <Link to="/seller/home">
                            Home
                        </Link>

                        <Link to="/seller/dashboard">
                            Dashboard
                        </Link>

                        <Link
                            to="/seller/products"
                            className="active"
                        >
                            My Products
                        </Link>

                        <Link to="/seller/orders">
                            Seller Orders
                        </Link>

                        <Link to="/seller/profile">
                            My Profile
                        </Link>

                    </div>

                    <Link
                        to="/seller/home"
                        className="dashboard-back-button"
                    >
                        My Store
                    </Link>

                </nav>

                <main className="seller-dashboard-container">

                    <section className="seller-dashboard-header">

                        <div>

                            <p className="dashboard-eyebrow">
                                PRODUCT MANAGEMENT
                            </p>

                            <h1>
                                Product Details
                            </h1>

                            <p>
                                View and manage your product
                                information.
                            </p>

                        </div>

                        <Link
                            to="/seller/products"
                            className="dashboard-back-button"
                        >
                            ← Back to Products
                        </Link>

                    </section>

                    <section className="seller-product-details-card">

                        <div className="seller-product-details-visual">

                            <div className="seller-product-large-image">

                                {product.imageUrl ? (

                                    <img
                                        src={product.imageUrl}
                                        alt={product.name}
                                        className="seller-product-real-image"
                                    />

                                ) : (

                                    <div className="seller-product-large-icon">
                                        📦
                                    </div>

                                )}

                            </div>

                            <span
                                className={
                                    product.stockQuantity <= 0
                                        ? "seller-product-status out"
                                        : product.stockQuantity <= 5
                                            ? "seller-product-status low"
                                            : "seller-product-status active"
                                }
                            >
                                {product.stockQuantity <= 0
                                    ? "Out of Stock"
                                    : product.stockQuantity <= 5
                                        ? "Low Stock"
                                        : "Active"}
                            </span>

                        </div>

                        <div className="seller-product-details-info">

                            <p className="dashboard-eyebrow">
                                {product.categoryName ||
                                    "UNCATEGORIZED"}
                            </p>

                            <h2>
                                {product.name}
                            </h2>

                            <span className="seller-product-id">
                                Product #{product.id}
                            </span>

                            <p className="seller-product-details-description">
                                {product.description ||
                                    "No product description available."}
                            </p>

                            <div className="seller-product-details-meta">

                                <div>

                                    <span>
                                        PRICE
                                    </span>

                                    <strong>
                                        ₹
                                        {Number(
                                            product.price || 0
                                        ).toLocaleString(
                                            "en-IN"
                                        )}
                                    </strong>

                                </div>

                                <div>

                                    <span>
                                        STOCK
                                    </span>

                                    <strong>
                                        {product.stockQuantity}
                                    </strong>

                                </div>

                                <div>

                                    <span>
                                        CATEGORY
                                    </span>

                                    <strong>
                                        {product.categoryName ||
                                            "Uncategorized"}
                                    </strong>

                                </div>

                            </div>

                            <div className="seller-product-owner">

                                <div className="seller-owner-icon">
                                    🏪
                                </div>

                                <div>

                                    <span>
                                        YOUR STORE
                                    </span>

                                    <strong>
                                        {product.storeName ||
                                            "ShopSphere Seller"}
                                    </strong>

                                </div>

                            </div>

                            <div className="seller-product-details-actions">

                                <Link
                                    to="/seller/products"
                                    className="seller-cancel-button"
                                >
                                    ← Back
                                </Link>

                                <Link
                                    to="/seller/products"
                                    className="seller-edit-button"
                                >
                                    ✏️ Edit Product
                                </Link>

                                <button
                                    type="button"
                                    className="seller-delete-button"
                                    onClick={deleteProduct}
                                    disabled={deleteLoading}
                                >
                                    {deleteLoading
                                        ? "Deleting..."
                                        : "🗑️ Delete Product"}
                                </button>

                            </div>

                        </div>

                    </section>

                    <section className="seller-product-info-grid">

                        <div className="seller-product-info-card">

                            <div className="seller-product-info-icon">
                                📊
                            </div>

                            <div>

                                <strong>
                                    Inventory Status
                                </strong>

                                <span>
                                    {product.stockQuantity > 5
                                        ? "Healthy inventory level"
                                        : product.stockQuantity > 0
                                            ? "Consider restocking soon"
                                            : "Product needs restocking"}
                                </span>

                            </div>

                        </div>

                        <div className="seller-product-info-card">

                            <div className="seller-product-info-icon">
                                💰
                            </div>

                            <div>

                                <strong>
                                    Current Price
                                </strong>

                                <span>
                                    ₹
                                    {Number(
                                        product.price || 0
                                    ).toLocaleString(
                                        "en-IN"
                                    )}
                                </span>

                            </div>

                        </div>

                        <div className="seller-product-info-card">

                            <div className="seller-product-info-icon">
                                🏪
                            </div>

                            <div>

                                <strong>
                                    Store
                                </strong>

                                <span>
                                    {product.storeName ||
                                        "Your ShopSphere Store"}
                                </span>

                            </div>

                        </div>

                    </section>

                </main>

                <footer className="dashboard-footer">

                    <p>
                        © 2026 ShopSphere. Seller Center.
                    </p>

                </footer>

            </div>
        );
    }

    // =====================================================
    // CUSTOMER VIEW
    // =====================================================

    return (
        <div className="app">

            {/* CUSTOMER NAVBAR */}

            <nav className="navbar">

                <Link
                    to="/"
                    className="logo"
                >
                    Shop<span>Sphere</span>
                </Link>

                <div className="nav-actions">

                    <Link to="/">
                        Home
                    </Link>

                    <Link
                        to="/products"
                        className="active-nav-link"
                    >
                        Products
                    </Link>

                    <Link to="/wishlist">
                        Wishlist ❤️
                    </Link>

                    <Link to="/orders">
                        My Orders
                    </Link>

                    <Link to="/cart">
                        Cart
                    </Link>

                    <Link
                        to="/profile"
                        className="login-link"
                    >
                        My Account 👤
                    </Link>

                </div>

            </nav>

            {/* PRODUCT DETAILS */}

            <main className="product-details-page">

                <Link
                    to="/products"
                    className="product-details-back"
                >
                    ← Back to Products
                </Link>

                <section className="product-details-card">

                    <div className="product-details-visual">

                        <div className="product-details-image">

                            {product.imageUrl ? (

                                <img
                                    src={product.imageUrl}
                                    alt={product.name}
                                    className="product-details-real-image"
                                />

                            ) : (

                                <span className="product-details-main-icon">
                                    🛍️
                                </span>

                            )}

                            <span className="product-details-image-badge">
                                ShopSphere
                            </span>

                        </div>

                        <div className="product-trust-row">

                            <div className="product-trust-item">

                                <span>✓</span>

                                <div>

                                    <strong>
                                        Trusted Seller
                                    </strong>

                                    <small>
                                        Verified marketplace seller
                                    </small>

                                </div>

                            </div>

                            <div className="product-trust-item">

                                <span>✓</span>

                                <div>

                                    <strong>
                                        Secure Shopping
                                    </strong>

                                    <small>
                                        Protected checkout
                                    </small>

                                </div>

                            </div>

                            <div className="product-trust-item">

                                <span>✓</span>

                                <div>

                                    <strong>
                                        Quality Products
                                    </strong>

                                    <small>
                                        Shop with confidence
                                    </small>

                                </div>

                            </div>

                        </div>

                    </div>

                    <div className="product-details-info">

                        <p className="product-details-category">
                            {product.categoryName ||
                                "Uncategorized"}
                        </p>

                        <h1>
                            {product.name}
                        </h1>

                        {/* RATING */}

                        <div className="product-details-rating">

                            <span>
                                {averageRating > 0
                                    ? "⭐".repeat(
                                        Math.round(averageRating)
                                    )
                                    : "☆☆☆☆☆"}
                            </span>

                            <strong>
                                {averageRating > 0
                                    ? averageRating.toFixed(1)
                                    : "No rating"}
                            </strong>

                            <span>
                                · {totalReviews}{" "}
                                {totalReviews === 1
                                    ? "Review"
                                    : "Reviews"}
                            </span>

                        </div>

                        <p className="product-details-description">

                            {product.description ||
                                "Quality product from a trusted seller."}

                        </p>

                        {/* SELLER */}

                        {product.storeName && (

                            <div className="product-seller-info">

                                <div className="seller-avatar">
                                    🏪
                                </div>

                                <div className="seller-details">

                                    <span>
                                        SOLD BY
                                    </span>

                                    <strong>
                                        {product.storeName}
                                    </strong>

                                    {product.sellerName && (
                                        <small>
                                            Seller:{" "}
                                            {product.sellerName}
                                        </small>
                                    )}

                                </div>

                                {product.sellerId && (

                                    <Link
                                        to={`/store/${product.sellerId}`}
                                        className="view-store-button"
                                    >
                                        View Store →
                                    </Link>

                                )}

                            </div>

                        )}

                        {/* PRICE */}

                        <div className="product-details-price-section">

                            <span className="price-label">
                                PRICE
                            </span>

                            <div className="product-details-price">

                                ₹
                                {Number(
                                    product.price
                                ).toLocaleString("en-IN")}

                            </div>

                        </div>

                        {/* STOCK */}

                        {isInStock ? (

                            <div className="details-stock available">

                                <span className="stock-dot">
                                    ●
                                </span>

                                In Stock

                                <span className="stock-count">
                                    {product.stockQuantity} available
                                </span>

                            </div>

                        ) : (

                            <div className="details-stock unavailable">

                                <span>
                                    ●
                                </span>

                                Out of Stock

                            </div>

                        )}

                        {/* CUSTOMER ACTIONS */}

                        {isInStock && (

                            <div className="product-purchase-area">

                                <div className="details-quantity">

                                    <span>
                                        Quantity
                                    </span>

                                    <div className="quantity-controls">

                                        <button
                                            type="button"
                                            onClick={() =>
                                                setQuantity(
                                                    Math.max(
                                                        1,
                                                        quantity - 1
                                                    )
                                                )
                                            }
                                        >
                                            −
                                        </button>

                                        <strong>
                                            {quantity}
                                        </strong>

                                        <button
                                            type="button"
                                            onClick={() =>
                                                setQuantity(
                                                    Math.min(
                                                        product.stockQuantity,
                                                        quantity + 1
                                                    )
                                                )
                                            }
                                        >
                                            +
                                        </button>

                                    </div>

                                </div>

                                <div className="details-action-buttons">

                                    <button
                                        type="button"
                                        className="details-add-cart"
                                        onClick={addToCart}
                                    >
                                        🛒 Add to Cart
                                    </button>

                                    <button
                                        type="button"
                                        className="details-buy-now"
                                        onClick={buyNow}
                                    >
                                        Buy Now
                                    </button>

                                </div>

                                <button
                                    type="button"
                                    className="details-wishlist-button"
                                    onClick={addToWishlist}
                                >
                                    ♡ Add to Wishlist
                                </button>

                                {addedToCart && (

                                    <div className="cart-success-message">

                                        <div>

                                            <strong>
                                                ✓ Added to your cart
                                            </strong>

                                            <span>
                                                {product.name}
                                            </span>

                                        </div>

                                        <Link to="/cart">
                                            Go to Cart →
                                        </Link>

                                    </div>

                                )}

                            </div>

                        )}

                        {!isInStock && (

                            <div className="out-of-stock-message">

                                <strong>
                                    This product is currently
                                    unavailable.
                                </strong>

                                <span>
                                    Please check back later or
                                    explore other products.
                                </span>

                            </div>

                        )}

                    </div>

                </section>

                {/* =====================================================
                        CUSTOMER REVIEW MANAGEMENT
                    ===================================================== */}

                {isCustomer && (

                    <section className="write-review-section">

                        {myReviewLoading ? (

                            <div className="reviews-loading">
                                Checking your review...
                            </div>

                        ) : myReview ? (

                            <>

                                {!editingReview ? (

                                    <div>

                                        <div className="write-review-header">

                                            <div>

                                                <p className="product-details-category">
                                                    YOUR EXPERIENCE
                                                </p>

                                                <h2>
                                                    Your Review
                                                </h2>

                                                <p>
                                                    You have already reviewed this
                                                    product.
                                                </p>

                                            </div>

                                        </div>

                                        <div className="review-card">

                                            <div className="review-card-header">

                                                <div className="review-customer">

                                                    <div className="review-avatar">
                                                        {myReview.customerName
                                                            ?.charAt(0)
                                                            ?.toUpperCase() || "C"}
                                                    </div>

                                                    <div>

                                                        <strong>
                                                            {myReview.customerName}
                                                        </strong>

                                                        <small>
                                                            Your Review
                                                        </small>

                                                    </div>

                                                </div>

                                                <div className="review-rating">

                                                    <span>
                                                        {"⭐".repeat(
                                                            myReview.rating
                                                        )}
                                                    </span>

                                                    <strong>
                                                        {myReview.rating}.0
                                                    </strong>

                                                </div>

                                            </div>

                                            <p className="review-comment">
                                                {myReview.comment}
                                            </p>

                                            <small className="review-date">

                                                {myReview.createdAt
                                                    ? `Reviewed on ${new Date(
                                                        myReview.createdAt
                                                    ).toLocaleDateString(
                                                        "en-IN",
                                                        {
                                                            day: "numeric",
                                                            month: "short",
                                                            year: "numeric"
                                                        }
                                                    )}`
                                                    : ""}

                                                {myReview.updatedAt &&
                                                    myReview.createdAt !==
                                                    myReview.updatedAt && (
                                                        <>
                                                            {" "}
                                                            · Updated{" "}
                                                            {new Date(
                                                                myReview.updatedAt
                                                            ).toLocaleDateString(
                                                                "en-IN",
                                                                {
                                                                    day: "numeric",
                                                                    month: "short",
                                                                    year: "numeric"
                                                                }
                                                            )}
                                                        </>
                                                    )}

                                            </small>

                                            <div
                                                style={{
                                                    display: "flex",
                                                    gap: "12px",
                                                    marginTop: "20px",
                                                    flexWrap: "wrap"
                                                }}
                                            >

                                                <button
                                                    type="button"
                                                    className="submit-review-button"
                                                    onClick={
                                                        startEditingReview
                                                    }
                                                >
                                                    ✏️ Edit Review
                                                </button>

                                                <button
                                                    type="button"
                                                    onClick={
                                                        deleteReview
                                                    }
                                                    disabled={
                                                        reviewDeleting
                                                    }
                                                    style={{
                                                        padding:
                                                            "12px 20px",
                                                        border:
                                                            "1px solid #dc2626",
                                                        borderRadius:
                                                            "8px",
                                                        background:
                                                            "#fff",
                                                        color:
                                                            "#dc2626",
                                                        fontWeight:
                                                            "600",
                                                        cursor:
                                                            reviewDeleting
                                                                ? "not-allowed"
                                                                : "pointer",
                                                        opacity:
                                                            reviewDeleting
                                                                ? 0.6
                                                                : 1
                                                    }}
                                                >
                                                    {reviewDeleting
                                                        ? "Deleting..."
                                                        : "🗑️ Delete Review"}
                                                </button>

                                            </div>

                                        </div>

                                    </div>

                                ) : (

                                    <div>

                                        <div className="write-review-header">

                                            <div>

                                                <p className="product-details-category">
                                                    UPDATE YOUR EXPERIENCE
                                                </p>

                                                <h2>
                                                    Edit Your Review
                                                </h2>

                                                <p>
                                                    Update your rating or
                                                    review comment.
                                                </p>

                                            </div>

                                        </div>

                                        <form
                                            className="review-form"
                                            onSubmit={
                                                updateReview
                                            }
                                        >

                                            <div className="review-form-group">

                                                <label>
                                                    Your Rating
                                                </label>

                                                <div className="star-selector">

                                                    {[1, 2, 3, 4, 5].map(
                                                        (star) => (

                                                            <button
                                                                key={star}
                                                                type="button"
                                                                className={
                                                                    star <=
                                                                    selectedRating
                                                                        ? "star-button selected"
                                                                        : "star-button"
                                                                }
                                                                onClick={() =>
                                                                    setSelectedRating(
                                                                        star
                                                                    )
                                                                }
                                                                aria-label={`Rate ${star} out of 5`}
                                                            >
                                                                {star <=
                                                                selectedRating
                                                                    ? "★"
                                                                    : "☆"}
                                                            </button>

                                                        )
                                                    )}

                                                </div>

                                                {selectedRating > 0 && (

                                                    <small className="selected-rating-text">
                                                        You selected{" "}
                                                        {selectedRating}{" "}
                                                        out of 5 stars
                                                    </small>

                                                )}

                                            </div>

                                            <div className="review-form-group">

                                                <label htmlFor="editReviewComment">
                                                    Your Review
                                                </label>

                                                <textarea
                                                    id="editReviewComment"
                                                    value={
                                                        reviewComment
                                                    }
                                                    onChange={(
                                                        event
                                                    ) =>
                                                        setReviewComment(
                                                            event.target
                                                                .value
                                                        )
                                                    }
                                                    placeholder="Share your experience with this product..."
                                                    maxLength={1000}
                                                    rows={5}
                                                />

                                                <small className="review-character-count">
                                                    {
                                                        reviewComment.length
                                                    }
                                                    /1000
                                                </small>

                                            </div>

                                            {reviewError && (

                                                <div className="review-error-message">
                                                    {reviewError}
                                                </div>

                                            )}

                                            {reviewMessage && (

                                                <div className="review-success-message">
                                                    {reviewMessage}
                                                </div>

                                            )}

                                            <div
                                                style={{
                                                    display: "flex",
                                                    gap: "12px",
                                                    flexWrap: "wrap"
                                                }}
                                            >

                                                <button
                                                    type="submit"
                                                    className="submit-review-button"
                                                    disabled={
                                                        reviewUpdating
                                                    }
                                                >
                                                    {reviewUpdating
                                                        ? "Updating Review..."
                                                        : "✓ Save Changes"}
                                                </button>

                                                <button
                                                    type="button"
                                                    onClick={
                                                        cancelEditingReview
                                                    }
                                                    disabled={
                                                        reviewUpdating
                                                    }
                                                    style={{
                                                        padding:
                                                            "12px 20px",
                                                        border:
                                                            "1px solid #d1d5db",
                                                        borderRadius:
                                                            "8px",
                                                        background:
                                                            "#fff",
                                                        color:
                                                            "#374151",
                                                        fontWeight:
                                                            "600",
                                                        cursor:
                                                            reviewUpdating
                                                                ? "not-allowed"
                                                                : "pointer"
                                                    }}
                                                >
                                                    Cancel
                                                </button>

                                            </div>

                                        </form>

                                    </div>

                                )}

                            </>

                        ) : (

                            <>

                                <div className="write-review-header">

                                    <div>

                                        <p className="product-details-category">
                                            SHARE YOUR EXPERIENCE
                                        </p>

                                        <h2>
                                            Write a Review
                                        </h2>

                                        <p>
                                            Tell other customers what you
                                            think about this product.
                                        </p>

                                    </div>

                                </div>

                                <form
                                    className="review-form"
                                    onSubmit={submitReview}
                                >

                                    <div className="review-form-group">

                                        <label>
                                            Your Rating
                                        </label>

                                        <div className="star-selector">

                                            {[1, 2, 3, 4, 5].map(
                                                (star) => (

                                                    <button
                                                        key={star}
                                                        type="button"
                                                        className={
                                                            star <=
                                                            selectedRating
                                                                ? "star-button selected"
                                                                : "star-button"
                                                        }
                                                        onClick={() =>
                                                            setSelectedRating(
                                                                star
                                                            )
                                                        }
                                                        aria-label={`Rate ${star} out of 5`}
                                                    >
                                                        {star <=
                                                        selectedRating
                                                            ? "★"
                                                            : "☆"}
                                                    </button>

                                                )
                                            )}

                                        </div>

                                        {selectedRating > 0 && (

                                            <small className="selected-rating-text">
                                                You selected{" "}
                                                {selectedRating} out of 5 stars
                                            </small>

                                        )}

                                    </div>

                                    <div className="review-form-group">

                                        <label htmlFor="reviewComment">
                                            Your Review
                                        </label>

                                        <textarea
                                            id="reviewComment"
                                            value={reviewComment}
                                            onChange={(event) =>
                                                setReviewComment(
                                                    event.target.value
                                                )
                                            }
                                            placeholder="Share your experience with this product..."
                                            maxLength={1000}
                                            rows={5}
                                        />

                                        <small className="review-character-count">
                                            {reviewComment.length}/1000
                                        </small>

                                    </div>

                                    {reviewError && (

                                        <div className="review-error-message">
                                            {reviewError}
                                        </div>

                                    )}

                                    {reviewMessage && (

                                        <div className="review-success-message">
                                            {reviewMessage}
                                        </div>

                                    )}

                                    <button
                                        type="submit"
                                        className="submit-review-button"
                                        disabled={reviewSubmitting}
                                    >
                                        {reviewSubmitting
                                            ? "Submitting Review..."
                                            : "⭐ Submit Review"}
                                    </button>

                                </form>

                            </>

                        )}

                    </section>

                )}

                {/* =====================================================
                        AI REVIEW SUMMARY
                    ===================================================== */}

                <section className="ai-review-summary-section">

                    <div className="ai-review-summary-header">

                        <div>

                            <p className="ai-review-summary-label">
                                AI INSIGHTS
                            </p>

                            <h3>
                                ✨ AI Review Summary
                            </h3>

                            <p>
                                Get a quick summary of what customers are
                                saying about this product.
                            </p>

                        </div>

                        <button
                            type="button"
                            className="ai-review-summary-button"
                            onClick={generateAiReviewSummary}
                            disabled={aiReviewSummaryLoading}
                        >
                            {aiReviewSummaryLoading
                                ? "Analyzing Reviews..."
                                : "✨ Summarize Reviews"}
                        </button>

                    </div>

                    {aiReviewSummaryError && (

                        <p className="ai-review-summary-error">
                            {aiReviewSummaryError}
                        </p>

                    )}

                    {aiReviewSummary && (

                        <div className="ai-review-summary-result">

                            {aiReviewSummary
                                .split("\n")
                                .map((line, index) => (

                                    <div key={index}>
                                        {line.replace(/\*\*/g, "")}
                                    </div>

                                ))}

                        </div>

                    )}

                </section>

                {/* =====================================================
                        CUSTOMER REVIEWS
                    ===================================================== */}

                <section className="product-reviews-section">

                    <div className="product-reviews-header">

                        <div>

                            <p className="product-details-category">
                                CUSTOMER FEEDBACK
                            </p>

                            <h2>
                                Customer Reviews
                            </h2>

                        </div>

                        <div className="reviews-summary">

                            <strong>
                                {averageRating > 0
                                    ? averageRating.toFixed(1)
                                    : "0.0"}
                            </strong>

                            <span>
                                ⭐
                            </span>

                            <small>
                                {totalReviews}{" "}
                                {totalReviews === 1
                                    ? "review"
                                    : "reviews"}
                            </small>

                        </div>

                    </div>

                    {reviewsLoading ? (

                        <div className="reviews-loading">
                            Loading reviews...
                        </div>

                    ) : reviews.length === 0 ? (

                        <div className="no-reviews">

                            <div className="no-reviews-icon">
                                💬
                            </div>

                            <h3>
                                No reviews yet
                            </h3>

                            <p>
                                Be the first customer to review
                                this product.
                            </p>

                        </div>

                    ) : (

                        <div className="reviews-list">

                            {reviews.map((review) => (

                                <div
                                    className="review-card"
                                    key={review.id}
                                >

                                    <div className="review-card-header">

                                        <div className="review-customer">

                                            <div className="review-avatar">

                                                {review.customerName
                                                    ?.charAt(0)
                                                    ?.toUpperCase() || "C"}

                                            </div>

                                            <div>

                                                <strong>
                                                    {review.customerName}
                                                </strong>

                                                <small>
                                                    Verified Customer
                                                </small>

                                            </div>

                                        </div>

                                        <div className="review-rating">

                                            <span>
                                                {"⭐".repeat(
                                                    review.rating
                                                )}
                                            </span>

                                            <strong>
                                                {review.rating}.0
                                            </strong>

                                        </div>

                                    </div>

                                    <p className="review-comment">
                                        {review.comment}
                                    </p>

                                    <small className="review-date">

                                        {review.createdAt
                                            ? new Date(
                                                review.createdAt
                                            ).toLocaleDateString(
                                                "en-IN",
                                                {
                                                    day: "numeric",
                                                    month: "short",
                                                    year: "numeric"
                                                }
                                            )
                                            : ""}

                                    </small>

                                </div>

                            ))}

                        </div>

                    )}

                </section>

                {/* PRODUCT HIGHLIGHTS */}

                <section className="product-highlights">

                    <div className="product-highlight-card">

                        <div className="highlight-icon">
                            🚚
                        </div>

                        <div>

                            <strong>
                                Fast Delivery
                            </strong>

                            <span>
                                Reliable order fulfillment
                            </span>

                        </div>

                    </div>

                    <div className="product-highlight-card">

                        <div className="highlight-icon">
                            🔒
                        </div>

                        <div>

                            <strong>
                                Secure Payments
                            </strong>

                            <span>
                                Safe and protected checkout
                            </span>

                        </div>

                    </div>

                    <div className="product-highlight-card">

                        <div className="highlight-icon">
                            🛡️
                        </div>

                        <div>

                            <strong>
                                Trusted Marketplace
                            </strong>

                            <span>
                                Quality sellers on ShopSphere
                            </span>

                        </div>

                    </div>

                </section>

            </main>

            {/* FOOTER */}

            <footer className="footer">

                <div className="footer-brand">

                    <h2>
                        Shop<span>Sphere</span>
                    </h2>

                    <p>
                        Your smarter online shopping destination.
                    </p>

                </div>

                <div className="footer-bottom">

                    <p>
                        © 2026 ShopSphere
                    </p>

                    <p>
                        Built with React + Spring Boot
                    </p>

                </div>

            </footer>

        </div>
    );
}

export default ProductDetails;