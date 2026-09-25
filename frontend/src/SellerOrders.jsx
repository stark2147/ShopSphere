import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "./api";
import "./App.css";

function SellerOrders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [updatingOrderId, setUpdatingOrderId] = useState(null);
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    useEffect(() => {
        loadOrders();
    }, []);

    // ============================================================
    // LOAD SELLER ORDERS
    // ============================================================

    const loadOrders = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await api.get(
                "/api/orders/seller-orders"
            );

            console.log(
                "SELLER ORDERS API RESPONSE:",
                response.data
            );

            setOrders(response.data);

        } catch (err) {

            console.error(
                "Failed to load seller orders:",
                err
            );

            setError(
                err.response?.data?.message ||
                "Unable to load seller orders. Please try again."
            );

        } finally {

            setLoading(false);
        }
    };

    // ============================================================
    // NEXT STATUS
    // ============================================================

    const getNextStatus = (status) => {

        switch (status) {

            case "PENDING":
                return "CONFIRMED";

            case "CONFIRMED":
                return "PROCESSING";

            case "PROCESSING":
                return "SHIPPED";

            case "SHIPPED":
                return "DELIVERED";

            default:
                return null;
        }
    };

    // ============================================================
    // BUTTON LABEL
    // ============================================================

    const getActionLabel = (status) => {

        switch (status) {

            case "PENDING":
                return "Confirm Order";

            case "CONFIRMED":
                return "Start Processing";

            case "PROCESSING":
                return "Mark as Shipped";

            case "SHIPPED":
                return "Mark as Delivered";

            default:
                return null;
        }
    };

    // ============================================================
    // UPDATE SELLER ORDER STATUS
    // ============================================================

    const updateOrderStatus = async (
        sellerOrderId,
        currentStatus
    ) => {

        const nextStatus =
            getNextStatus(currentStatus);

        if (!nextStatus) {

            console.error(
                "Cannot update order. Invalid next status:",
                currentStatus
            );

            return;
        }

        if (!sellerOrderId) {

            console.error(
                "Cannot update order. Missing sellerOrderId:",
                sellerOrderId
            );

            setError(
                "Seller order ID is missing. Please refresh the page."
            );

            return;
        }

        const actionLabel =
            getActionLabel(currentStatus);

        const confirmed = window.confirm(
            `Are you sure you want to "${actionLabel}"?`
        );

        if (!confirmed) {
            return;
        }

        try {

            setUpdatingOrderId(
                sellerOrderId
            );

            setError("");
            setSuccessMessage("");

            console.log(
                "Updating seller order:",
                sellerOrderId,
                "from:",
                currentStatus,
                "to:",
                nextStatus
            );

            // ====================================================
            // UPDATE BACKEND
            // ====================================================

            const response = await api.put(
                `/api/seller-orders/${sellerOrderId}/status`,
                {
                    status: nextStatus
                }
            );

            console.log(
                "Updated seller order response:",
                response.data
            );

            // ====================================================
            // UPDATE FRONTEND LIST
            // ====================================================

            setOrders((currentOrders) =>
                currentOrders.map((order) =>
                    order.sellerOrderId === sellerOrderId
                        ? response.data
                        : order
                )
            );

            // ====================================================
            // SUCCESS MESSAGE
            // ====================================================

            setSuccessMessage(
                `Order #${
                    response.data.orderId
                } updated to ${
                    formatStatus(nextStatus)
                }.`
            );

            setTimeout(() => {
                setSuccessMessage("");
            }, 3500);

        } catch (err) {

            console.error(
                "Failed to update seller order:",
                err
            );

            setError(
                err.response?.data?.message ||
                "Failed to update order status."
            );

        } finally {

            setUpdatingOrderId(null);
        }
    };

    // ============================================================
    // STATUS CLASS
    // ============================================================

    const getStatusClass = (status) => {

        switch (status) {

            case "PENDING":
                return "seller-order-status pending";

            case "CONFIRMED":
                return "seller-order-status confirmed";

            case "PROCESSING":
                return "seller-order-status processing";

            case "SHIPPED":
                return "seller-order-status shipped";

            case "DELIVERED":
                return "seller-order-status delivered";

            case "CANCELLED":
                return "seller-order-status cancelled";

            default:
                return "seller-order-status";
        }
    };

    // ============================================================
    // FORMAT STATUS
    // ============================================================

    const formatStatus = (status) => {

        if (!status) {
            return "Unknown";
        }

        return status
            .toLowerCase()
            .replace(/_/g, " ")
            .replace(/\b\w/g, (letter) =>
                letter.toUpperCase()
            );
    };

    // ============================================================
    // FORMAT ADDRESS
    // ============================================================

    const formatAddress = (address) => {

        if (!address) {
            return "Delivery address unavailable";
        }

        const parts = [
            address.addressLine1,
            address.addressLine2,
            address.landmark,
            address.city,
            address.state,
            address.pincode
        ].filter(Boolean);

        return parts.length > 0
            ? parts.join(", ")
            : "Delivery address unavailable";
    };

    // ============================================================
    // LOADING
    // ============================================================

    if (loading) {

        return (
            <div className="seller-orders-loading-page">

                <div className="seller-orders-loading-icon">
                    📦
                </div>

                <h2>
                    Loading seller orders...
                </h2>

                <p>
                    We're fetching your latest orders.
                </p>

            </div>
        );
    }

    return (
        <div className="seller-orders-page">

            {/* =====================================================
                NAVBAR
            ===================================================== */}

            <nav className="seller-navbar">

                <div className="seller-navbar-brand">
                    🏪 ShopSphere
                </div>

                <div className="seller-navbar-links">

                    <Link to="/seller/home">
                        Home
                    </Link>

                    <Link to="/seller/dashboard">
                        Dashboard
                    </Link>

                    <Link to="/seller/products">
                        My Products
                    </Link>

                    <Link
                        to="/seller/orders"
                        className="active"
                    >
                        Seller Orders
                    </Link>

                    <Link to="/seller/reviews">
                        Reviews
                    </Link>

                    <Link to="/seller/profile">
                        My Profile
                    </Link>

                </div>

            </nav>


            {/* =====================================================
                MAIN CONTENT
            ===================================================== */}

            <main className="seller-orders-container">

                {/* =================================================
                    PAGE HEADER
                ================================================= */}

                <section className="seller-orders-header">

                    <div>

                        <p className="seller-orders-eyebrow">
                            SELLER CENTER
                        </p>

                        <h1>
                            Seller Orders
                        </h1>

                        <p>
                            Manage orders containing products
                            from your store.
                        </p>

                    </div>

                    <div className="seller-orders-count-card">

                        <span>
                            TOTAL ORDERS
                        </span>

                        <strong>
                            {orders.length}
                        </strong>

                    </div>

                </section>


                {/* =================================================
                    SUCCESS MESSAGE
                ================================================= */}

                {successMessage && (

                    <div className="seller-orders-success">
                        ✓ {successMessage}
                    </div>

                )}


                {/* =================================================
                    ERROR MESSAGE
                ================================================= */}

                {error && (

                    <div className="seller-orders-error">

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
                            type="button"
                            onClick={loadOrders}
                        >
                            Retry
                        </button>

                    </div>

                )}


                {/* =================================================
                    EMPTY STATE
                ================================================= */}

                {!error &&
                    orders.length === 0 && (

                        <section className="seller-orders-empty">

                            <div className="seller-orders-empty-icon">
                                📦
                            </div>

                            <h2>
                                No Seller Orders Yet
                            </h2>

                            <p>
                                Orders containing your products
                                will appear here when customers
                                make purchases.
                            </p>

                            <Link
                                to="/seller/products"
                                className="seller-orders-primary-button"
                            >
                                Manage Products
                            </Link>

                        </section>

                    )}


                {/* =================================================
                    ORDERS LIST
                ================================================= */}

                {orders.length > 0 && (

                    <section className="seller-orders-list">

                        {orders.map((order) => {

                            // IMPORTANT:
                            // sellerOrderId comes directly
                            // from the backend.

                            const sellerOrderId =
                                order.sellerOrderId;

                            const nextStatus =
                                getNextStatus(
                                    order.status
                                );

                            const actionLabel =
                                getActionLabel(
                                    order.status
                                );

                            const isUpdating =
                                updatingOrderId ===
                                sellerOrderId;

                            return (

                                <article
                                    className="seller-order-card"
                                    key={sellerOrderId}
                                >

                                    {/* =================================================
                                        ORDER TOP
                                    ================================================= */}

                                    <div className="seller-order-top">

                                        <div>

                                            <p className="seller-order-label">
                                                SELLER ORDER
                                            </p>

                                            <h2>
                                                Order #
                                                {order.orderId}
                                            </h2>

                                        </div>

                                        <span
                                            className={getStatusClass(
                                                order.status
                                            )}
                                        >
                                            {formatStatus(
                                                order.status
                                            )}
                                        </span>

                                    </div>


                                    {/* =================================================
                                        ORDER INFORMATION
                                    ================================================= */}

                                    <div className="seller-order-info-grid">

                                        {/* CUSTOMER */}

                                        <div className="seller-order-info-block">

                                            <span>
                                                CUSTOMER
                                            </span>

                                            <strong>
                                                {order.customerName ||
                                                    order.userName ||
                                                    "Customer"}
                                            </strong>

                                            {order.customerEmail && (

                                                <small>
                                                    {order.customerEmail}
                                                </small>

                                            )}

                                        </div>


                                        {/* PRODUCT */}

                                        <div className="seller-order-info-block">

                                            <span>
                                                PRODUCT
                                            </span>

                                            <strong>
                                                {order.productName ||
                                                (
                                                    order.items &&
                                                    order.items.length > 0
                                                )
                                                    ? order.items[0]?.productName ||
                                                    "Product"
                                                    : "Product"}
                                            </strong>

                                            {order.quantity && (

                                                <small>
                                                    Quantity:{" "}
                                                    {order.quantity}
                                                </small>

                                            )}

                                        </div>


                                        {/* AMOUNT */}

                                        <div className="seller-order-info-block">

                                            <span>
                                                ORDER VALUE
                                            </span>

                                            <strong className="seller-order-price">

                                                ₹
                                                {Number(
                                                    order.totalAmount ??
                                                    order.subtotal ??
                                                    order.amount ??
                                                    0
                                                ).toLocaleString(
                                                    "en-IN"
                                                )}

                                            </strong>

                                        </div>

                                    </div>


                                    {/* =================================================
                                        ORDER ITEMS
                                    ================================================= */}

                                    {order.items &&
                                        order.items.length > 0 && (

                                            <div className="seller-order-items">

                                                <span>
                                                    ITEMS
                                                </span>

                                                {order.items.map(
                                                    (item) => (

                                                        <div
                                                            className="seller-order-item"
                                                            key={item.id}
                                                        >

                                                            <strong>
                                                                {item.productName ||
                                                                    "Product"}
                                                            </strong>

                                                            <small>
                                                                Quantity:{" "}
                                                                {item.quantity}
                                                            </small>

                                                        </div>

                                                    )
                                                )}

                                            </div>

                                        )}


                                    {/* =================================================
                                        DELIVERY ADDRESS
                                    ================================================= */}

                                    {order.deliveryAddress && (

                                        <div className="seller-order-address">

                                            <div className="seller-order-address-icon">
                                                📍
                                            </div>

                                            <div>

                                                <span>
                                                    DELIVERY ADDRESS
                                                </span>

                                                <p>
                                                    {formatAddress(
                                                        order.deliveryAddress
                                                    )}
                                                </p>

                                            </div>

                                        </div>

                                    )}


                                    {/* =================================================
                                        STATUS PROGRESS
                                    ================================================= */}

                                    <div className="seller-order-progress">

                                        {/* CONFIRMED */}

                                        <div
                                            className={
                                                order.status === "CANCELLED"
                                                    ? "seller-progress-step cancelled"
                                                    : [
                                                        "CONFIRMED",
                                                        "PROCESSING",
                                                        "SHIPPED",
                                                        "DELIVERED"
                                                    ].includes(
                                                        order.status
                                                    )
                                                        ? "seller-progress-step active"
                                                        : "seller-progress-step"
                                            }
                                        >

                                            <span>
                                                1
                                            </span>

                                            <small>
                                                Confirmed
                                            </small>

                                        </div>


                                        <div className="seller-progress-line"></div>


                                        {/* PROCESSING */}

                                        <div
                                            className={
                                                [
                                                    "PROCESSING",
                                                    "SHIPPED",
                                                    "DELIVERED"
                                                ].includes(
                                                    order.status
                                                )
                                                    ? "seller-progress-step active"
                                                    : "seller-progress-step"
                                            }
                                        >

                                            <span>
                                                2
                                            </span>

                                            <small>
                                                Processing
                                            </small>

                                        </div>


                                        <div className="seller-progress-line"></div>


                                        {/* SHIPPED */}

                                        <div
                                            className={
                                                [
                                                    "SHIPPED",
                                                    "DELIVERED"
                                                ].includes(
                                                    order.status
                                                )
                                                    ? "seller-progress-step active"
                                                    : "seller-progress-step"
                                            }
                                        >

                                            <span>
                                                3
                                            </span>

                                            <small>
                                                Shipped
                                            </small>

                                        </div>


                                        <div className="seller-progress-line"></div>


                                        {/* DELIVERED */}

                                        <div
                                            className={
                                                order.status === "DELIVERED"
                                                    ? "seller-progress-step active"
                                                    : "seller-progress-step"
                                            }
                                        >

                                            <span>
                                                4
                                            </span>

                                            <small>
                                                Delivered
                                            </small>

                                        </div>

                                    </div>


                                    {/* =================================================
                                        ACTION
                                    ================================================= */}

                                    {nextStatus &&
                                        actionLabel && (

                                            <div className="seller-order-action">

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        updateOrderStatus(
                                                            sellerOrderId,
                                                            order.status
                                                        )
                                                    }
                                                    disabled={
                                                        isUpdating
                                                    }
                                                >

                                                    {isUpdating
                                                        ? "Updating..."
                                                        : actionLabel}

                                                </button>

                                                <small>
                                                    Next status:{" "}

                                                    <strong>
                                                        {formatStatus(
                                                            nextStatus
                                                        )}
                                                    </strong>

                                                </small>

                                            </div>

                                        )}


                                    {/* =================================================
                                        DELIVERED
                                    ================================================= */}

                                    {order.status ===
                                        "DELIVERED" && (

                                            <div className="seller-order-completed">

                                                ✓ This order has been
                                                delivered successfully.

                                            </div>

                                        )}


                                    {/* =================================================
                                        CANCELLED
                                    ================================================= */}

                                    {order.status ===
                                        "CANCELLED" && (

                                            <div className="seller-order-cancelled">

                                                This order has been
                                                cancelled.

                                            </div>

                                        )}

                                </article>
                            );
                        })}

                    </section>

                )}

            </main>


            {/* =====================================================
                FOOTER
            ===================================================== */}

            <footer className="seller-orders-footer">

                <p>
                    © 2026 ShopSphere. Seller Center.
                </p>

            </footer>

        </div>
    );
}

export default SellerOrders;