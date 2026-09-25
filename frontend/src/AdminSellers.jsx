import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "./api";
import "./App.css";

function AdminSellers() {

    const navigate = useNavigate();

    const [sellers, setSellers] = useState([]);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("ALL");

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        loadSellers();
    }, []);

    const loadSellers = async () => {

        try {
            setLoading(true);
            setError("");

            const response =
                await api.get("/api/admin/sellers");

            setSellers(
                Array.isArray(response.data)
                    ? response.data
                    : []
            );

        } catch (err) {

            console.error(
                "Failed to load sellers:",
                err
            );

            setError(
                err.response?.data?.message ||
                "Unable to load sellers."
            );

        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (sellerId) => {

        const confirmed = window.confirm(
            "Are you sure you want to approve this seller?"
        );

        if (!confirmed) return;

        try {

            await api.put(
                `/api/admin/sellers/${sellerId}/approve`
            );

            alert("Seller approved successfully.");

            loadSellers();

        } catch (err) {

            console.error(
                "Seller approval failed:",
                err
            );

            alert(
                err.response?.data?.message ||
                "Failed to approve seller."
            );
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

    const filteredSellers = sellers.filter((seller) => {

        const searchText =
            search.trim().toLowerCase();

        const matchesSearch =
            !searchText ||
            String(seller.id)
                .toLowerCase()
                .includes(searchText) ||
            (seller.name || "")
                .toLowerCase()
                .includes(searchText) ||
            (seller.email || "")
                .toLowerCase()
                .includes(searchText) ||
            (seller.storeName || "")
                .toLowerCase()
                .includes(searchText);

        const matchesStatus =
            statusFilter === "ALL" ||
            (statusFilter === "APPROVED" &&
                seller.approved) ||
            (statusFilter === "PENDING" &&
                !seller.approved);

        return matchesSearch && matchesStatus;
    });

    if (loading) {

        return (
            <div className="admin-sellers-page">

                <div className="admin-sellers-loading">

                    <div className="admin-sellers-loading-icon">
                        🏪
                    </div>

                    <h2>
                        Loading Sellers...
                    </h2>

                    <p>
                        Please wait while we fetch seller accounts.
                    </p>

                </div>

            </div>
        );
    }

    if (error) {

        return (
            <div className="admin-sellers-page">

                <div className="admin-sellers-error">

                    <div className="admin-sellers-error-icon">
                        ⚠️
                    </div>

                    <h2>
                        Unable to load sellers
                    </h2>

                    <p>
                        {error}
                    </p>

                    <button
                        className="admin-primary-button"
                        onClick={loadSellers}
                    >
                        Try Again
                    </button>

                </div>

            </div>
        );
    }

    return (
        <div className="admin-sellers-page">

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

            <main className="admin-sellers-container">

                {/* HEADER */}

                <section className="admin-sellers-header">

                    <div>

                        <p className="admin-eyebrow">
                            SHOPSPHERE ADMIN CENTER
                        </p>

                        <h1>
                            Seller Management
                        </h1>

                        <p>
                            Review, monitor and manage sellers
                            registered on ShopSphere.
                        </p>

                    </div>

                    <div className="admin-sellers-count-card">

                        <span>
                            Total Sellers
                        </span>

                        <strong>
                            {sellers.length}
                        </strong>

                    </div>

                </section>

                {/* TOOLBAR */}

                <section className="admin-sellers-toolbar">

                    <div className="admin-seller-search-wrapper">

                        <span>
                            🔍
                        </span>

                        <input
                            type="text"
                            className="admin-seller-search"
                            placeholder="Search by seller, store, email or ID..."
                            value={search}
                            onChange={(e) =>
                                setSearch(e.target.value)
                            }
                        />

                    </div>

                    <select
                        className="admin-seller-status-filter"
                        value={statusFilter}
                        onChange={(e) =>
                            setStatusFilter(e.target.value)
                        }
                    >

                        <option value="ALL">
                            All Sellers
                        </option>

                        <option value="APPROVED">
                            Approved
                        </option>

                        <option value="PENDING">
                            Pending Approval
                        </option>

                    </select>

                </section>

                {/* SELLER TABLE */}

                {filteredSellers.length === 0 ? (

                    <section className="admin-sellers-empty">

                        <div className="admin-sellers-empty-icon">
                            🏪
                        </div>

                        <h2>
                            No Sellers Found
                        </h2>

                        <p>
                            No seller accounts match your
                            current search or filter.
                        </p>

                    </section>

                ) : (

                    <section className="admin-sellers-table-section">

                        <div className="admin-sellers-table-wrapper">

                            <table className="admin-sellers-table">

                                <thead>

                                <tr>

                                    <th>
                                        Seller
                                    </th>

                                    <th>
                                        Store
                                    </th>

                                    <th>
                                        Email
                                    </th>

                                    <th>
                                        Status
                                    </th>

                                    <th>
                                        Actions
                                    </th>

                                </tr>

                                </thead>

                                <tbody>

                                {filteredSellers.map(
                                    (seller) => (

                                        <tr key={seller.id}>

                                            {/* SELLER */}

                                            <td>

                                                <div className="admin-seller-cell">

                                                    <div className="admin-seller-avatar">
                                                        🏪
                                                    </div>

                                                    <div>

                                                        <strong>
                                                            {seller.name || "-"}
                                                        </strong>

                                                        <span>
                                                                Seller #{seller.id}
                                                            </span>

                                                    </div>

                                                </div>

                                            </td>

                                            {/* STORE */}

                                            <td>

                                                <div className="admin-seller-store-cell">

                                                    <strong>
                                                        {seller.storeName || "-"}
                                                    </strong>

                                                    <span>
                                                            {seller.description
                                                                ? seller.description
                                                                : "No description"}
                                                        </span>

                                                </div>

                                            </td>

                                            {/* EMAIL */}

                                            <td>

                                                    <span className="admin-seller-email">
                                                        {seller.email || "-"}
                                                    </span>

                                            </td>

                                            {/* STATUS */}

                                            <td>

                                                {seller.approved ? (

                                                    <span className="admin-seller-approved-badge">
                                                            ✓ Approved
                                                        </span>

                                                ) : (

                                                    <span className="admin-seller-pending-badge">
                                                            ⏳ Pending
                                                        </span>

                                                )}

                                            </td>

                                            {/* ACTIONS */}

                                            <td>

                                                <div className="admin-seller-actions">

                                                    <Link
                                                        to={`/admin/sellers/${seller.id}`}
                                                        className="admin-view-seller-button"
                                                    >
                                                        View
                                                    </Link>

                                                    {!seller.approved && (

                                                        <button
                                                            className="admin-approve-seller-button"
                                                            onClick={() =>
                                                                handleApprove(
                                                                    seller.id
                                                                )
                                                            }
                                                        >
                                                            Approve
                                                        </button>

                                                    )}

                                                </div>

                                            </td>

                                        </tr>

                                    )
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

export default AdminSellers;