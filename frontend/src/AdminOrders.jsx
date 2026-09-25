import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "./api";
import "./App.css";

function AdminOrders() {

    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("ALL");

    useEffect(() => {
        loadOrders();
    }, []);

    const loadOrders = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await api.get("/api/admin/orders");

            setOrders(
                Array.isArray(response.data)
                    ? response.data
                    : []
            );

        } catch (err) {

            console.error(
                "Failed to load admin orders:",
                err
            );

            setError(
                err.response?.data?.message ||
                "Unable to load orders."
            );

        } finally {
            setLoading(false);
        }
    };


    /* =====================================================
       FILTER ORDERS
       ===================================================== */

    const filteredOrders = orders.filter((order) => {

        const search = searchTerm.toLowerCase();

        const matchesSearch =
            String(order.orderId || "")
                .includes(search) ||
            order.customerName
                ?.toLowerCase()
                .includes(search) ||
            order.customerEmail
                ?.toLowerCase()
                .includes(search);

        const matchesStatus =
            statusFilter === "ALL" ||
            order.status === statusFilter;

        return matchesSearch && matchesStatus;
    });


    /* =====================================================
       STATUS CLASS
       ===================================================== */

    const getStatusClass = (status) => {

        switch (status) {

            case "PENDING":
                return "admin-order-status pending";

            case "CONFIRMED":
                return "admin-order-status confirmed";

            case "PROCESSING":
                return "admin-order-status processing";

            case "SHIPPED":
                return "admin-order-status shipped";

            case "DELIVERED":
                return "admin-order-status delivered";

            case "CANCELLED":
                return "admin-order-status cancelled";

            default:
                return "admin-order-status";
        }
    };


    /* =====================================================
       FORMAT STATUS
       ===================================================== */

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


    /* =====================================================
       FORMAT DATE
       ===================================================== */

    const formatDate = (date) => {

        if (!date) {
            return "-";
        }

        return new Date(date).toLocaleDateString(
            "en-IN",
            {
                day: "2-digit",
                month: "short",
                year: "numeric"
            }
        );
    };


    /* =====================================================
       LOGOUT
       ===================================================== */

    const handleLogout = () => {

        const confirmed = window.confirm(
            "Are you sure you want to logout?"
        );

        if (!confirmed) {
            return;
        }

        localStorage.removeItem("token");
        localStorage.removeItem("user");

        window.location.href = "/login";
    };


    /* =====================================================
       LOADING
       ===================================================== */

    if (loading) {

        return (
            <div className="admin-loading-page">

                <div className="admin-loading-icon">
                    🛒
                </div>

                <h2>
                    Loading Orders...
                </h2>

                <p>
                    Please wait while we fetch marketplace orders.
                </p>

            </div>
        );
    }


    return (
        <div className="admin-orders-page">

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


            {/* =================================================
                MAIN
                ================================================= */}

            <main className="admin-orders-container">

                {/* HEADER */}

                <section className="admin-orders-header">

                    <div>

                        <p className="admin-eyebrow">
                            MARKETPLACE MANAGEMENT
                        </p>

                        <h1>
                            Orders
                        </h1>

                        <p>
                            Monitor all orders placed across
                            the ShopSphere marketplace.
                        </p>

                    </div>


                    <div className="admin-orders-count-card">

                        <span>
                            TOTAL ORDERS
                        </span>

                        <strong>
                            {orders.length}
                        </strong>

                    </div>

                </section>


                {/* =================================================
                    TOOLBAR
                    ================================================= */}

                <section className="admin-orders-toolbar">

                    <div className="admin-order-search">

                        <span>
                            🔍
                        </span>

                        <input
                            type="text"
                            placeholder="Search by order ID, customer name or email..."
                            value={searchTerm}
                            onChange={(event) =>
                                setSearchTerm(
                                    event.target.value
                                )
                            }
                        />

                    </div>


                    <select
                        className="admin-order-status-filter"
                        value={statusFilter}
                        onChange={(event) =>
                            setStatusFilter(
                                event.target.value
                            )
                        }
                    >

                        <option value="ALL">
                            All Statuses
                        </option>

                        <option value="PENDING">
                            Pending
                        </option>

                        <option value="CONFIRMED">
                            Confirmed
                        </option>

                        <option value="PROCESSING">
                            Processing
                        </option>

                        <option value="SHIPPED">
                            Shipped
                        </option>

                        <option value="DELIVERED">
                            Delivered
                        </option>

                        <option value="CANCELLED">
                            Cancelled
                        </option>

                    </select>

                </section>


                {/* =================================================
                    ERROR
                    ================================================= */}

                {error && (

                    <div className="admin-orders-error">

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
                            onClick={loadOrders}
                        >
                            Retry
                        </button>

                    </div>

                )}


                {/* =================================================
                    EMPTY
                    ================================================= */}

                {!error &&
                    filteredOrders.length === 0 && (

                        <section className="admin-orders-empty">

                            <div className="admin-orders-empty-icon">
                                🛒
                            </div>

                            <h2>
                                No Orders Found
                            </h2>

                            <p>
                                {searchTerm ||
                                statusFilter !== "ALL"
                                    ? "No orders match your current filters."
                                    : "There are currently no marketplace orders."
                                }
                            </p>

                            {(searchTerm ||
                                statusFilter !== "ALL") && (

                                <button
                                    className="admin-primary-button"
                                    onClick={() => {
                                        setSearchTerm("");
                                        setStatusFilter("ALL");
                                    }}
                                >
                                    Clear Filters
                                </button>

                            )}

                        </section>

                    )}


                {/* =================================================
                    ORDERS LIST
                    ================================================= */}

                {!error &&
                    filteredOrders.length > 0 && (

                        <section className="admin-orders-list">

                            {filteredOrders.map((order) => (

                                <article
                                    className="admin-order-card"
                                    key={order.orderId}
                                >

                                    {/* TOP */}

                                    <div className="admin-order-top">

                                        <div>

                                            <p className="admin-order-eyebrow">
                                                MARKETPLACE ORDER
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


                                    {/* INFORMATION */}

                                    <div className="admin-order-info-grid">


                                        {/* CUSTOMER */}

                                        <div className="admin-order-info-block">

                                            <span>
                                                CUSTOMER
                                            </span>

                                            <strong>
                                                {order.customerName ||
                                                    "Unknown Customer"}
                                            </strong>

                                            <small>
                                                {order.customerEmail ||
                                                    "Email unavailable"}
                                            </small>

                                        </div>


                                        {/* ORDER VALUE */}

                                        <div className="admin-order-info-block">

                                            <span>
                                                ORDER VALUE
                                            </span>

                                            <strong className="admin-order-price">

                                                ₹
                                                {Number(
                                                    order.totalAmount || 0
                                                ).toLocaleString(
                                                    "en-IN"
                                                )}

                                            </strong>

                                        </div>


                                        {/* DATE */}

                                        <div className="admin-order-info-block">

                                            <span>
                                                ORDER DATE
                                            </span>

                                            <strong>
                                                {formatDate(
                                                    order.createdAt
                                                )}
                                            </strong>

                                        </div>


                                        {/* CUSTOMER ID */}

                                        <div className="admin-order-info-block">

                                            <span>
                                                CUSTOMER ID
                                            </span>

                                            <strong>
                                                {order.customerId
                                                    ? `#${order.customerId}`
                                                    : "-"}
                                            </strong>

                                        </div>

                                    </div>


                                    {/* =================================================
    FOOTER
    ================================================= */}

                                    <div className="admin-order-card-footer">

                                        <div>

        <span>
            ORDER STATUS
        </span>

                                            <strong>
                                                {formatStatus(
                                                    order.status
                                                )}
                                            </strong>

                                        </div>


                                        <div className="admin-order-card-actions">

                                            <div className="admin-order-admin-note">

            <span>
                👨‍💼
            </span>

                                                <p>
                                                    Admin monitoring view
                                                </p>

                                            </div>

                                            <Link
                                                to={`/admin/orders/${order.orderId}`}
                                                className="admin-view-order-button"
                                            >
                                                View Order
                                            </Link>

                                        </div>

                                    </div>

                                </article>

                            ))}

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

export default AdminOrders;