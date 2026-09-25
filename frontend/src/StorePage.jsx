import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "./api";
import "./App.css";

function StorePage() {
    const { sellerId } = useParams();

    const [seller, setSeller] = useState(null);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        loadStore();
    }, [sellerId]);

    const loadStore = async () => {
        try {
            setLoading(true);
            setError("");

            const [sellerResponse, productsResponse] =
                await Promise.all([
                    api.get(`/api/sellers/${sellerId}`),
                    api.get(`/api/products/seller/${sellerId}`)
                ]);

            setSeller(sellerResponse.data);
            setProducts(productsResponse.data);

        } catch (err) {
            console.error("Failed to load store:", err);

            setError(
                err.response?.data?.message ||
                "Unable to load this store."
            );
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="page-container store-page-loading">
                <h2>Loading store...</h2>
            </div>
        );
    }

    if (error) {
        return (
            <div className="page-container store-page-error">
                <h2>{error}</h2>

                <button
                    className="primary-btn"
                    onClick={loadStore}
                >
                    Try Again
                </button>
            </div>
        );
    }

    if (!seller) {
        return (
            <div className="page-container">
                <h2>Store not found.</h2>
            </div>
        );
    }

    return (
        <div className="store-page">

            {/* BACK */}

            <div className="store-page-container">

                <Link
                    to="/products"
                    className="store-back-link"
                >
                    ← Back to Products
                </Link>


                {/* STORE HEADER */}

                <section className="store-header-card">

                    <div className="store-header-image">

                        {seller.storeImageUrl ? (
                            <img
                                src={seller.storeImageUrl}
                                alt={`${seller.storeName} store`}
                                onError={(event) => {
                                    event.currentTarget.style.display =
                                        "none";

                                    if (
                                        event.currentTarget
                                            .nextElementSibling
                                    ) {
                                        event.currentTarget
                                            .nextElementSibling
                                            .style.display = "flex";
                                    }
                                }}
                            />
                        ) : null}

                        <span
                            style={{
                                display: seller.storeImageUrl
                                    ? "none"
                                    : "flex"
                            }}
                        >
                            🏪
                        </span>

                    </div>


                    <div className="store-header-content">

                        <p className="store-label">
                            SHOPSPHERE STORE
                        </p>

                        <h1>
                            {seller.storeName}
                        </h1>

                        <p className="store-description">
                            {seller.description ||
                                "Welcome to our ShopSphere store."}
                        </p>

                        <div className="store-seller-info">

                            <span>
                                Seller:{" "}
                                <strong>
                                    {seller.name}
                                </strong>
                            </span>

                            {seller.approved && (
                                <span className="store-approved-badge">
                                    ✓ Approved Seller
                                </span>
                            )}

                        </div>

                    </div>

                </section>


                {/* STORE STATISTICS */}

                <section className="store-statistics">

                    <div className="store-stat-card">

                        <span>
                            Products
                        </span>

                        <strong>
                            {products.length}
                        </strong>

                    </div>

                    <div className="store-stat-card">

                        <span>
                            Store Status
                        </span>

                        <strong>
                            {seller.approved
                                ? "Approved"
                                : "Pending"}
                        </strong>

                    </div>

                    <div className="store-stat-card">

                        <span>
                            ShopSphere
                        </span>

                        <strong>
                            Marketplace
                        </strong>

                    </div>

                </section>


                {/* PRODUCTS */}

                <section className="store-products-section">

                    <div className="store-products-heading">

                        <div>
                            <p className="store-label">
                                STORE CATALOG
                            </p>

                            <h2>
                                Products from{" "}
                                {seller.storeName}
                            </h2>
                        </div>

                    </div>


                    {products.length === 0 ? (

                        <div className="store-empty-state">

                            <div className="store-empty-icon">
                                📦
                            </div>

                            <h3>
                                No products available
                            </h3>

                            <p>
                                This store hasn't added any
                                products yet.
                            </p>

                        </div>

                    ) : (

                        <div className="store-product-grid">

                            {products.map((product) => (

                                <div
                                    className="store-product-card"
                                    key={product.id}
                                >

                                    <Link
                                        to={`/products/${product.id}`}
                                        className="store-product-image-link"
                                    >

                                        <div className="store-product-image">

                                            {product.imageUrl ? (
                                                <img
                                                    src={
                                                        product.imageUrl
                                                    }
                                                    alt={
                                                        product.name
                                                    }
                                                    onError={(
                                                        event
                                                    ) => {
                                                        event.currentTarget.style.display =
                                                            "none";

                                                        if (
                                                            event
                                                                .currentTarget
                                                                .nextElementSibling
                                                        ) {
                                                            event.currentTarget
                                                                .nextElementSibling
                                                                .style.display =
                                                                "flex";
                                                        }
                                                    }}
                                                />
                                            ) : null}

                                            <span
                                                style={{
                                                    display:
                                                        product.imageUrl
                                                            ? "none"
                                                            : "flex"
                                                }}
                                            >
                                                🛍️
                                            </span>

                                        </div>

                                    </Link>


                                    <div className="store-product-content">

                                        <p className="store-product-category">
                                            {product.categoryName ||
                                                "Product"}
                                        </p>

                                        <h3>
                                            {product.name}
                                        </h3>

                                        <p className="store-product-description">
                                            {product.description}
                                        </p>

                                        <div className="store-product-bottom">

                                            <strong>
                                                ₹
                                                {Number(
                                                    product.price
                                                ).toLocaleString(
                                                    "en-IN"
                                                )}
                                            </strong>

                                            <span
                                                className={
                                                    product.stockQuantity >
                                                    0
                                                        ? "store-stock available"
                                                        : "store-stock out"
                                                }
                                            >
                                                {product.stockQuantity >
                                                0
                                                    ? "In Stock"
                                                    : "Out of Stock"}
                                            </span>

                                        </div>

                                        <Link
                                            to={`/products/${product.id}`}
                                            className="store-view-product-button"
                                        >
                                            View Product
                                        </Link>

                                    </div>

                                </div>

                            ))}

                        </div>

                    )}

                </section>

            </div>

        </div>
    );
}

export default StorePage;