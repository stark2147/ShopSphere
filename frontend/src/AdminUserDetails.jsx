import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import api from "./api";
import "./App.css";

function AdminUserDetails() {

    const { id } = useParams();
    const navigate = useNavigate();

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        loadUser();
    }, [id]);

    const loadUser = async () => {

        try {
            setLoading(true);
            setError("");

            const response = await api.get(
                `/api/admin/users/${id}`
            );

            setUser(response.data);

        } catch (err) {

            console.error(
                "Failed to load admin user details:",
                err
            );

            setError(
                err.response?.data?.message ||
                "Unable to load user details."
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

    if (loading) {
        return (
            <div className="admin-user-details-page">

                <div className="admin-user-details-loading">

                    <div className="admin-user-details-loading-icon">
                        👤
                    </div>

                    <h2>Loading User Details...</h2>

                    <p>
                        Please wait while we fetch the user's information.
                    </p>

                </div>

            </div>
        );
    }

    if (error) {
        return (
            <div className="admin-user-details-page">

                <div className="admin-user-details-error">

                    <div className="admin-user-details-error-icon">
                        ⚠️
                    </div>

                    <h2>Unable to load user</h2>

                    <p>{error}</p>

                    <button
                        className="admin-primary-button"
                        onClick={loadUser}
                    >
                        Try Again
                    </button>

                </div>

            </div>
        );
    }

    return (
        <div className="admin-user-details-page">

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

                    <Link
                        to="/admin/users"
                        className="active"
                    >
                        Users
                    </Link>

                    <Link to="/admin/sellers">
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

            {/* ================= MAIN CONTENT ================= */}

            <main className="admin-user-details-container">

                <Link
                    to="/admin/users"
                    className="admin-user-details-back-link"
                >
                    ← Back to Users
                </Link>

                <section className="admin-user-details-header">

                    <div>

                        <p className="admin-eyebrow">
                            ADMIN USER MANAGEMENT
                        </p>

                        <h1>
                            User Details
                        </h1>

                        <p>
                            View account information for this ShopSphere user.
                        </p>

                    </div>

                    <div className="admin-user-id-badge">
                        USER #{user?.id}
                    </div>

                </section>

                {/* ================= USER OVERVIEW ================= */}

                <section className="admin-user-overview-grid">

                    <div className="admin-user-detail-card">

                        <div className="admin-detail-card-heading">

                            <span className="admin-detail-card-icon">
                                👤
                            </span>

                            <div>

                                <h2>
                                    Personal Information
                                </h2>

                                <p>
                                    Basic account information
                                </p>

                            </div>

                        </div>

                        <div className="admin-detail-info-list">

                            <div className="admin-detail-row">

                                <span>
                                    User ID
                                </span>

                                <strong>
                                    #{user?.id}
                                </strong>

                            </div>

                            <div className="admin-detail-row">

                                <span>
                                    Full Name
                                </span>

                                <strong>
                                    {user?.name || "-"}
                                </strong>

                            </div>

                            <div className="admin-detail-row">

                                <span>
                                    Email
                                </span>

                                <strong>
                                    {user?.email || "-"}
                                </strong>

                            </div>

                            <div className="admin-detail-row">

                                <span>
                                    Phone Number
                                </span>

                                <strong>
                                    {user?.phoneNumber || "-"}
                                </strong>

                            </div>

                        </div>

                    </div>

                    {/* ================= ACCOUNT INFORMATION ================= */}

                    <div className="admin-user-detail-card">

                        <div className="admin-detail-card-heading">

                            <span className="admin-detail-card-icon">
                                🔐
                            </span>

                            <div>

                                <h2>
                                    Account Information
                                </h2>

                                <p>
                                    ShopSphere account details
                                </p>

                            </div>

                        </div>

                        <div className="admin-detail-info-list">

                            <div className="admin-detail-row">

                                <span>
                                    Account ID
                                </span>

                                <strong>
                                    #{user?.id}
                                </strong>

                            </div>

                            <div className="admin-detail-row">

                                <span>
                                    Account Type
                                </span>

                                <strong>
                                    {user?.role || "-"}
                                </strong>

                            </div>

                            <div className="admin-detail-row">

                                <span>
                                    Email
                                </span>

                                <strong>
                                    {user?.email || "-"}
                                </strong>

                            </div>

                            <div className="admin-detail-row">

                                <span>
                                    Status
                                </span>

                                <span className="admin-user-active-badge">
                                    Active
                                </span>

                            </div>

                        </div>

                    </div>

                </section>

                {/* ================= ROLE CARD ================= */}

                <section className="admin-user-role-section">

                    <div className="admin-user-role-card">

                        <div className="admin-user-role-icon">
                            🛡️
                        </div>

                        <div className="admin-user-role-content">

                            <p className="admin-eyebrow">
                                ACCESS ROLE
                            </p>

                            <h2>
                                {user?.role || "UNKNOWN"}
                            </h2>

                            <p>
                                This account currently has the
                                <strong> {user?.role}</strong> role
                                within ShopSphere.
                            </p>

                        </div>

                    </div>

                </section>

                {/* ================= ADMIN NOTE ================= */}

                <section className="admin-user-admin-note">

                    <div className="admin-user-admin-note-icon">
                        ℹ️
                    </div>

                    <div>

                        <h3>
                            Admin View
                        </h3>

                        <p>
                            This page is for platform administration.
                            Customer and seller profile experiences remain
                            separate from the Admin portal.
                        </p>

                    </div>

                </section>

                {/* ================= ACTIONS ================= */}

                <section className="admin-user-details-actions">

                    <Link
                        to="/admin/users"
                        className="admin-secondary-button"
                    >
                        ← Back to Users
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

export default AdminUserDetails;