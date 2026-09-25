import React from "react";
import { Link, useLocation } from "react-router-dom";
import "./App.css";

function OrderSuccess() {
    const location = useLocation();

    const orderId = location.state?.orderId;
    const amount = location.state?.amount;

    return (
        <div className="app">

            {/* =================================================
                NAVBAR
            ================================================= */}

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


            {/* =================================================
                SUCCESS CONTENT
            ================================================= */}

            <main className="premium-order-success">

                <div className="order-success-card">

                    {/* SUCCESS ICON */}

                    <div className="success-icon-wrapper">

                        <div className="success-icon">
                            ✓
                        </div>

                    </div>


                    {/* HEADING */}

                    <span className="success-eyebrow">
                        SHOPSPHERE ORDER CONFIRMED
                    </span>

                    <h1>
                        Payment Successful!
                    </h1>

                    <p className="success-message">
                        Your payment has been verified and your order
                        has been successfully placed.
                    </p>

                    <p className="thank-you">
                        Thank you for shopping with{" "}
                        <strong>ShopSphere</strong>.
                    </p>


                    {/* ORDER INFORMATION */}

                    <div className="premium-order-details">

                        {orderId && (
                            <div className="premium-order-detail">

                                <div className="order-detail-icon">
                                    🧾
                                </div>

                                <div>
                                    <span>
                                        ORDER ID
                                    </span>

                                    <strong>
                                        #{orderId}
                                    </strong>
                                </div>

                            </div>
                        )}


                        {amount !== undefined &&
                            amount !== null && (

                                <div className="premium-order-detail">

                                    <div className="order-detail-icon">
                                        💰
                                    </div>

                                    <div>
                                        <span>
                                            AMOUNT PAID
                                        </span>

                                        <strong>
                                            ₹
                                            {Number(
                                                amount / 100
                                            ).toLocaleString(
                                                "en-IN"
                                            )}
                                        </strong>
                                    </div>

                                </div>
                            )}


                        <div className="premium-order-detail">

                            <div className="order-detail-icon">
                                ✓
                            </div>

                            <div>
                                <span>
                                    PAYMENT STATUS
                                </span>

                                <strong className="payment-success">
                                    Successful
                                </strong>
                            </div>

                        </div>

                    </div>


                    {/* STATUS MESSAGE */}

                    <div className="success-status-box">

                        <div className="success-status-icon">
                            📦
                        </div>

                        <div>

                            <strong>
                                Your order is being processed
                            </strong>

                            <p>
                                You can track your order and view its
                                details from My Orders.
                            </p>

                        </div>

                    </div>


                    {/* ACTIONS */}

                    <div className="success-actions">

                        {orderId && (
                            <Link
                                to={`/orders/${orderId}`}
                                className="success-button primary"
                            >
                                View Order →
                            </Link>
                        )}

                        <Link
                            to="/orders"
                            className="success-button secondary"
                        >
                            My Orders
                        </Link>

                        <Link
                            to="/products"
                            className="success-button secondary"
                        >
                            Continue Shopping
                        </Link>

                    </div>


                    {/* SECURITY NOTE */}

                    <div className="success-security-note">

                        <span>
                            🔒
                        </span>

                        <p>
                            Payment securely processed and verified
                            through Razorpay.
                        </p>

                    </div>

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

export default OrderSuccess;