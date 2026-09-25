import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "./api";
import "./App.css";

function SellerDashboard() {
    const [seller, setSeller] = useState(null);
    const [products, setProducts] = useState([]);
    const [orders, setOrders] = useState([]);
    const [analytics, setAnalytics] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        loadDashboard();
    }, []);

    const loadDashboard = async () => {
        try {
            setLoading(true);
            setError("");

            const [sellerResponse, productsResponse, ordersResponse] =
                await Promise.all([
                    api.get("/api/sellers/me"),
                    api.get("/api/products/my-products"),
                    api.get("/api/orders/seller-orders"),
                    api.get("/api/sellers/analytics")
                ]);

            setSeller(sellerResponse.data);

            const productData = productsResponse.data;

            setProducts(
                Array.isArray(productData)
                    ? productData
                    : productData.content || []
            );

            setOrders(
                Array.isArray(ordersResponse.data)
                    ? ordersResponse.data
                    : []
            );

        } catch (err) {
            console.error("Dashboard loading failed:", err);

            setError(
                err.response?.data?.message ||
                "Unable to load seller dashboard."
            );
        } finally {
            setLoading(false);
        }
    };

    const totalProducts = products.length;

    const lowStockProducts = products.filter(
        (product) =>
            product.stockQuantity !== undefined &&
            product.stockQuantity <= 5
    ).length;

    const totalOrders = orders.length;

    const totalRevenue = orders.reduce(
        (total, sellerOrder) => {
            const amount =
                sellerOrder.totalAmount ??
                sellerOrder.amount ??
                0;

            return total + Number(amount);
        },
        0
    );

    if (loading) {
        return (
            <div className="premium-dashboard-page">

                <div className="dashboard-loading">

                    <div className="loading-spinner"></div>

                    <h3>
                        Loading Seller Dashboard...
                    </h3>

                    <p>
                        Please wait while we fetch your store data.
                    </p>

                </div>

            </div>
        );
    }

    return (
        <div className="premium-dashboard-page">

            {/* =====================================================
                SELLER NAVBAR
            ====================================================== */}

            <nav className="dashboard-navbar">

                {/* BRAND */}

                <div className="dashboard-brand">

                    <Link to="/seller">
                        🏪 ShopSphere
                    </Link>

                </div>


                {/* SELLER NAVIGATION */}


                <div className="dashboard-nav-links">

                    <Link to="/seller">
                        Home
                    </Link>

                    <Link
                        to="/seller/dashboard"
                        className="active"
                    >
                        Dashboard
                    </Link>

                    <Link to="/seller/products">
                        My Products
                    </Link>

                    <Link to="/seller/orders">
                        Seller Orders
                    </Link>

                    <Link to="/seller/reviews">
                        Reviews
                    </Link>

                    <Link to="/seller/profile">
                        My Profile
                    </Link>

                </div>


                {/* MY STORE */}

                <Link
                    to="/seller"
                    className="dashboard-back-button"
                >
                    My Store
                </Link>

            </nav>


            {/* =====================================================
                MAIN CONTENT
            ====================================================== */}


            <main className="seller-dashboard-container">


                {/* =================================================
                    HEADER
                ================================================== */}

                <section className="seller-dashboard-header">

                    <div>

                        <p className="dashboard-eyebrow">
                            SELLER CENTER
                        </p>

                        <h1>
                            Welcome back
                            {seller?.name
                                ? `, ${seller.name}`
                                : ""}
                            👋
                        </h1>

                        <p>
                            Manage your store, products and orders
                            from one place.
                        </p>

                    </div>


                    {/* STORE INFORMATION */}

                    <div className="seller-store-info">

                        <div className="store-avatar">

                            {seller?.storeName
                                ? seller.storeName
                                    .charAt(0)
                                    .toUpperCase()
                                : "S"}

                        </div>

                        <div>

                            <strong>
                                {seller?.storeName || "My Store"}
                            </strong>

                            <span>
                                {seller?.approved
                                    ? "✓ Approved Seller"
                                    : "Pending Approval"}
                            </span>

                        </div>

                    </div>

                </section>


                {/* =================================================
                    ERROR
                ================================================== */}

                {error && (
                    <div className="dashboard-error">
                        {error}
                    </div>
                )}


                {/* =================================================
                    STATS
                ================================================== */}

                <section className="seller-stats-grid">


                    {/* PRODUCTS */}

                    <div className="seller-stat-card">

                        <div className="stat-icon">
                            📦
                        </div>

                        <div>

                            <span>
                                Total Products
                            </span>

                            <strong>
                                {totalProducts}
                            </strong>

                        </div>

                    </div>


                    {/* ORDERS */}

                    <div className="seller-stat-card">

                        <div className="stat-icon">
                            🛒
                        </div>

                        <div>

                            <span>
                                Total Orders
                            </span>

                            <strong>
                                {totalOrders}
                            </strong>

                        </div>

                    </div>


                    {/* REVENUE */}

                    <div className="seller-stat-card">

                        <div className="stat-icon">
                            💰
                        </div>

                        <div>

                            <span>
                                Total Revenue
                            </span>

                            <strong>
                                ₹{totalRevenue.toLocaleString("en-IN")}
                            </strong>

                        </div>

                    </div>


                    {/* LOW STOCK */}

                    <div className="seller-stat-card warning-card">

                        <div className="stat-icon">
                            ⚠️
                        </div>

                        <div>

                            <span>
                                Low Stock
                            </span>

                            <strong>
                                {lowStockProducts}
                            </strong>

                        </div>

                    </div>

                </section>


                {/* =================================================
                    QUICK ACTIONS
                ================================================== */}

                <section className="dashboard-section">

                    <div className="section-heading">

                        <div>

                            <p className="dashboard-eyebrow">
                                STORE MANAGEMENT
                            </p>

                            <h2>
                                Quick Actions
                            </h2>

                        </div>

                    </div>


                    <div className="quick-actions-grid">


                        {/* MANAGE PRODUCTS */}

                        <Link
                            to="/seller/products"
                            className="quick-action-card"
                        >

                            <span>
                                📦
                            </span>

                            <strong>
                                Manage Products
                            </strong>

                            <small>
                                Add, edit and manage your products
                            </small>

                        </Link>


                        {/* MANAGE ORDERS */}

                        <Link
                            to="/seller/orders"
                            className="quick-action-card"
                        >

                            <span>
                                🛍️
                            </span>

                            <strong>
                                Manage Orders
                            </strong>

                            <small>
                                View and update customer orders
                            </small>

                        </Link>


                        {/* ADD PRODUCT */}

                        <Link
                            to="/seller/products"
                            className="quick-action-card"
                        >

                            <span>
                                ➕
                            </span>

                            <strong>
                                Add Product
                            </strong>

                            <small>
                                Add a new product to your store
                            </small>

                        </Link>

                    </div>

                </section>


                {/* =================================================
                    PRODUCTS
                ================================================== */}

                <section className="dashboard-section">

                    <div className="section-heading">

                        <div>

                            <p className="dashboard-eyebrow">
                                INVENTORY
                            </p>

                            <h2>
                                Your Products
                            </h2>

                        </div>


                        <Link
                            to="/seller/products"
                            className="section-link"
                        >
                            View All →
                        </Link>

                    </div>


                    {products.length === 0 ? (

                        <div className="dashboard-empty">

                            <div>
                                📦
                            </div>

                            <h3>
                                No products yet
                            </h3>

                            <p>
                                Start selling by adding your first
                                product.
                            </p>

                            <Link
                                to="/seller/products"
                                className="primary-dashboard-button"
                            >
                                Add Your First Product
                            </Link>

                        </div>

                    ) : (

                        <div className="seller-products-table">


                            <div className="seller-table-header">

                                <span>
                                    Product
                                </span>

                                <span>
                                    Category
                                </span>

                                <span>
                                    Price
                                </span>

                                <span>
                                    Stock
                                </span>

                                <span>
                                    Status
                                </span>

                            </div>


                            {products
                                .slice(0, 5)
                                .map((product) => (

                                    <div
                                        className="seller-table-row"
                                        key={product.id}
                                    >

                                        <div className="seller-product-name">

                                            <div className="product-mini-icon">
                                                📦
                                            </div>

                                            <div>

                                                <strong>
                                                    {product.name}
                                                </strong>

                                                <small>
                                                    ID #{product.id}
                                                </small>

                                            </div>

                                        </div>


                                        <span>
                                            {product.categoryName ||
                                                "Uncategorized"}
                                        </span>


                                        <strong>
                                            ₹
                                            {Number(
                                                product.price || 0
                                            ).toLocaleString("en-IN")}
                                        </strong>


                                        <span
                                            className={
                                                product.stockQuantity <= 5
                                                    ? "stock-low"
                                                    : "stock-good"
                                            }
                                        >
                                            {product.stockQuantity}
                                        </span>


                                        <span
                                            className={
                                                product.stockQuantity <= 0
                                                    ? "product-status out"
                                                    : "product-status active"
                                            }
                                        >
                                            {product.stockQuantity <= 0
                                                ? "Out of Stock"
                                                : "Active"}
                                        </span>

                                    </div>

                                ))}

                        </div>

                    )}

                </section>


                {/* =================================================
                    RECENT SELLER ORDERS
                ================================================== */}

                <section className="dashboard-section">

                    <div className="section-heading">

                        <div>

                            <p className="dashboard-eyebrow">
                                ORDERS
                            </p>

                            <h2>
                                Recent Seller Orders
                            </h2>

                        </div>


                        <Link
                            to="/seller/orders"
                            className="section-link"
                        >
                            View All →
                        </Link>

                    </div>


                    {orders.length === 0 ? (

                        <div className="dashboard-empty compact">

                            <div>
                                🛒
                            </div>

                            <h3>
                                No orders yet
                            </h3>

                            <p>
                                Orders from customers will appear here.
                            </p>

                        </div>

                    ) : (

                        <div className="seller-orders-list">

                            {orders
                                .slice(0, 5)
                                .map((order) => (

                                    <div
                                        className="seller-order-row"
                                        key={order.id}
                                    >

                                        <div>

                                            <strong>
                                                Order #{order.id}
                                            </strong>

                                            <small>
                                                {order.status ||
                                                    "PENDING"}
                                            </small>

                                        </div>


                                        <div className="seller-order-amount">

                                            ₹
                                            {Number(
                                                order.totalAmount ??
                                                order.amount ??
                                                0
                                            ).toLocaleString("en-IN")}

                                        </div>


                                        <Link
                                            to={`/seller/orders/${order.id}`}
                                            className="view-order-button"
                                        >
                                            View
                                        </Link>

                                    </div>

                                ))}

                        </div>

                    )}

                </section>

            </main>


            {/* =====================================================
                FOOTER
            ====================================================== */}

            <footer className="dashboard-footer">

                <p>
                    © 2026 ShopSphere. Seller Center.
                </p>

            </footer>

        </div>
    );
}

export default SellerDashboard;