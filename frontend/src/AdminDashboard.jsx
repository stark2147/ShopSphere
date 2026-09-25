import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "./api";
import "./App.css";

function AdminDashboard() {

    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        loadDashboard();
    }, []);

    const loadDashboard = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await api.get("/api/admin/dashboard");

            setStats(response.data);

        } catch (err) {

            console.error("Failed to load admin dashboard:", err);

            setError(
                err.response?.data?.message ||
                "Unable to load admin dashboard."
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

        window.location.href = "/login";
    };

    if (loading) {
        return (
            <div className="admin-loading-page">
                <div className="admin-loading-icon">📊</div>
                <h2>Loading Admin Dashboard...</h2>
                <p>Please wait while we fetch the platform statistics.</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="admin-loading-page">
                <div className="admin-loading-icon">⚠️</div>
                <h2>Unable to load dashboard</h2>
                <p>{error}</p>

                <button
                    className="admin-primary-button"
                    onClick={loadDashboard}
                >
                    Try Again
                </button>
            </div>
        );
    }

    return (
        <div className="admin-dashboard-page">

            {/* ADMIN NAVBAR */}

            <nav className="admin-navbar">

                <div className="admin-navbar-brand">
                    <span className="admin-brand-icon">👨‍💼</span>
                    <span>ShopSphere Admin</span>
                </div>

                <div className="admin-navbar-links">

                    <Link
                        to="/admin"
                        className="active"
                    >
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

                    <Link to="/admin/orders">
                        Orders
                    </Link>
                    <Link to="/admin/reviews">Reviews</Link>

                </div>

                <button
                    className="admin-logout-button"
                    onClick={handleLogout}
                >
                    Logout
                </button>

            </nav>


            {/* HEADER */}

            <main className="admin-dashboard-container">

                <section className="admin-dashboard-header">

                    <div>

                        <p className="admin-eyebrow">
                            SHOPSPHERE ADMIN CENTER
                        </p>

                        <h1>
                            Platform Dashboard
                        </h1>

                        <p>
                            Manage and monitor the ShopSphere
                            marketplace from one place.
                        </p>

                    </div>

                </section>


                {/* STAT CARDS */}

                <section className="admin-stats-grid">

                    <div className="admin-stat-card">

                        <div className="admin-stat-icon">
                            👥
                        </div>

                        <div>
                            <span>Total Customers</span>

                            <strong>
                                {stats?.totalUsers ?? 0}
                            </strong>
                        </div>

                    </div>


                    <div className="admin-stat-card">

                        <div className="admin-stat-icon">
                            🏪
                        </div>

                        <div>
                            <span>Total Sellers</span>

                            <strong>
                                {stats?.totalSellers ?? 0}
                            </strong>
                        </div>

                    </div>


                    <div className="admin-stat-card">

                        <div className="admin-stat-icon">
                            📦
                        </div>

                        <div>
                            <span>Total Products</span>

                            <strong>
                                {stats?.totalProducts ?? 0}
                            </strong>
                        </div>

                    </div>


                    <div className="admin-stat-card">

                        <div className="admin-stat-icon">
                            🛒
                        </div>

                        <div>
                            <span>Total Orders</span>

                            <strong>
                                {stats?.totalOrders ?? 0}
                            </strong>

                        </div>

                    </div>

                </section>


                {/* QUICK ACTIONS */}

                <section className="admin-quick-section">

                    <div className="admin-section-heading">

                        <div>

                            <p className="admin-eyebrow">
                                ADMIN TOOLS
                            </p>

                            <h2>
                                Quick Actions
                            </h2>

                        </div>

                    </div>


                    <div className="admin-quick-grid">

                        <Link
                            to="/admin/users"
                            className="admin-quick-card"
                        >

                            <span>👥</span>

                            <div>
                                <h3>Manage Users</h3>
                                <p>
                                    View and manage registered customers.
                                </p>
                            </div>

                        </Link>


                        <Link
                            to="/admin/sellers"
                            className="admin-quick-card"
                        >

                            <span>🏪</span>

                            <div>
                                <h3>Manage Sellers</h3>
                                <p>
                                    Review sellers and approval requests.
                                </p>
                            </div>

                        </Link>


                        <Link
                            to="/admin/products"
                            className="admin-quick-card"
                        >

                            <span>📦</span>

                            <div>
                                <h3>Manage Products</h3>
                                <p>
                                    Monitor products across the marketplace.
                                </p>
                            </div>

                        </Link>


                        <Link
                            to="/admin/orders"
                            className="admin-quick-card"
                        >

                            <span>🛒</span>

                            <div>
                                <h3>Manage Orders</h3>
                                <p>
                                    Monitor marketplace orders.
                                </p>
                            </div>

                        </Link>

                    </div>

                </section>

            </main>


            <footer className="admin-footer">

                <p>
                    © 2026 ShopSphere. Admin Center.
                </p>

            </footer>

        </div>
    );
}

export default AdminDashboard;