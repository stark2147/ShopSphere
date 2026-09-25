import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import api from "./api";
import "./App.css";

function AdminOrderDetails() {

    const { id } = useParams();
    const navigate = useNavigate();

    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        loadOrderDetails();
    }, [id]);

    const loadOrderDetails = async () => {

        try {
            setLoading(true);
            setError("");

            const response =
                await api.get(`/api/admin/orders/${id}`);

            setOrder(response.data);

        } catch (err) {

            console.error(
                "Failed to load admin order details:",
                err
            );

            setError(
                err.response?.data?.message ||
                "Unable to load order details."
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

    const getStatusClass = (status) => {

        switch (status) {

            case "PENDING":
                return "admin-order-status-pending";

            case "CONFIRMED":
                return "admin-order-status-confirmed";

            case "PROCESSING":
                return "admin-order-status-processing";

            case "SHIPPED":
                return "admin-order-status-shipped";

            case "DELIVERED":
                return "admin-order-status-delivered";

            case "CANCELLED":
                return "admin-order-status-cancelled";

            default:
                return "admin-order-status-default";
        }
    };

    if (loading) {

        return (
            <div className="admin-order-details-page">

                <div className="admin-order-details-loading">

                    <div className="admin-order-details-loading-icon">
                        🛒
                    </div>

                    <h2>
                        Loading Order Details...
                    </h2>

                    <p>
                        Please wait while we fetch the order information.
                    </p>

                </div>

            </div>
        );
    }

    if (error) {

        return (
            <div className="admin-order-details-page">

                <div className="admin-order-details-error">

                    <div className="admin-order-details-error-icon">
                        ⚠️
                    </div>

                    <h2>
                        Unable to load order
                    </h2>

                    <p>
                        {error}
                    </p>

                    <button
                        className="admin-primary-button"
                        onClick={loadOrderDetails}
                    >
                        Try Again
                    </button>

                </div>

            </div>
        );
    }

    return (
        <div className="admin-order-details-page">

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

                    <Link to="/admin/sellers">
                        Sellers
                    </Link>

                    <Link to="/admin/products">
                        Products
                    </Link>

                    <Link
                        to="/admin/orders"
                        className="active"
                    >
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

            <main className="admin-order-details-container">

                <Link
                    to="/admin/orders"
                    className="admin-order-details-back-link"
                >
                    ← Back to Orders
                </Link>

                {/* ================= HEADER ================= */}

                <section className="admin-order-details-header">

                    <div>

                        <p className="admin-eyebrow">
                            SHOPSPHERE ADMIN CENTER
                        </p>

                        <h1>
                            Order #{order?.orderId}
                        </h1>

                        <p>
                            Complete order information and marketplace
                            monitoring details.
                        </p>

                    </div>

                    <span
                        className={`admin-order-details-status ${getStatusClass(
                            order?.status
                        )}`}
                    >
                        {order?.status}
                    </span>

                </section>

                {/* ================= SUMMARY ================= */}

                <section className="admin-order-summary-grid">

                    <div className="admin-order-summary-card">

                        <span>
                            Order ID
                        </span>

                        <strong>
                            #{order?.orderId}
                        </strong>

                    </div>

                    <div className="admin-order-summary-card">

                        <span>
                            Total Amount
                        </span>

                        <strong>
                            ₹{Number(order?.totalAmount || 0)
                            .toLocaleString("en-IN")}
                        </strong>

                    </div>

                    <div className="admin-order-summary-card">

                        <span>
                            Customer
                        </span>

                        <strong>
                            {order?.customerName || "-"}
                        </strong>

                    </div>

                    <div className="admin-order-summary-card">

                        <span>
                            Items
                        </span>

                        <strong>
                            {order?.items?.length || 0}
                        </strong>

                    </div>

                </section>

                {/* ================= CUSTOMER + ORDER ================= */}

                <section className="admin-order-details-grid">

                    {/* CUSTOMER */}

                    <div className="admin-order-detail-card">

                        <div className="admin-detail-card-heading">

                            <span className="admin-detail-card-icon">
                                👤
                            </span>

                            <div>

                                <h2>
                                    Customer Information
                                </h2>

                                <p>
                                    Customer who placed this order
                                </p>

                            </div>

                        </div>

                        <div className="admin-detail-info-list">

                            <div className="admin-detail-row">

                                <span>
                                    Customer ID
                                </span>

                                <strong>
                                    #{order?.customerId || "-"}
                                </strong>

                            </div>

                            <div className="admin-detail-row">

                                <span>
                                    Name
                                </span>

                                <strong>
                                    {order?.customerName || "-"}
                                </strong>

                            </div>

                            <div className="admin-detail-row">

                                <span>
                                    Email
                                </span>

                                <strong>
                                    {order?.customerEmail || "-"}
                                </strong>

                            </div>

                        </div>

                    </div>

                    {/* ORDER INFORMATION */}

                    <div className="admin-order-detail-card">

                        <div className="admin-detail-card-heading">

                            <span className="admin-detail-card-icon">
                                📋
                            </span>

                            <div>

                                <h2>
                                    Order Information
                                </h2>

                                <p>
                                    Marketplace order details
                                </p>

                            </div>

                        </div>

                        <div className="admin-detail-info-list">

                            <div className="admin-detail-row">

                                <span>
                                    Order ID
                                </span>

                                <strong>
                                    #{order?.orderId}
                                </strong>

                            </div>

                            <div className="admin-detail-row">

                                <span>
                                    Status
                                </span>

                                <span
                                    className={`admin-order-details-status-small ${getStatusClass(
                                        order?.status
                                    )}`}
                                >
                                    {order?.status}
                                </span>

                            </div>

                            <div className="admin-detail-row">

                                <span>
                                    Total Amount
                                </span>

                                <strong className="admin-order-details-price">
                                    ₹{Number(order?.totalAmount || 0)
                                    .toLocaleString("en-IN")}
                                </strong>

                            </div>

                            <div className="admin-detail-row">

                                <span>
                                    Created At
                                </span>

                                <strong>
                                    {order?.createdAt
                                        ? new Date(
                                            order.createdAt
                                        ).toLocaleString("en-IN")
                                        : "-"}
                                </strong>

                            </div>

                        </div>

                    </div>

                </section>

                {/* ================= DELIVERY ADDRESS ================= */}

                <section className="admin-order-detail-card admin-order-address-card">

                    <div className="admin-detail-card-heading">

                        <span className="admin-detail-card-icon">
                            📍
                        </span>

                        <div>

                            <h2>
                                Delivery Address
                            </h2>

                            <p>
                                Address captured with this order
                            </p>

                        </div>

                    </div>

                    {order?.deliveryAddress ? (

                        <div className="admin-order-address">

                            <h3>
                                {order.deliveryAddress.fullName}
                            </h3>

                            <p>
                                {order.deliveryAddress.phoneNumber}
                            </p>

                            <p>
                                {order.deliveryAddress.addressLine1}
                            </p>

                            {order.deliveryAddress.addressLine2 && (
                                <p>
                                    {order.deliveryAddress.addressLine2}
                                </p>
                            )}

                            {order.deliveryAddress.landmark && (
                                <p>
                                    Landmark:{" "}
                                    {order.deliveryAddress.landmark}
                                </p>
                            )}

                            <p>
                                {order.deliveryAddress.city},{" "}
                                {order.deliveryAddress.state} -{" "}
                                {order.deliveryAddress.pincode}
                            </p>

                            <p>
                                {order.deliveryAddress.country}
                            </p>

                            {order.deliveryAddress.addressType && (
                                <span className="admin-order-address-type">
                                    {order.deliveryAddress.addressType}
                                </span>
                            )}

                        </div>

                    ) : (

                        <div className="admin-order-no-address">
                            No delivery address information available.
                        </div>

                    )}

                </section>

                {/* ================= ORDERED PRODUCTS ================= */}

                <section className="admin-order-items-section">

                    <div className="admin-order-items-heading">

                        <div>

                            <p className="admin-eyebrow">
                                ORDER CONTENT
                            </p>

                            <h2>
                                Ordered Products
                            </h2>

                        </div>

                        <span className="admin-order-items-count">
                            {order?.items?.length || 0} Item
                            {(order?.items?.length || 0) !== 1
                                ? "s"
                                : ""}
                        </span>

                    </div>

                    {order?.items?.length === 0 ? (

                        <div className="admin-order-items-empty">

                            <div>
                                📦
                            </div>

                            <h3>
                                No Products
                            </h3>

                            <p>
                                No product items were found for this order.
                            </p>

                        </div>

                    ) : (

                        <div className="admin-order-items-list">

                            {order.items.map(
                                (item, index) => (

                                    <div
                                        className="admin-order-item-card"
                                        key={`${item.productId}-${index}`}
                                    >

                                        <div className="admin-order-item-icon">
                                            🛍️
                                        </div>

                                        <div className="admin-order-item-main">

                                            <p className="admin-order-item-label">
                                                Product #{item.productId}
                                            </p>

                                            <h3>
                                                {item.productName || "-"}
                                            </h3>

                                            <div className="admin-order-item-seller">

                                                <span>
                                                    Seller:
                                                </span>

                                                <strong>
                                                    {item.storeName ||
                                                        item.sellerName ||
                                                        "-"}
                                                </strong>

                                                {item.sellerId && (
                                                    <small>
                                                        Seller #{item.sellerId}
                                                    </small>
                                                )}

                                            </div>

                                        </div>

                                        <div className="admin-order-item-meta">

                                            <div>

                                                <span>
                                                    Quantity
                                                </span>

                                                <strong>
                                                    {item.quantity}
                                                </strong>

                                            </div>

                                            <div>

                                                <span>
                                                    Unit Price
                                                </span>

                                                <strong>
                                                    ₹{Number(item.price || 0)
                                                    .toLocaleString("en-IN")}
                                                </strong>

                                            </div>

                                        </div>

                                    </div>

                                )
                            )}

                        </div>

                    )}

                </section>

                {/* ================= ADMIN NOTE ================= */}

                <section className="admin-order-admin-note">

                    <div className="admin-order-admin-note-icon">
                        ℹ️
                    </div>

                    <div>

                        <h3>
                            Admin Monitoring View
                        </h3>

                        <p>
                            This page is for marketplace administration
                            and monitoring. Order actions remain controlled
                            by the appropriate customer and seller workflows.
                        </p>

                    </div>

                </section>

                {/* ================= ACTIONS ================= */}

                <section className="admin-order-details-actions">

                    <Link
                        to="/admin/orders"
                        className="admin-secondary-button"
                    >
                        ← Back to Orders
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

export default AdminOrderDetails;