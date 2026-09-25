import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "./api";
import "./App.css";

function Wishlist() {
    const [wishlist, setWishlist] = useState(null);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(null);
    const [message, setMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const loadWishlist = async () => {
        try {
            setLoading(true);
            setErrorMessage("");

            const response = await api.get("/api/wishlist");

            console.log("My wishlist:", response.data);

            setWishlist(response.data);
        } catch (error) {
            console.error("Error loading wishlist:", error);

            setErrorMessage(
                error.response?.data?.message ||
                "Could not load your wishlist."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadWishlist();
    }, []);

    const removeFromWishlist = async (productId) => {
        try {
            setActionLoading(productId);
            setMessage("");
            setErrorMessage("");

            const response = await api.delete(
                `/api/wishlist/${productId}`
            );

            setWishlist(response.data);
            setMessage("Product removed from your wishlist.");
        } catch (error) {
            console.error(
                "Error removing product from wishlist:",
                error
            );

            setErrorMessage(
                error.response?.data?.message ||
                "Could not remove product from wishlist."
            );
        } finally {
            setActionLoading(null);
        }
    };

    const moveToCart = async (item) => {
        try {
            setActionLoading(item.productId);
            setMessage("");
            setErrorMessage("");

            // Add product to cart
            await api.post("/api/cart/items", {
                productId: item.productId,
                quantity: 1
            });

            // Remove product from wishlist
            const response = await api.delete(
                `/api/wishlist/${item.productId}`
            );

            setWishlist(response.data);

            setMessage(
                `${item.productName} moved to your cart.`
            );
        } catch (error) {
            console.error(
                "Error moving product to cart:",
                error
            );

            setErrorMessage(
                error.response?.data?.message ||
                "Could not move product to cart."
            );
        } finally {
            setActionLoading(null);
        }
    };

    if (loading) {
        return (
            <div className="app">

                <nav className="navbar">
                    <Link to="/" className="logo">
                        Shop<span>Sphere</span>
                    </Link>
                </nav>

                <main className="premium-wishlist-loading">

                    <div className="wishlist-loading-icon">
                        ❤️
                    </div>

                    <h2>
                        Loading your wishlist...
                    </h2>

                    <p>
                        Please wait while we retrieve your saved products.
                    </p>

                </main>

            </div>
        );
    }

    const items = wishlist?.items || [];
    const wishlistCount = items.length;

    return (
        <div className="app">

            {/* =====================================================
                NAVBAR
                ===================================================== */}

            <nav className="navbar">

                <Link to="/" className="logo">
                    Shop<span>Sphere</span>
                </Link>

                <div className="nav-actions">

                    <Link to="/">
                        Home
                    </Link>

                    <Link to="/products">
                        Products
                    </Link>

                    <Link
                        to="/wishlist"
                        className="active-nav-link"
                    >
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


            {/* =====================================================
                MAIN WISHLIST PAGE
                ===================================================== */}

            <main className="premium-wishlist-page">

                {/* PAGE HEADER */}

                <section className="wishlist-page-header">

                    <div>

                        <span className="section-eyebrow">
                            SHOPSPHERE WISHLIST
                        </span>

                        <h1>
                            Your Wishlist ❤️
                        </h1>

                        <p>
                            Save products you love and come back to them anytime.
                        </p>

                    </div>

                    {wishlistCount > 0 && (
                        <div className="wishlist-count-card">

                            <strong>
                                {wishlistCount}
                            </strong>

                            <span>
                                {wishlistCount === 1
                                    ? "SAVED ITEM"
                                    : "SAVED ITEMS"}
                            </span>

                        </div>
                    )}

                </section>


                {/* =================================================
                    MESSAGES
                    ================================================= */}

                {message && (
                    <div className="premium-wishlist-message success">

                        <span>✓</span>

                        <p>
                            {message}
                        </p>

                    </div>
                )}


                {errorMessage && (
                    <div className="premium-wishlist-message error">

                        <span>!</span>

                        <p>
                            {errorMessage}
                        </p>

                    </div>
                )}


                {/* =================================================
                    EMPTY WISHLIST
                    ================================================= */}

                {wishlistCount === 0 ? (

                    <section className="premium-empty-wishlist">

                        <div className="wishlist-empty-visual">
                            ❤️
                        </div>

                        <span className="section-eyebrow">
                            YOUR WISHLIST
                        </span>

                        <h2>
                            Your wishlist is empty
                        </h2>

                        <p>
                            Save products you're interested in and
                            they'll appear here for easy access later.
                        </p>

                        <Link
                            to="/products"
                            className="wishlist-browse-button"
                        >
                            Browse Products
                            <span>→</span>
                        </Link>

                    </section>

                ) : (

                    /* =================================================
                       WISHLIST CONTENT
                       ================================================= */

                    <section className="wishlist-content">

                        <div className="wishlist-section-header">

                            <div>

                                <span>
                                    SAVED PRODUCTS
                                </span>

                                <h2>
                                    Items you've saved
                                </h2>

                            </div>

                            <Link
                                to="/products"
                                className="wishlist-continue-link"
                            >
                                Continue Shopping →
                            </Link>

                        </div>


                        <div className="premium-wishlist-grid">

                            {items.map((item) => {

                                const isLoading =
                                    actionLoading === item.productId;

                                const isInStock =
                                    Number(item.stockQuantity) > 0;

                                return (
                                    <article
                                        className="premium-wishlist-card"
                                        key={item.id}
                                    >

                                        {/* PRODUCT VISUAL */}

                                        <div className="wishlist-product-visual">

                                            <div className="wishlist-product-icon">
                                                🛍️
                                            </div>

                                            <button
                                                type="button"
                                                className="wishlist-heart-button"
                                                onClick={() =>
                                                    removeFromWishlist(
                                                        item.productId
                                                    )
                                                }
                                                disabled={isLoading}
                                                title="Remove from wishlist"
                                            >
                                                ♥
                                            </button>

                                            {!isInStock && (
                                                <span className="wishlist-out-stock-badge">
                                                    OUT OF STOCK
                                                </span>
                                            )}

                                        </div>


                                        {/* PRODUCT INFORMATION */}

                                        <div className="wishlist-product-information">

                                            <span className="wishlist-product-category">
                                                {item.categoryName ||
                                                    "Uncategorized"}
                                            </span>

                                            <Link
                                                to={`/products/${item.productId}`}
                                                className="wishlist-product-name"
                                            >
                                                {item.productName}
                                            </Link>

                                            <p className="wishlist-product-description">
                                                {item.description ||
                                                    "No product description available."}
                                            </p>

                                            {item.storeName && (
                                                <p className="wishlist-seller">
                                                    Sold by{" "}
                                                    <strong>
                                                        {item.storeName}
                                                    </strong>
                                                </p>
                                            )}


                                            {/* PRICE */}

                                            <div className="wishlist-product-price-row">

                                                <strong>
                                                    ₹
                                                    {Number(
                                                        item.price
                                                    ).toLocaleString(
                                                        "en-IN"
                                                    )}
                                                </strong>

                                                {isInStock ? (
                                                    <span className="wishlist-stock available">
                                                        ✓ In Stock
                                                    </span>
                                                ) : (
                                                    <span className="wishlist-stock unavailable">
                                                        Out of Stock
                                                    </span>
                                                )}

                                            </div>


                                            {/* STOCK COUNT */}

                                            {isInStock && (
                                                <p className="wishlist-stock-count">
                                                    {item.stockQuantity}{" "}
                                                    {Number(item.stockQuantity) === 1
                                                        ? "unit"
                                                        : "units"}{" "}
                                                    available
                                                </p>
                                            )}

                                        </div>


                                        {/* ACTIONS */}

                                        <div className="wishlist-card-actions">

                                            <Link
                                                to={`/products/${item.productId}`}
                                                className="wishlist-view-button"
                                            >
                                                View Product
                                                <span>→</span>
                                            </Link>

                                            {isInStock && (
                                                <button
                                                    type="button"
                                                    className="wishlist-cart-button"
                                                    onClick={() =>
                                                        moveToCart(item)
                                                    }
                                                    disabled={isLoading}
                                                >
                                                    {isLoading
                                                        ? "Moving..."
                                                        : "🛒 Add to Cart"}
                                                </button>
                                            )}

                                            <button
                                                type="button"
                                                className="wishlist-remove-button"
                                                onClick={() =>
                                                    removeFromWishlist(
                                                        item.productId
                                                    )
                                                }
                                                disabled={isLoading}
                                            >
                                                {isLoading
                                                    ? "Removing..."
                                                    : "Remove from Wishlist"}
                                            </button>

                                        </div>

                                    </article>
                                );
                            })}

                        </div>

                    </section>

                )}

            </main>


            {/* =====================================================
                FOOTER
                ===================================================== */}

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

export default Wishlist;