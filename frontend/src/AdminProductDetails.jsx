import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import api from "./api";
import "./App.css";

function AdminProductDetails() {

    const { id } = useParams();
    const navigate = useNavigate();

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        loadProduct();
    }, [id]);

    const loadProduct = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await api.get(
                "/api/admin/products"
            );

            const products = Array.isArray(response.data)
                ? response.data
                : [];

            const foundProduct = products.find(
                (item) => String(item.id) === String(id)
            );

            if (!foundProduct) {
                setError("Product not found.");
                return;
            }

            setProduct(foundProduct);

        } catch (err) {

            console.error(
                "Failed to load admin product:",
                err
            );

            setError(
                err.response?.data?.message ||
                "Unable to load product details."
            );

        } finally {
            setLoading(false);
        }
    };

    const getStockStatus = (stock) => {

        if (stock === 0) {
            return {
                text: "Out of Stock",
                className: "admin-detail-stock-out"
            };
        }

        if (stock <= 5) {
            return {
                text: "Low Stock",
                className: "admin-detail-stock-low"
            };
        }

        return {
            text: "In Stock",
            className: "admin-detail-stock-good"
        };
    };

    const handleLogout = () => {

        const confirmed = window.confirm(
            "Are you sure you want to logout?"
        );

        if (!confirmed) return;

        localStorage.removeItem("token");
        localStorage.removeItem("user");

        window.location.href = "/login";
    };

    if (loading) {
        return (
            <div className="admin-loading-page">

                <div className="admin-loading-icon">
                    📦
                </div>

                <h2>
                    Loading Product...
                </h2>

                <p>
                    Please wait while we fetch the product details.
                </p>

            </div>
        );
    }

    if (error || !product) {
        return (
            <div className="admin-loading-page">

                <div className="admin-loading-icon">
                    ⚠️
                </div>

                <h2>
                    Product Not Found
                </h2>

                <p>
                    {error || "This product could not be found."}
                </p>

                <button
                    className="admin-primary-button"
                    onClick={() =>
                        navigate("/admin/products")
                    }
                >
                    Back to Products
                </button>

            </div>
        );
    }

    const stockStatus = getStockStatus(
        product.stockQuantity ?? 0
    );

    return (
        <div className="admin-product-details-page">

            {/* =================================================
                NAVBAR
                ================================================= */}

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

                    <Link
                        to="/admin/products"
                        className="active"
                    >
                        Products
                    </Link>

                    <Link to="/admin/orders">
                        Orders
                    </Link>

                </div>

                <button
                    className="admin-logout-button"
                    onClick={handleLogout}
                >
                    Logout
                </button>

            </nav>


            {/* =================================================
                MAIN CONTENT
                ================================================= */}

            <main className="admin-product-details-container">

                {/* BACK */}

                <Link
                    to="/admin/products"
                    className="admin-product-back-link"
                >
                    ← Back to Products
                </Link>


                {/* HEADER */}

                <section className="admin-product-details-header">

                    <div>

                        <p className="admin-eyebrow">
                            PRODUCT MANAGEMENT
                        </p>

                        <h1>
                            {product.name}
                        </h1>

                        <p>
                            Marketplace product details
                        </p>

                    </div>

                    <div className="admin-product-id-badge">

                        PRODUCT ID #

                        <strong>
                            {product.id}
                        </strong>

                    </div>

                </section>


                {/* PRODUCT OVERVIEW */}

                <section className="admin-product-overview-grid">

                    {/* PRODUCT CARD */}

                    <div className="admin-product-detail-card">

                        <div className="admin-detail-card-heading">

                            <div className="admin-detail-icon">
                                📦
                            </div>

                            <div>

                                <span>
                                    PRODUCT
                                </span>

                                <h2>
                                    Product Information
                                </h2>

                            </div>

                        </div>


                        <div className="admin-detail-info-list">

                            <div className="admin-detail-row">

                                <span>
                                    Product Name
                                </span>

                                <strong>
                                    {product.name}
                                </strong>

                            </div>

                            <div className="admin-detail-row">

                                <span>
                                    Product ID
                                </span>

                                <strong>
                                    #{product.id}
                                </strong>

                            </div>

                            <div className="admin-detail-row">

                                <span>
                                    Category
                                </span>

                                <strong>
                                    {product.categoryName ||
                                        "Uncategorized"}
                                </strong>

                            </div>

                            <div className="admin-detail-row">

                                <span>
                                    Category ID
                                </span>

                                <strong>
                                    {product.categoryId || "-"}
                                </strong>

                            </div>

                            <div className="admin-detail-row">

                                <span>
                                    Price
                                </span>

                                <strong className="admin-detail-price">
                                    ₹
                                    {Number(
                                        product.price || 0
                                    ).toLocaleString("en-IN")}
                                </strong>

                            </div>

                            <div className="admin-detail-row">

                                <span>
                                    Stock Quantity
                                </span>

                                <strong>
                                    {product.stockQuantity ?? 0}
                                </strong>

                            </div>

                            <div className="admin-detail-row">

                                <span>
                                    Stock Status
                                </span>

                                <span
                                    className={
                                        stockStatus.className
                                    }
                                >
                                    {stockStatus.text}
                                </span>

                            </div>

                        </div>

                    </div>


                    {/* SELLER CARD */}

                    <div className="admin-product-detail-card">

                        <div className="admin-detail-card-heading">

                            <div className="admin-detail-icon">
                                🏪
                            </div>

                            <div>

                                <span>
                                    SELLER
                                </span>

                                <h2>
                                    Seller Information
                                </h2>

                            </div>

                        </div>


                        <div className="admin-detail-info-list">

                            <div className="admin-detail-row">

                                <span>
                                    Seller Name
                                </span>

                                <strong>
                                    {product.sellerName ||
                                        "Unknown Seller"}
                                </strong>

                            </div>

                            <div className="admin-detail-row">

                                <span>
                                    Seller ID
                                </span>

                                <strong>
                                    {product.sellerId
                                        ? `#${product.sellerId}`
                                        : "-"}
                                </strong>

                            </div>

                            <div className="admin-detail-row">

                                <span>
                                    Store Name
                                </span>

                                <strong>
                                    {product.storeName ||
                                        "Unknown Store"}
                                </strong>

                            </div>

                        </div>


                        <div className="admin-seller-note">

                            <span>
                                ℹ️
                            </span>

                            <p>
                                This product belongs to the
                                seller shown above. Seller
                                product management remains
                                separate from the Admin portal.
                            </p>

                        </div>

                    </div>

                </section>


                {/* DESCRIPTION */}

                <section className="admin-product-description-card">

                    <div className="admin-detail-card-heading">

                        <div className="admin-detail-icon">
                            📝
                        </div>

                        <div>

                            <span>
                                DESCRIPTION
                            </span>

                            <h2>
                                Product Description
                            </h2>

                        </div>

                    </div>

                    <p>
                        {product.description ||
                            "No product description available."}
                    </p>

                </section>


                {/* ADMIN ACTIONS */}

                <section className="admin-product-actions-card">

                    <div>

                        <p className="admin-eyebrow">
                            ADMIN ACTIONS
                        </p>

                        <h2>
                            Product Management
                        </h2>

                        <p>
                            Use the Admin Products page to
                            monitor marketplace products.
                        </p>

                    </div>

                    <div className="admin-product-action-buttons">

                        <Link
                            to="/admin/products"
                            className="admin-secondary-action-button"
                        >
                            ← All Products
                        </Link>

                    </div>

                </section>

            </main>


            {/* FOOTER */}

            <footer className="admin-footer">

                <p>
                    © 2026 ShopSphere. Admin Center.
                </p>

            </footer>

        </div>
    );
}

export default AdminProductDetails;