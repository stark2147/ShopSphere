import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "./api";
import "./App.css";

function OrderDetails() {
    const { id } = useParams();

    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        const loadOrder = async () => {
            try {
                setLoading(true);
                setErrorMessage("");

                const response = await api.get(
                    `/api/orders/${id}`
                );

                console.log(
                    "Order details:",
                    response.data
                );

                setOrder(response.data);

            } catch (error) {

                console.error(
                    "Error loading order:",
                    error
                );

                setErrorMessage(
                    error.response?.data?.message ||
                    "Could not load this order."
                );

            } finally {
                setLoading(false);
            }
        };

        loadOrder();

    }, [id]);


    /* =========================================================
       STATUS HELPERS
       ========================================================= */

    const statusSteps = [
        "PENDING",
        "CONFIRMED",
        "PROCESSING",
        "SHIPPED",
        "DELIVERED"
    ];


    const getStatusLabel = (status) => {

        const labels = {
            PENDING: "Order Placed",
            CONFIRMED: "Order Confirmed",
            PROCESSING: "Processing",
            SHIPPED: "Shipped",
            DELIVERED: "Delivered",
            CANCELLED: "Order Cancelled"
        };

        return labels[status] || status;
    };


    const getStatusDescription = (status) => {

        const descriptions = {
            PENDING:
                "Your order has been placed and is waiting for confirmation.",

            CONFIRMED:
                "Your order has been confirmed by the seller.",

            PROCESSING:
                "Your order is being prepared for shipment.",

            SHIPPED:
                "Your order has been shipped and is on the way.",

            DELIVERED:
                "Your order has been successfully delivered.",

            CANCELLED:
                "This order has been cancelled."
        };

        return (
            descriptions[status] ||
            "Order status updated."
        );
    };


    const getStepClass = (step) => {

        if (order.status === "CANCELLED") {

            if (step === "PENDING") {
                return "order-tracking-step completed";
            }

            return "order-tracking-step";
        }

        const currentIndex =
            statusSteps.indexOf(order.status);

        const stepIndex =
            statusSteps.indexOf(step);

        if (stepIndex < currentIndex) {
            return "order-tracking-step completed";
        }

        if (stepIndex === currentIndex) {
            return "order-tracking-step active";
        }

        return "order-tracking-step";
    };


    const getStepIcon = (step) => {

        const stepClass =
            getStepClass(step);

        if (
            stepClass.includes("completed")
        ) {
            return "✓";
        }

        if (
            stepClass.includes("active")
        ) {
            return "●";
        }

        return "○";
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

                <main className="premium-order-details-loading">

                    <div className="order-loading-icon">
                        📦
                    </div>

                    <h2>
                        Loading your order...
                    </h2>

                    <p>
                        Please wait while we retrieve
                        your order details.
                    </p>

                </main>

            </div>
        );
    }


    /* =========================================================
       ORDER NOT FOUND
       ========================================================= */

    if (!order) {

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

                <main className="premium-order-not-found">

                    <div className="order-not-found-icon">
                        ❌
                    </div>

                    <span className="section-eyebrow">
                        SHOPSPHERE ORDERS
                    </span>

                    <h1>
                        Order Not Found
                    </h1>

                    <p>
                        {errorMessage ||
                            "We couldn't find the order you're looking for."}
                    </p>

                    <Link
                        to="/orders"
                        className="order-back-button"
                    >
                        ← Back to My Orders
                    </Link>

                </main>

            </div>
        );
    }


    const deliveryAddress =
        order.deliveryAddress;


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
                MAIN PAGE
            ================================================= */}

            <main className="premium-order-details-page">

                {/* BACK */}

                <Link
                    to="/orders"
                    className="order-details-back-link"
                >
                    ← Back to My Orders
                </Link>


                {/* =================================================
                    HEADER
                ================================================= */}

                <section className="order-details-hero">

                    <div>

                        <span className="section-eyebrow">
                            SHOPSPHERE ORDER
                        </span>

                        <h1>
                            Order #{order.id}
                        </h1>

                        <p>
                            Track your order and review
                            your purchase details.
                        </p>

                    </div>

                    <div
                        className={`order-status-pill ${order.status.toLowerCase()}`}
                    >
                        <span>●</span>

                        {getStatusLabel(
                            order.status
                        )}
                    </div>

                </section>


                {/* =================================================
                    ORDER SUMMARY CARDS
                ================================================= */}

                <section className="order-overview-grid">

                    <div className="order-overview-card">

                        <div className="order-overview-icon">
                            🧾
                        </div>

                        <div>

                            <span>
                                ORDER ID
                            </span>

                            <strong>
                                #{order.id}
                            </strong>

                        </div>

                    </div>


                    <div className="order-overview-card">

                        <div className="order-overview-icon">
                            📅
                        </div>

                        <div>

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

                        </div>

                    </div>


                    <div className="order-overview-card">

                        <div className="order-overview-icon">
                            💰
                        </div>

                        <div>

                            <span>
                                TOTAL AMOUNT
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

                    </div>

                </section>


                {/* =================================================
                    TWO COLUMN LAYOUT
                ================================================= */}

                <div className="order-details-layout">

                    {/* =================================================
                        LEFT COLUMN
                    ================================================= */}

                    <div className="order-details-main-column">


                        {/* =================================================
                            ORDER TRACKING
                        ================================================= */}

                        <section className="order-details-section">

                            <div className="order-section-heading">

                                <div>

                                    <span>
                                        ORDER JOURNEY
                                    </span>

                                    <h2>
                                        Track Your Order
                                    </h2>

                                </div>

                                <span className="tracking-current-status">
                                    {getStatusLabel(
                                        order.status
                                    )}
                                </span>

                            </div>


                            <div className="premium-order-tracking">

                                {order.status ===
                                "CANCELLED" ? (

                                    <div className="order-tracking-step cancelled active">

                                        <div className="order-tracking-icon">
                                            ✕
                                        </div>

                                        <div className="order-tracking-content">

                                            <strong>
                                                Order Cancelled
                                            </strong>

                                            <p>
                                                This order has
                                                been cancelled.
                                            </p>

                                        </div>

                                    </div>

                                ) : (

                                    statusSteps.map(
                                        (step, index) => {

                                            const stepClass =
                                                getStepClass(
                                                    step
                                                );

                                            return (
                                                <div
                                                    className={stepClass}
                                                    key={step}
                                                >

                                                    <div className="order-tracking-icon">
                                                        {getStepIcon(
                                                            step
                                                        )}
                                                    </div>

                                                    <div className="order-tracking-content">

                                                        <strong>
                                                            {getStatusLabel(
                                                                step
                                                            )}
                                                        </strong>

                                                        <p>
                                                            {step ===
                                                            order.status
                                                                ? "Current status"
                                                                : getStatusDescription(
                                                                    step
                                                                )}
                                                        </p>

                                                    </div>

                                                    {index <
                                                        statusSteps.length -
                                                        1 && (
                                                            <div className="order-tracking-line"></div>
                                                        )}

                                                </div>
                                            );
                                        }
                                    )

                                )}

                            </div>

                        </section>


                        {/* =================================================
                            ORDER ITEMS
                        ================================================= */}

                        <section className="order-details-section">

                            <div className="order-section-heading">

                                <div>

                                    <span>
                                        PURCHASE
                                    </span>

                                    <h2>
                                        Order Items
                                    </h2>

                                </div>

                                <span>
                                    {order.items?.length || 0}{" "}
                                    {(order.items?.length || 0) ===
                                    1
                                        ? "item"
                                        : "items"}
                                </span>

                            </div>


                            {order.items &&
                            order.items.length > 0 ? (

                                <div className="premium-order-items">

                                    {order.items.map(
                                        (item, index) => {

                                            const itemTotal =
                                                Number(
                                                    item.price
                                                ) *
                                                Number(
                                                    item.quantity
                                                );

                                            return (
                                                <article
                                                    className="premium-order-item"
                                                    key={
                                                        item.id ||
                                                        index
                                                    }
                                                >

                                                    <Link
                                                        to={`/products/${item.productId}`}
                                                        className="order-item-image"
                                                    >
                                                        <span>
                                                            🛍️
                                                        </span>
                                                    </Link>


                                                    <div className="premium-order-item-info">

                                                        <span>
                                                            SHOPSPHERE PRODUCT
                                                        </span>

                                                        <Link
                                                            to={`/products/${item.productId}`}
                                                            className="premium-order-item-name"
                                                        >
                                                            {
                                                                item.productName
                                                            }
                                                        </Link>

                                                        <div className="premium-order-item-meta">

                                                            <span>
                                                                ₹
                                                                {Number(
                                                                    item.price
                                                                ).toLocaleString(
                                                                    "en-IN"
                                                                )}{" "}
                                                                each
                                                            </span>

                                                            <span>
                                                                ×{" "}
                                                                {
                                                                    item.quantity
                                                                }
                                                            </span>

                                                        </div>

                                                    </div>


                                                    <div className="premium-order-item-total">

                                                        <span>
                                                            ITEM TOTAL
                                                        </span>

                                                        <strong>
                                                            ₹
                                                            {itemTotal.toLocaleString(
                                                                "en-IN"
                                                            )}
                                                        </strong>

                                                    </div>

                                                </article>
                                            );
                                        }
                                    )}

                                </div>

                            ) : (

                                <div className="order-items-empty">

                                    <span>
                                        📦
                                    </span>

                                    <p>
                                        No items found
                                        for this order.
                                    </p>

                                </div>

                            )}

                        </section>


                        {/* =================================================
                            DELIVERY ADDRESS
                        ================================================= */}

                        <section className="order-details-section">

                            <div className="order-section-heading">

                                <div>

                                    <span>
                                        DELIVERY
                                    </span>

                                    <h2>
                                        Delivery Address
                                    </h2>

                                </div>

                                <span className="snapshot-badge">
                                    ORDER SNAPSHOT
                                </span>

                            </div>


                            {deliveryAddress ? (

                                <div className="premium-order-address">

                                    <div className="order-address-top">

                                        <div>

                                            <span className="order-address-icon">
                                                📍
                                            </span>

                                            <strong>
                                                {
                                                    deliveryAddress.fullName
                                                }
                                            </strong>

                                        </div>

                                        {deliveryAddress.addressType && (
                                            <span className="address-type-badge">
                                                {
                                                    deliveryAddress.addressType
                                                }
                                            </span>
                                        )}

                                    </div>


                                    <div className="order-address-body">

                                        <p>
                                            📞{" "}
                                            {
                                                deliveryAddress.phoneNumber
                                            }
                                        </p>

                                        <p>
                                            {
                                                deliveryAddress.addressLine1
                                            }
                                        </p>

                                        {deliveryAddress.addressLine2 && (
                                            <p>
                                                {
                                                    deliveryAddress.addressLine2
                                                }
                                            </p>
                                        )}

                                        {deliveryAddress.landmark && (
                                            <p>
                                                <strong>
                                                    Landmark:
                                                </strong>{" "}
                                                {
                                                    deliveryAddress.landmark
                                                }
                                            </p>
                                        )}

                                        <p>
                                            {
                                                deliveryAddress.city
                                            }
                                            ,{" "}
                                            {
                                                deliveryAddress.state
                                            }{" "}
                                            -{" "}
                                            {
                                                deliveryAddress.pincode
                                            }
                                        </p>

                                        <p>
                                            {
                                                deliveryAddress.country
                                            }
                                        </p>

                                    </div>


                                    <div className="order-address-note">

                                        <span>
                                            🔒
                                        </span>

                                        <p>
                                            This is the delivery
                                            address saved with
                                            the order.
                                        </p>

                                    </div>

                                </div>

                            ) : (

                                <div className="order-address-missing">

                                    <span>
                                        📍
                                    </span>

                                    <p>
                                        Delivery address
                                        information is not
                                        available for this order.
                                    </p>

                                </div>

                            )}

                        </section>

                    </div>


                    {/* =================================================
                        RIGHT COLUMN
                    ================================================= */}

                    <aside className="order-details-sidebar">


                        {/* =================================================
                            PAYMENT SUMMARY
                        ================================================= */}

                        <section className="order-summary-card">

                            <div className="order-summary-card-header">

                                <span>
                                    PAYMENT
                                </span>

                                <h2>
                                    Order Summary
                                </h2>

                            </div>


                            <div className="order-summary-line">

                                <span>
                                    Items
                                </span>

                                <strong>
                                    {order.items?.length ||
                                        0}
                                </strong>

                            </div>


                            <div className="order-summary-line">

                                <span>
                                    Subtotal
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


                            <div className="order-summary-line">

                                <span>
                                    Delivery
                                </span>

                                <strong className="free-delivery">
                                    FREE
                                </strong>

                            </div>


                            <div className="order-summary-divider"></div>


                            <div className="order-summary-total">

                                <span>
                                    Total Paid
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


                            <div className="order-payment-status">

                                <span>
                                    ✓
                                </span>

                                <div>

                                    <strong>
                                        Payment Completed
                                    </strong>

                                    <small>
                                        Securely processed
                                    </small>

                                </div>

                            </div>

                        </section>


                        {/* =================================================
                            NEED HELP
                        ================================================= */}

                        <section className="order-help-card">

                            <div className="order-help-icon">
                                💬
                            </div>

                            <span>
                                SHOPSPHERE SUPPORT
                            </span>

                            <h3>
                                Need Help?
                            </h3>

                            <p>
                                If you have any questions
                                about your order, you can
                                contact ShopSphere support.
                            </p>

                            <Link
                                to="/orders"
                                className="order-help-button"
                            >
                                ← Back to Orders
                            </Link>

                        </section>


                        {/* =================================================
                            TRUST FEATURES
                        ================================================= */}

                        <section className="order-trust-card">

                            <div>

                                <span>
                                    🔒
                                </span>

                                <p>

                                    <strong>
                                        Secure
                                    </strong>

                                    <small>
                                        Protected checkout
                                    </small>

                                </p>

                            </div>


                            <div>

                                <span>
                                    🚚
                                </span>

                                <p>

                                    <strong>
                                        Tracked
                                    </strong>

                                    <small>
                                        Order lifecycle
                                    </small>

                                </p>

                            </div>


                            <div>

                                <span>
                                    🛡️
                                </span>

                                <p>

                                    <strong>
                                        Trusted
                                    </strong>

                                    <small>
                                        Shop with confidence
                                    </small>

                                </p>

                            </div>

                        </section>

                    </aside>

                </div>

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

export default OrderDetails;