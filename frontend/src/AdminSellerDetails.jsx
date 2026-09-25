import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import api from "./api";
import "./App.css";

function AdminSellerDetails() {

    const { id } = useParams();
    const navigate = useNavigate();

    const [seller, setSeller] = useState(null);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        loadSellerDetails();
    }, [id]);

    const loadSellerDetails = async () => {

        try {
            setLoading(true);
            setError("");

            const [sellerResponse, productsResponse] =
                await Promise.all([
                    api.get(`/api/admin/sellers/${id}`),
                    api.get("/api/admin/products")
                ]);

            setSeller(sellerResponse.data);

            const allProducts = Array.isArray(productsResponse.data)
                ? productsResponse.data
                : [];

            setProducts(
                allProducts.filter(
                    (product) =>
                        String(product.sellerId) === String(id)
                )
            );

        } catch (err) {

            console.error(
                "Failed to load admin seller details:",
                err
            );

            setError(
                err.response?.data?.message ||
                "Unable to load seller details."
            );

        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {

        const confirmed = window.confirm(
            "Are you sure you want to logout?"
        );

        if (!confirmed) return;

        localStorage.removeItem("token");
        localStorage.removeItem("user");

        navigate("/login");
    };

    if (loading) {

        return (
            <div className="admin-seller-details-page">

                <div className="admin-seller-details-loading">

                    <div className="admin-seller-details-loading-icon">
                        🏪
                    </div>

                    <h2>
                        Loading Seller Details...
                    </h2>

                    <p>
                        Please wait while we fetch the seller information.
                    </p>

                </div>

            </div>
        );
    }

    if (error) {

        return (
            <div className="admin-seller-details-page">

                <div className="admin-seller-details-error">

                    <div className="admin-seller-details-error-icon">
                        ⚠️
                    </div>

                    <h2>
                        Unable to load seller
                    </h2>

                    <p>
                        {error}
                    </p>

                    <button
                        className="admin-primary-button"
                        onClick={loadSellerDetails}
                    >
                        Try Again
                    </button>

                </div>

            </div>
        );
    }

    return (
        <div className="admin-seller-details-page">

            {/* ================= NAVBAR ================= */}

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

                    <Link
                        to="/admin/sellers"
                        className="active"
                    >
                        Sellers
                    </Link>

                    <Link to="/admin/products">
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

            {/* ================= MAIN ================= */}

            <main className="admin-seller-details-container">

                <Link
                    to="/admin/sellers"
                    className="admin-seller-details-back-link"
                >
                    ← Back to Sellers
                </Link>

                {/* ================= HEADER ================= */}

                <section className="admin-seller-details-header">

                    <div>

                        <p className="admin-eyebrow">
                            ADMIN SELLER MANAGEMENT
                        </p>

                        <h1>
                            Seller Details
                        </h1>

                        <p>
                            View store and seller information from the
                            ShopSphere marketplace.
                        </p>

                    </div>

                    <div className="admin-seller-id-badge">
                        SELLER #{seller?.id}
                    </div>

                </section>

                {/* ================= SELLER OVERVIEW ================= */}

                <section className="admin-seller-overview-grid">

                    {/* OWNER INFORMATION */}

                    <div className="admin-seller-detail-card">

                        <div className="admin-detail-card-heading">

                            <span className="admin-detail-card-icon">
                                👤
                            </span>

                            <div>

                                <h2>
                                    Owner Information
                                </h2>

                                <p>
                                    Seller account owner
                                </p>

                            </div>

                        </div>

                        <div className="admin-detail-info-list">

                            <div className="admin-detail-row">

                                <span>
                                    Seller ID
                                </span>

                                <strong>
                                    #{seller?.id}
                                </strong>

                            </div>

                            <div className="admin-detail-row">

                                <span>
                                    Owner Name
                                </span>

                                <strong>
                                    {seller?.name || "-"}
                                </strong>

                            </div>

                            <div className="admin-detail-row">

                                <span>
                                    Owner Email
                                </span>

                                <strong>
                                    {seller?.email || "-"}
                                </strong>

                            </div>

                            <div className="admin-detail-row">

                                <span>
                                    User ID
                                </span>

                                <strong>
                                    #{seller?.userId || "-"}
                                </strong>

                            </div>

                        </div>

                    </div>

                    {/* STORE INFORMATION */}

                    <div className="admin-seller-detail-card">

                        <div className="admin-detail-card-heading">

                            <span className="admin-detail-card-icon">
                                🏪
                            </span>

                            <div>

                                <h2>
                                    Store Information
                                </h2>

                                <p>
                                    Marketplace store details
                                </p>

                            </div>

                        </div>

                        <div className="admin-detail-info-list">

                            <div className="admin-detail-row">

                                <span>
                                    Store Name
                                </span>

                                <strong>
                                    {seller?.storeName || "-"}
                                </strong>

                            </div>

                            <div className="admin-detail-row">

                                <span>
                                    Approval Status
                                </span>

                                <span
                                    className={
                                        seller?.approved
                                            ? "admin-seller-approved-badge"
                                            : "admin-seller-pending-badge"
                                    }
                                >
                                    {seller?.approved
                                        ? "Approved"
                                        : "Pending Approval"}
                                </span>

                            </div>

                            <div className="admin-detail-row">

                                <span>
                                    Products
                                </span>

                                <strong>
                                    {products.length}
                                </strong>

                            </div>

                        </div>

                    </div>

                </section>

                {/* ================= STORE DESCRIPTION ================= */}

                <section className="admin-seller-description-card">

                    <div className="admin-detail-card-heading">

                        <span className="admin-detail-card-icon">
                            📝
                        </span>

                        <div>

                            <h2>
                                Store Description
                            </h2>

                            <p>
                                Seller-provided store information
                            </p>

                        </div>

                    </div>

                    <div className="admin-seller-description">

                        {seller?.description ? (
                            <p>
                                {seller.description}
                            </p>
                        ) : (
                            <p className="admin-seller-no-description">
                                No store description has been provided.
                            </p>
                        )}

                    </div>

                </section>

                {/* ================= PRODUCTS ================= */}

                <section className="admin-seller-products-section">

                    <div className="admin-seller-products-heading">

                        <div>

                            <p className="admin-eyebrow">
                                SELLER CATALOG
                            </p>

                            <h2>
                                Products from {seller?.storeName || "this seller"}
                            </h2>

                        </div>

                        <span className="admin-seller-product-count">
                            {products.length} Product
                            {products.length !== 1 ? "s" : ""}
                        </span>

                    </div>

                    {products.length === 0 ? (

                        <div className="admin-seller-products-empty">

                            <div className="admin-seller-empty-icon">
                                📦
                            </div>

                            <h3>
                                No Products
                            </h3>

                            <p>
                                This seller has not added any products yet.
                            </p>

                        </div>

                    ) : (

                        <div className="admin-seller-products-grid">

                            {products.map((product) => (

                                <div
                                    className="admin-seller-product-card"
                                    key={product.id}
                                >

                                    <div className="admin-seller-product-icon">
                                        🛍️
                                    </div>

                                    <div className="admin-seller-product-content">

                                        <p className="admin-seller-product-category">
                                            {product.categoryName || "Product"}
                                        </p>

                                        <h3>
                                            {product.name}
                                        </h3>

                                        <p className="admin-seller-product-description">
                                            {product.description}
                                        </p>

                                        <div className="admin-seller-product-bottom">

                                            <strong>
                                                ₹{Number(product.price)
                                                .toLocaleString("en-IN")}
                                            </strong>

                                            <span>
                                                Stock: {product.stockQuantity}
                                            </span>

                                        </div>

                                    </div>

                                    <Link
                                        to={`/admin/products/${product.id}`}
                                        className="admin-seller-product-view-button"
                                    >
                                        View
                                    </Link>

                                </div>

                            ))}

                        </div>

                    )}

                </section>

                {/* ================= ADMIN NOTE ================= */}

                <section className="admin-seller-admin-note">

                    <div className="admin-seller-admin-note-icon">
                        ℹ️
                    </div>

                    <div>

                        <h3>
                            Admin View
                        </h3>

                        <p>
                            This page is designed for platform administration.
                            Seller management remains separate from the seller's
                            own dashboard and profile experience.
                        </p>

                    </div>

                </section>

                {/* ================= ACTIONS ================= */}

                <section className="admin-seller-details-actions">

                    <Link
                        to="/admin/sellers"
                        className="admin-secondary-button"
                    >
                        ← Back to Sellers
                    </Link>

                    <Link
                        to="/admin"
                        className="admin-primary-button"
                    >
                        Admin Dashboard
                    </Link>

                </section>

            </main>

            {/* ================= FOOTER ================= */}

            <footer className="admin-footer">

                <p>
                    © 2026 ShopSphere. Admin Center.
                </p>

            </footer>

        </div>
    );
}

export default AdminSellerDetails;