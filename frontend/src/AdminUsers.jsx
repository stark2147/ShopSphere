import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "./api";
import "./App.css";

function AdminUsers() {

    const navigate = useNavigate();

    const [users, setUsers] = useState([]);
    const [search, setSearch] = useState("");
    const [roleFilter, setRoleFilter] = useState("ALL");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        loadUsers();
    }, []);

    const loadUsers = async () => {

        try {
            setLoading(true);
            setError("");

            const response = await api.get("/api/admin/users");

            setUsers(
                Array.isArray(response.data)
                    ? response.data
                    : []
            );

        } catch (err) {

            console.error(
                "Failed to load admin users:",
                err
            );

            setError(
                err.response?.data?.message ||
                "Unable to load users."
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

    const filteredUsers = users.filter((user) => {

        const searchText = search.toLowerCase();

        const matchesSearch =
            String(user.id).includes(searchText) ||
            (user.name || "")
                .toLowerCase()
                .includes(searchText) ||
            (user.email || "")
                .toLowerCase()
                .includes(searchText);

        const matchesRole =
            roleFilter === "ALL" ||
            user.role === roleFilter;

        return matchesSearch && matchesRole;
    });

    if (loading) {
        return (
            <div className="admin-loading-page">

                <div className="admin-loading-icon">
                    👥
                </div>

                <h2>
                    Loading Users...
                </h2>

                <p>
                    Please wait while we fetch the ShopSphere users.
                </p>

            </div>
        );
    }

    return (
        <div className="admin-users-page">

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

            {/* ================= MAIN ================= */}

            <main className="admin-users-container">

                <section className="admin-users-header">

                    <div>

                        <p className="admin-eyebrow">
                            SHOPSPHERE ADMIN CENTER
                        </p>

                        <h1>
                            User Management
                        </h1>

                        <p>
                            View and monitor registered ShopSphere accounts.
                        </p>

                    </div>

                    <div className="admin-users-count-card">

                        <span>
                            Total Users
                        </span>

                        <strong>
                            {users.length}
                        </strong>

                    </div>

                </section>

                {/* ================= TOOLBAR ================= */}

                <section className="admin-users-toolbar">

                    <input
                        type="text"
                        className="admin-user-search"
                        placeholder="Search by ID, name or email..."
                        value={search}
                        onChange={(e) =>
                            setSearch(e.target.value)
                        }
                    />

                    <select
                        className="admin-user-role-filter"
                        value={roleFilter}
                        onChange={(e) =>
                            setRoleFilter(e.target.value)
                        }
                    >

                        <option value="ALL">
                            All Roles
                        </option>

                        <option value="CUSTOMER">
                            Customers
                        </option>

                        <option value="SELLER">
                            Sellers
                        </option>

                        <option value="ADMIN">
                            Admins
                        </option>

                    </select>

                </section>

                {/* ================= ERROR ================= */}

                {error && (
                    <div className="admin-users-error">

                        <span>⚠️</span>

                        <p>
                            {error}
                        </p>

                        <button
                            className="admin-primary-button"
                            onClick={loadUsers}
                        >
                            Try Again
                        </button>

                    </div>
                )}

                {/* ================= USER LIST ================= */}

                {!error && filteredUsers.length === 0 ? (

                    <section className="admin-users-empty">

                        <div className="admin-users-empty-icon">
                            👥
                        </div>

                        <h2>
                            No Users Found
                        </h2>

                        <p>
                            No users match your current search or filter.
                        </p>

                    </section>

                ) : (

                    <section className="admin-users-table-section">

                        <div className="admin-users-table-wrapper">

                            <table className="admin-users-table">

                                <thead>

                                <tr>

                                    <th>
                                        ID
                                    </th>

                                    <th>
                                        User
                                    </th>

                                    <th>
                                        Email
                                    </th>

                                    <th>
                                        Phone
                                    </th>

                                    <th>
                                        Role
                                    </th>

                                    <th>
                                        Action
                                    </th>

                                </tr>

                                </thead>

                                <tbody>

                                {filteredUsers.map((user) => (

                                    <tr key={user.id}>

                                        <td>
                                            <strong>
                                                #{user.id}
                                            </strong>
                                        </td>

                                        <td>

                                            <div className="admin-user-cell">

                                                <div className="admin-user-avatar">
                                                    👤
                                                </div>

                                                <div>

                                                    <strong>
                                                        {user.name || "-"}
                                                    </strong>

                                                </div>

                                            </div>

                                        </td>

                                        <td>
                                            {user.email || "-"}
                                        </td>

                                        <td>
                                            {user.phoneNumber || "-"}
                                        </td>

                                        <td>

                                                <span
                                                    className={`admin-user-role-badge admin-user-role-${(
                                                        user.role || ""
                                                    ).toLowerCase()}`}
                                                >
                                                    {user.role || "-"}
                                                </span>

                                        </td>

                                        <td>

                                            <Link
                                                to={`/admin/users/${user.id}`}
                                                className="admin-view-user-button"
                                            >
                                                View
                                            </Link>

                                        </td>

                                    </tr>

                                ))}

                                </tbody>

                            </table>

                        </div>

                    </section>

                )}

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

export default AdminUsers;