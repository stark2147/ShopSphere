import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "./api";
import "./App.css";

function Orders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        const loadOrders = async () => {
            try {
                setLoading(true);
                setErrorMessage("");

                const response = await api.get(
                    "/api/orders/my-orders"
                );

                console.log(
                    "My orders:",
                    response.data
                );

                setOrders(response.data || []);

            } catch (error) {

                console.error(
                    "Error loading orders:",
                    error
                );

                setErrorMessage(
                    error.response?.data?.message ||
                    "Could not load your orders."
                );

            } finally {
                setLoading(false);
            }
        };

        loadOrders();

    }, []);


    /* =========================================================
       STATUS HELPERS
       ========================================================= */

    const getStatusLabel = (status) => {

        const labels = {
            PENDING: "Order Placed",
            CONFIRMED: "Confirmed",
            PROCESSING: "Processing",
            SHIPPED: "Shipped",
            DELIVERED: "Delivered",
            CANCELLED: "Cancelled"
        };

        return labels[status] || status;
    };


    const getStatusIcon = (status) => {

        const icons = {
            PENDING: "⏳",
            CONFIRMED: "✓",
            PROCESSING: "⚙️",
            SHIPPED: "🚚",
            DELIVERED: "✓",
            CANCELLED: "✕"
        };

        return icons[status] || "●";
    };


    const getStatusClass = (status) => {

        return `orders-status-badge ${
            status?.toLowerCase() || ""
        }`;
    };


    /* =========================================================
       LOADING
       ========================================================= */

    if (loading) {

        return (
            <div className="app">

                <nav className="navbar">

                    <Link
                        to="/"
                        className="logo"
                    >
                        Shop<span>Sphere</span>
                    </Link>

                </nav>

                <main className="premium-orders-loading">

                    <div className="orders-loading-icon">
                        📦
                    </div>

                    <h2>
                        Loading your orders...
                    </h2>

                    <p>
                        Please wait while we retrieve
                        your order history.
                    </p>

                </main>

            </div>
        );
    }


    /* =========================================================
       MAIN PAGE
       ========================================================= */

    return (
        <div className="app">

            {/* =================================================
                NAVBAR
            ================================================= */}

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

                    <Link to="/products">
                        Products
                    </Link>

                    <Link to="/wishlist">
                        Wishlist ❤️
                    </Link>

                    <Link
                        to="/orders"
                        className="active-nav-link"
                    >
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


            {/* =================================================
                ORDERS PAGE
            ================================================= */}

            <main className="premium-orders-page">

                {/* PAGE HEADER */}

                <section className="orders-page-header">

                    <div>

                        <span className="section-eyebrow">
                            SHOPSPHERE ORDERS
                        </span>

                        <h1>
                            My Orders
                        </h1>

                        <p>
                            View and track all your ShopSphere
                            purchases in one place.
                        </p>

                    </div>

                    <Link
                        to="/products"
                        className="orders-shop-button"
                    >
                        Continue Shopping →
                    </Link>

                </section>


                {/* =================================================
                    ORDER STATISTICS
                ================================================= */}

                {orders.length > 0 && (

                    <section className="orders-stats">

                        <div className="orders-stat-card">

                            <div className="orders-stat-icon">
                                📦
                            </div>

                            <div>

                                <span>
                                    TOTAL ORDERS
                                </span>

                                <strong>
                                    {orders.length}
                                </strong>

                            </div>

                        </div>


                        <div className="orders-stat-card">

                            <div className="orders-stat-icon">
                                🚚
                            </div>

                            <div>

                                <span>
                                    ACTIVE ORDERS
                                </span>

                                <strong>
                                    {
                                        orders.filter(
                                            (order) =>
                                                order.status !==
                                                "DELIVERED" &&
                                                order.status !==
                                                "CANCELLED"
                                        ).length
                                    }
                                </strong>

                            </div>

                        </div>


                        <div className="orders-stat-card">

                            <div className="orders-stat-icon">
                                ✓
                            </div>

                            <div>

                                <span>
                                    DELIVERED
                                </span>

                                <strong>
                                    {
                                        orders.filter(
                                            (order) =>
                                                order.status ===
                                                "DELIVERED"
                                        ).length
                                    }
                                </strong>

                            </div>

                        </div>

                    </section>

                )}


                {/* =================================================
                    ERROR
                ================================================= */}

                {errorMessage && (

                    <div className="orders-error">

                        <span>
                            ⚠️
                        </span>

                        <p>
                            {errorMessage}
                        </p>

                    </div>

                )}


                {/* =================================================
                    EMPTY STATE
                ================================================= */}

                {orders.length === 0 ? (

                    <section className="premium-orders-empty">

                        <div className="orders-empty-icon">
                            📦
                        </div>

                        <span className="section-eyebrow">
                            YOUR ORDERS
                        </span>

                        <h2>
                            No orders yet
                        </h2>

                        <p>
                            You haven't placed any orders yet.
                            Start exploring products and find
                            something you'll love.
                        </p>

                        <Link
                            to="/products"
                            className="orders-empty-button"
                        >
                            Start Shopping →
                        </Link>

                    </section>

                ) : (

                    /* =================================================
                       ORDER LIST
                    ================================================= */

                    <section className="orders-list-section">

                        <div className="orders-list-header">

                            <div>

                                <span>
                                    PURCHASE HISTORY
                                </span>

                                <h2>
                                    Your Recent Orders
                                </h2>

                            </div>

                            <span className="orders-count">
                                {orders.length}{" "}
                                {orders.length === 1
                                    ? "order"
                                    : "orders"}
                            </span>

                        </div>


                        <div className="premium-orders-list">

                            {orders.map((order) => {

                                const firstItem =
                                    order.items &&
                                    order.items.length > 0
                                        ? order.items[0]
                                        : null;

                                const additionalItems =
                                    order.items &&
                                    order.items.length > 1
                                        ? order.items.length - 1
                                        : 0;

                                return (

                                    <article
                                        className="premium-order-card"
                                        key={order.id}
                                    >

                                        {/* ORDER TOP */}

                                        <div className="order-card-top">

                                            <div className="order-card-id">

                                                <span>
                                                    ORDER
                                                </span>

                                                <strong>
                                                    #{order.id}
                                                </strong>

                                            </div>


                                            <div
                                                className={getStatusClass(
                                                    order.status
                                                )}
                                            >

                                                <span>
                                                    {getStatusIcon(
                                                        order.status
                                                    )}
                                                </span>

                                                {getStatusLabel(
                                                    order.status
                                                )}

                                            </div>

                                        </div>


                                        {/* ORDER DATE */}

                                        <div className="order-card-date">

                                            <span>
                                                ORDER DATE
                                            </span>

                                            <strong>
                                                {new Date(
                                                    order.createdAt
                                                ).toLocaleDateString(
                                                    "en-IN",
                                                    {
                                                        day: "2-digit",
                                                        month: "short",
                                                        year: "numeric"
                                                    }
                                                )}
                                            </strong>

                                            <small>
                                                {new Date(
                                                    order.createdAt
                                                ).toLocaleTimeString(
                                                    "en-IN",
                                                    {
                                                        hour: "2-digit",
                                                        minute: "2-digit"
                                                    }
                                                )}
                                            </small>

                                        </div>


                                        {/* PRODUCT */}

                                        <div className="order-card-product">

                                            <div className="orders-product-image">
                                                🛍️
                                            </div>


                                            <div className="orders-product-info">

                                                <span>
                                                    SHOPSPHERE PRODUCT
                                                </span>

                                                <strong>
                                                    {firstItem
                                                        ? firstItem.productName
                                                        : "Order items"}
                                                </strong>

                                                {firstItem && (

                                                    <p>
                                                        Quantity:{" "}
                                                        {
                                                            firstItem.quantity
                                                        }
                                                    </p>

                                                )}

                                                {additionalItems >
                                                    0 && (

                                                        <small>
                                                            +{" "}
                                                            {
                                                                additionalItems
                                                            } more{" "}
                                                            {additionalItems ===
                                                            1
                                                                ? "item"
                                                                : "items"}
                                                        </small>

                                                    )}

                                            </div>

                                        </div>


                                        {/* TOTAL */}

                                        <div className="order-card-total">

                                            <span>
                                                TOTAL
                                            </span>

                                            <strong>
                                                ₹
                                                {Number(
                                                    order.totalAmount
                                                ).toLocaleString(
                                                    "en-IN"
                                                )}
                                            </strong>

                                        </div>


                                        {/* ACTION */}

                                        <div className="order-card-action">

                                            <Link
                                                to={`/orders/${order.id}`}
                                                className="orders-view-button"
                                            >
                                                View Order
                                                <span>
                                                    →
                                                </span>
                                            </Link>

                                        </div>

                                    </article>

                                );

                            })}

                        </div>

                    </section>

                )}

            </main>


            {/* =================================================
                FOOTER
            ================================================= */}

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

export default Orders;