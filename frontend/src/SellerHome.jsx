import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "./api";
import "./App.css";

function SellerHome() {
    const [products, setProducts] = useState([]);
    const [seller, setSeller] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        loadSellerStore();
    }, []);

    const loadSellerStore = async () => {
        try {
            setLoading(true);
            setError("");

            const [sellerResponse, productsResponse] = await Promise.all([
                api.get("/api/sellers/me"),
                api.get("/api/products/my-products")
            ]);

            setSeller(sellerResponse.data);
            setProducts(productsResponse.data);
        } catch (err) {
            console.error("Failed to load seller store:", err);
            setError("Unable to load your store. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (productId) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this product?"
        );

        if (!confirmed) return;

        try {
            await api.delete(`/api/products/${productId}`);

            setProducts((currentProducts) =>
                currentProducts.filter((product) => product.id !== productId)
            );

            alert("Product deleted successfully.");
        } catch (err) {
            console.error("Delete failed:", err);
            alert("Failed to delete product.");
        }
    };

    if (loading) {
        return (
            <div className="page-container">
                <h2>Loading your store...</h2>
            </div>
        );
    }

    if (error) {
        return (
            <div className="page-container">
                <h2>{error}</h2>
                <button onClick={loadSellerStore}>Try Again</button>
            </div>
        );
    }

    return (
        <div className="seller-home-page">

            {/* Seller Navigation */}
            <nav className="seller-navbar">
                <div className="seller-navbar-brand">
                    🏪 {seller?.storeName || "My Store"}
                </div>

                <div className="seller-navbar-links">
                    <Link to="/seller/home" className="active">
                        Home
                    </Link>

                    <Link to="/seller/dashboard">
                        Dashboard
                    </Link>

                    <Link to="/seller/products">
                        My Products
                    </Link>

                    <Link to="/seller/reviews">
                        Reviews
                    </Link>

                    <Link to="/seller/profile">
                        My Profile
                    </Link>
                </div>
            </nav>

            {/* Store Header */}
            <section className="seller-store-header">

                <div>
                    <p className="seller-store-label">
                        SHOPSPHERE SELLER STORE
                    </p>

                    <h1>
                        Welcome to {seller?.storeName || "Your Store"} 👋
                    </h1>

                    <p>
                        {seller?.description ||
                            "Showcase and manage your products on ShopSphere."}
                    </p>
                </div>

                <div className="seller-store-status">
                    <span>
                        {seller?.approved
                            ? "✓ Approved Seller"
                            : "⏳ Pending Approval"}
                    </span>
                </div>

            </section>

            {/* Store Statistics */}
            <section className="seller-store-stats">

                <div className="seller-stat-card">
                    <span>Products</span>
                    <strong>{products.length}</strong>
                </div>

                <div className="seller-stat-card">
                    <span>Store</span>
                    <strong>{seller?.storeName || "-"}</strong>
                </div>

                <div className="seller-stat-card">
                    <span>Status</span>
                    <strong>
                        {seller?.approved ? "Approved" : "Pending"}
                    </strong>
                </div>

            </section>

            {/* Products */}
            <section className="seller-products-section">

                <div className="seller-section-heading">

                    <div>
                        <p className="seller-store-label">
                            YOUR CATALOG
                        </p>

                        <h2>
                            Products from {seller?.storeName || "Your Store"}
                        </h2>
                    </div>

                    <Link
                        to="/seller/products"
                        className="seller-add-product-button"
                    >
                        + Manage Products
                    </Link>

                </div>

                {products.length === 0 ? (

                    <div className="seller-empty-state">

                        <div className="seller-empty-icon">
                            📦
                        </div>

                        <h3>
                            Your store is empty
                        </h3>

                        <p>
                            You haven't added any products yet.
                        </p>

                        <Link
                            to="/seller/products"
                            className="seller-add-product-button"
                        >
                            Add Your First Product
                        </Link>

                    </div>

                ) : (

                    <div className="seller-product-grid">

                        {products.map((product) => (

                            <div
                                className="seller-product-card"
                                key={product.id}
                            >

                                <div className="seller-product-image">
                                    🛍️
                                </div>

                                <div className="seller-product-content">

                                    <p className="seller-product-category">
                                        {product.categoryName ||
                                            "Product"}
                                    </p>

                                    <h3>
                                        {product.name}
                                    </h3>

                                    <p className="seller-product-description">
                                        {product.description}
                                    </p>

                                    <div className="seller-product-price">
                                        ₹
                                        {Number(product.price).toLocaleString(
                                            "en-IN"
                                        )}
                                    </div>

                                    <div className="seller-product-stock">

                                        <span>
                                            Stock:{" "}
                                            <strong>
                                                {product.stockQuantity}
                                            </strong>
                                        </span>

                                        <span
                                            className={
                                                product.stockQuantity > 0
                                                    ? "stock-available"
                                                    : "stock-out"
                                            }
                                        >
                                            {product.stockQuantity > 0
                                                ? "In Stock"
                                                : "Out of Stock"}
                                        </span>

                                    </div>

                                    <div className="seller-product-actions">

                                        <Link
                                            to={`/products/${product.id}`}
                                            className="seller-view-button"
                                        >
                                            View
                                        </Link>

                                        <Link
                                            to="/seller/products"
                                            className="seller-edit-button"
                                        >
                                            Edit
                                        </Link>

                                        <button
                                            className="seller-delete-button"
                                            onClick={() =>
                                                handleDelete(product.id)
                                            }
                                        >
                                            Delete
                                        </button>

                                    </div>

                                </div>

                            </div>

                        ))}

                    </div>

                )}

            </section>

        </div>
    );
}

export default SellerHome;