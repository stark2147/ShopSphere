import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "./api";
import "./App.css";

function AdminProducts() {

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        loadProducts();
    }, []);

    const loadProducts = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await api.get("/api/admin/products");

            setProducts(
                Array.isArray(response.data)
                    ? response.data
                    : []
            );

        } catch (err) {

            console.error(
                "Failed to load admin products:",
                err
            );

            setError(
                err.response?.data?.message ||
                "Unable to load products."
            );

        } finally {
            setLoading(false);
        }
    };

    const filteredProducts = products.filter((product) => {

        const search = searchTerm.toLowerCase();

        return (
            product.name?.toLowerCase().includes(search) ||
            product.categoryName?.toLowerCase().includes(search) ||
            product.sellerName?.toLowerCase().includes(search) ||
            product.storeName?.toLowerCase().includes(search)
        );
    });

    const getStockStatus = (stock) => {

        if (stock === 0) {
            return {
                text: "Out of Stock",
                className: "admin-stock-out"
            };
        }

        if (stock <= 5) {
            return {
                text: "Low Stock",
                className: "admin-stock-low"
            };
        }

        return {
            text: "In Stock",
            className: "admin-stock-good"
        };
    };

    if (loading) {
        return (
            <div className="admin-loading-page">

                <div className="admin-loading-icon">
                    📦
                </div>

                <h2>
                    Loading Products...
                </h2>

                <p>
                    Please wait while we fetch marketplace products.
                </p>

            </div>
        );
    }

    return (
        <div className="admin-products-page">

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
                    onClick={() => {

                        const confirmed =
                            window.confirm(
                                "Are you sure you want to logout?"
                            );

                        if (!confirmed) return;

                        localStorage.removeItem("token");
                        localStorage.removeItem("user");

                        window.location.href = "/login";
                    }}
                >
                    Logout
                </button>

            </nav>


            {/* =================================================
                MAIN CONTENT
                ================================================= */}

            <main className="admin-products-container">

                {/* HEADER */}

                <section className="admin-products-header">

                    <div>

                        <p className="admin-eyebrow">
                            MARKETPLACE MANAGEMENT
                        </p>

                        <h1>
                            Products
                        </h1>

                        <p>
                            Monitor products listed by all
                            ShopSphere sellers.
                        </p>

                    </div>

                    <div className="admin-products-count-card">

                        <span>
                            TOTAL PRODUCTS
                        </span>

                        <strong>
                            {products.length}
                        </strong>

                    </div>

                </section>


                {/* SEARCH */}

                <section className="admin-products-toolbar">

                    <div className="admin-product-search">

                        <span>
                            🔍
                        </span>

                        <input
                            type="text"
                            placeholder="Search products, categories, sellers or stores..."
                            value={searchTerm}
                            onChange={(event) =>
                                setSearchTerm(
                                    event.target.value
                                )
                            }
                        />

                    </div>

                </section>


                {/* ERROR */}

                {error && (

                    <div className="admin-products-error">

                        <span>
                            ⚠️
                        </span>

                        <div>

                            <strong>
                                Something went wrong
                            </strong>

                            <p>
                                {error}
                            </p>

                        </div>

                        <button
                            onClick={loadProducts}
                        >
                            Retry
                        </button>

                    </div>

                )}


                {/* EMPTY */}

                {!error &&
                    filteredProducts.length === 0 && (

                        <section className="admin-products-empty">

                            <div>
                                📦
                            </div>

                            <h2>
                                No Products Found
                            </h2>

                            <p>
                                {searchTerm
                                    ? "No products match your search."
                                    : "There are currently no products in the marketplace."
                                }
                            </p>

                            {searchTerm && (

                                <button
                                    onClick={() =>
                                        setSearchTerm("")
                                    }
                                    className="admin-primary-button"
                                >
                                    Clear Search
                                </button>

                            )}

                        </section>

                    )}


                {/* PRODUCT TABLE */}

                {!error &&
                    filteredProducts.length > 0 && (

                        <section className="admin-products-table-section">

                            <div className="admin-products-table-wrapper">

                                <table className="admin-products-table">

                                    <thead>

                                    <tr>

                                        <th>
                                            PRODUCT
                                        </th>

                                        <th>
                                            CATEGORY
                                        </th>

                                        <th>
                                            SELLER
                                        </th>

                                        <th>
                                            STORE
                                        </th>

                                        <th>
                                            PRICE
                                        </th>

                                        <th>
                                            STOCK
                                        </th>

                                        <th>
                                            ACTION
                                        </th>

                                    </tr>

                                    </thead>

                                    <tbody>

                                    {filteredProducts.map(
                                        (product) => {

                                            const stockStatus =
                                                getStockStatus(
                                                    product.stockQuantity
                                                );

                                            return (

                                                <tr
                                                    key={
                                                        product.id
                                                    }
                                                >

                                                    {/* PRODUCT */}

                                                    <td>

                                                        <div className="admin-product-cell">

                                                            <div className="admin-product-icon">
                                                                📦
                                                            </div>

                                                            <div>

                                                                <strong>
                                                                    {
                                                                        product.name
                                                                    }
                                                                </strong>

                                                                <small>
                                                                    ID #
                                                                    {
                                                                        product.id
                                                                    }
                                                                </small>

                                                            </div>

                                                        </div>

                                                    </td>


                                                    {/* CATEGORY */}

                                                    <td>

                                                            <span className="admin-category-badge">

                                                                {
                                                                    product.categoryName ||
                                                                    "Uncategorized"
                                                                }

                                                            </span>

                                                    </td>


                                                    {/* SELLER */}

                                                    <td>

                                                        <div className="admin-seller-cell">

                                                            <strong>
                                                                {
                                                                    product.sellerName ||
                                                                    "Unknown Seller"
                                                                }
                                                            </strong>

                                                            <small>
                                                                Seller ID #
                                                                {
                                                                    product.sellerId ||
                                                                    "-"
                                                                }
                                                            </small>

                                                        </div>

                                                    </td>


                                                    {/* STORE */}

                                                    <td>

                                                        {
                                                            product.storeName ||
                                                            "-"
                                                        }

                                                    </td>


                                                    {/* PRICE */}

                                                    <td>

                                                        <strong className="admin-product-price">

                                                            ₹
                                                            {
                                                                Number(
                                                                    product.price || 0
                                                                ).toLocaleString(
                                                                    "en-IN"
                                                                )
                                                            }

                                                        </strong>

                                                    </td>


                                                    {/* STOCK */}

                                                    <td>

                                                        <div className="admin-stock-cell">

                                                            <strong>
                                                                {
                                                                    product.stockQuantity ??
                                                                    0
                                                                }
                                                            </strong>

                                                            <span
                                                                className={
                                                                    stockStatus.className
                                                                }
                                                            >
                                                                    {
                                                                        stockStatus.text
                                                                    }
                                                                </span>

                                                        </div>

                                                    </td>


                                                    {/* ACTION */}

                                                    <td>

                                                        <Link
                                                            to={`/admin/products/${product.id}`}
                                                            className="admin-view-product-button"
                                                        >
                                                            View
                                                        </Link>

                                                    </td>

                                                </tr>

                                            );
                                        }
                                    )}

                                    </tbody>

                                </table>

                            </div>

                        </section>

                    )}

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

export default AdminProducts;