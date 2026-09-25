import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "./api";
import "./App.css";

function Profile() {

    const [profile, setProfile] = useState(null);
    const [name, setName] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState("");

    const navigate = useNavigate();


    /* =========================================================
       LOAD PROFILE
       ========================================================= */

    useEffect(() => {
        loadProfile();
    }, []);


    const loadProfile = async () => {

        try {

            const response = await api.get(
                "/api/profile"
            );

            console.log(
                "My profile:",
                response.data
            );

            setProfile(response.data);

            setName(
                response.data.name || ""
            );

            setPhoneNumber(
                response.data.phoneNumber || ""
            );

        } catch (error) {

            console.error(
                "Error loading profile:",
                error
            );

            if (error.response?.status !== 401) {

                setMessage(
                    error.response?.data?.message ||
                    "Could not load your profile."
                );

            }

        } finally {

            setLoading(false);

        }
    };


    /* =========================================================
       UPDATE PROFILE
       ========================================================= */

    const updateProfile = async (event) => {

        event.preventDefault();

        setSaving(true);
        setMessage("");

        try {

            const response = await api.put(
                "/api/profile",
                {
                    name: name,
                    phoneNumber: phoneNumber
                }
            );

            console.log(
                "Updated profile:",
                response.data
            );

            setProfile(response.data);

            setName(
                response.data.name || ""
            );

            setPhoneNumber(
                response.data.phoneNumber || ""
            );

            setMessage(
                "Profile updated successfully! ✅"
            );

            /*
             * Keep the locally stored user
             * information synchronized.
             */
            localStorage.setItem(
                "user",
                JSON.stringify(response.data)
            );

        } catch (error) {

            console.error(
                "Error updating profile:",
                error
            );

            if (error.response?.status !== 401) {

                setMessage(
                    error.response?.data?.message ||
                    "Could not update your profile."
                );

            }

        } finally {

            setSaving(false);

        }
    };


    /* =========================================================
       LOGOUT
       ========================================================= */

    const handleLogout = () => {

        const confirmed = window.confirm(
            "Are you sure you want to logout?"
        );

        if (!confirmed) {
            return;
        }

        localStorage.removeItem("token");
        localStorage.removeItem("user");

        navigate("/login");
    };


    /* =========================================================
       AVATAR LETTER
       ========================================================= */

    const getInitial = () => {

        if (
            profile?.name &&
            profile.name.trim().length > 0
        ) {
            return profile.name
                .trim()
                .charAt(0)
                .toUpperCase();
        }

        return "U";
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

                <main className="premium-profile-loading">

                    <div className="profile-loading-icon">
                        👤
                    </div>

                    <h2>
                        Loading your profile...
                    </h2>

                    <p>
                        Please wait while we retrieve
                        your account information.
                    </p>

                </main>

            </div>
        );
    }


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
                PROFILE PAGE
            ================================================= */}

            <main className="premium-profile-page">


                {/* =================================================
                    HEADER
                ================================================= */}

                <section className="profile-page-header">

                    <div>

                        <span className="section-eyebrow">
                            SHOPSPHERE ACCOUNT
                        </span>

                        <h1>
                            My Account
                        </h1>

                        <p>
                            Manage your personal information,
                            addresses and shopping activity.
                        </p>

                    </div>

                </section>


                {/* =================================================
                    PROFILE LAYOUT
                ================================================= */}

                <div className="premium-profile-layout">


                    {/* =================================================
                        SIDEBAR
                    ================================================= */}

                    <aside className="premium-account-sidebar">


                        <div className="account-profile-mini">

                            <div className="account-profile-avatar">
                                {getInitial()}
                            </div>

                            <div>

                                <strong>
                                    {profile?.name || "ShopSphere User"}
                                </strong>

                                <span>
                                    {profile?.email || ""}
                                </span>

                            </div>

                        </div>


                        <div className="account-sidebar-divider"></div>


                        <span className="account-sidebar-label">
                            ACCOUNT
                        </span>


                        <Link
                            to="/profile"
                            className="premium-account-menu active"
                        >
                            <span>👤</span>
                            Profile
                        </Link>


                        <Link
                            to="/addresses"
                            className="premium-account-menu"
                        >
                            <span>📍</span>
                            Addresses
                        </Link>


                        <Link
                            to="/orders"
                            className="premium-account-menu"
                        >
                            <span>📦</span>
                            My Orders
                        </Link>


                        <Link
                            to="/wishlist"
                            className="premium-account-menu"
                        >
                            <span>❤️</span>
                            Wishlist
                        </Link>


                        <span className="account-sidebar-label account-sidebar-label-spaced">
                            ACCOUNT ACTIONS
                        </span>


                        <button
                            type="button"
                            className="premium-account-menu logout"
                            onClick={handleLogout}
                        >
                            <span>🚪</span>
                            Logout
                        </button>

                    </aside>


                    {/* =================================================
                        MAIN PROFILE CARD
                    ================================================= */}

                    <section className="premium-profile-content">


                        {/* PROFILE INTRO */}

                        <div className="premium-profile-card">


                            <div className="premium-profile-card-header">

                                <div className="premium-profile-avatar">
                                    {getInitial()}
                                </div>


                                <div>

                                    <span className="profile-card-label">
                                        PERSONAL INFORMATION
                                    </span>

                                    <h2>
                                        Your Profile
                                    </h2>

                                    <p>
                                        Keep your personal details
                                        up to date.
                                    </p>

                                </div>

                            </div>


                            {/* FORM */}

                            <form
                                className="premium-profile-form"
                                onSubmit={updateProfile}
                            >


                                <div className="profile-form-grid">


                                    {/* NAME */}

                                    <div className="premium-profile-field">

                                        <label>
                                            Full Name
                                        </label>

                                        <input
                                            type="text"
                                            value={name}
                                            onChange={(event) =>
                                                setName(
                                                    event.target.value
                                                )
                                            }
                                            placeholder="Enter your full name"
                                            required
                                        />

                                    </div>


                                    {/* EMAIL */}

                                    <div className="premium-profile-field">

                                        <label>
                                            Email Address
                                        </label>

                                        <input
                                            type="email"
                                            value={
                                                profile?.email || ""
                                            }
                                            disabled
                                        />

                                        <small>
                                            Your email address cannot
                                            be changed here.
                                        </small>

                                    </div>


                                    {/* PHONE */}

                                    <div className="premium-profile-field">

                                        <label>
                                            Phone Number
                                        </label>

                                        <input
                                            type="tel"
                                            value={phoneNumber}
                                            onChange={(event) =>
                                                setPhoneNumber(
                                                    event.target.value
                                                )
                                            }
                                            placeholder="+91 9876543210"
                                        />

                                    </div>


                                    {/* ROLE */}

                                    <div className="premium-profile-field">

                                        <label>
                                            Account Type
                                        </label>

                                        <input
                                            type="text"
                                            value={
                                                profile?.role || ""
                                            }
                                            disabled
                                        />

                                    </div>

                                </div>


                                {/* SAVE */}

                                <div className="profile-form-footer">

                                    <p>
                                        🔒 Your account information
                                        is securely stored.
                                    </p>

                                    <button
                                        type="submit"
                                        className="premium-profile-save-button"
                                        disabled={saving}
                                    >

                                        {saving
                                            ? "Saving Changes..."
                                            : "Save Changes →"}

                                    </button>

                                </div>


                            </form>


                            {/* MESSAGE */}

                            {message && (

                                <div
                                    className={
                                        message.includes(
                                            "successfully"
                                        )
                                            ? "premium-profile-message success"
                                            : "premium-profile-message error"
                                    }
                                >

                                    {message}

                                </div>

                            )}

                        </div>


                        {/* =================================================
                            QUICK ACTIONS
                            ================================================= */}

                        <div className="profile-quick-actions">


                            <Link
                                to="/orders"
                                className="profile-quick-card"
                            >

                                <div className="profile-quick-icon">
                                    📦
                                </div>

                                <div>

                                    <strong>
                                        My Orders
                                    </strong>

                                    <span>
                                        Track your purchases
                                    </span>

                                </div>

                                <span className="profile-quick-arrow">
                                    →
                                </span>

                            </Link>


                            <Link
                                to="/addresses"
                                className="profile-quick-card"
                            >

                                <div className="profile-quick-icon">
                                    📍
                                </div>

                                <div>

                                    <strong>
                                        Addresses
                                    </strong>

                                    <span>
                                        Manage delivery addresses
                                    </span>

                                </div>

                                <span className="profile-quick-arrow">
                                    →
                                </span>

                            </Link>


                            <Link
                                to="/wishlist"
                                className="profile-quick-card"
                            >

                                <div className="profile-quick-icon">
                                    ❤️
                                </div>

                                <div>

                                    <strong>
                                        Wishlist
                                    </strong>

                                    <span>
                                        View saved products
                                    </span>

                                </div>

                                <span className="profile-quick-arrow">
                                    →
                                </span>

                            </Link>


                            <Link
                                to="/cart"
                                className="profile-quick-card"
                            >

                                <div className="profile-quick-icon">
                                    🛒
                                </div>

                                <div>

                                    <strong>
                                        Shopping Cart
                                    </strong>

                                    <span>
                                        Review items in your cart
                                    </span>

                                </div>

                                <span className="profile-quick-arrow">
                                    →
                                </span>

                            </Link>


                        </div>

                    </section>

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

export default Profile;