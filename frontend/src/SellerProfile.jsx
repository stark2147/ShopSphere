import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "./api";
import "./App.css";

function SellerProfile() {
    const navigate = useNavigate();

    const [seller, setSeller] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [editingStore, setEditingStore] = useState(false);
    const [savingStore, setSavingStore] = useState(false);
    const [storeMessage, setStoreMessage] = useState("");
    const [storeError, setStoreError] = useState("");

    const [editForm, setEditForm] = useState({
        name: "",
        email: "",
        storeName: "",
        description: "",
        storeImageUrl: ""
    });
    useEffect(() => {
        loadSellerProfile();
    }, []);

    const loadSellerProfile = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await api.get("/api/sellers/me");
            setSeller(response.data);

        } catch (err) {

            console.error(
                "Failed to load seller profile:",
                err
            );

            setError(
                err.response?.data?.message ||
                "Unable to load your seller profile."
            );

        } finally {

            setLoading(false);
        }
    };

    // =====================================================
    // LOGOUT
    // =====================================================
    const handleEditStore = () => {
        setEditForm({
            name: seller.name || "",
            email: seller.email || "",
            storeName: seller.storeName || "",
            description: seller.description || "",
            storeImageUrl: seller.storeImageUrl || ""
        });

        setStoreMessage("");
        setStoreError("");
        setEditingStore(true);
    };
    const handleInputChange = (event) => {
        const { name, value } = event.target;

        setEditForm((current) => ({
            ...current,
            [name]: value
        }));
    };
    const handleSaveStore = async (event) => {
        event.preventDefault();

        try {
            setSavingStore(true);
            setStoreMessage("");
            setStoreError("");

            const response = await api.put(
                "/api/sellers/me",
                {
                    name: editForm.name,
                    email: editForm.email,
                    password: "temporary",
                    storeName: editForm.storeName,
                    description: editForm.description,
                    storeImageUrl: editForm.storeImageUrl
                }
            );

            setSeller(response.data);

            setStoreMessage("Store information updated successfully.");
            setEditingStore(false);

        } catch (err) {

            console.error(
                "Failed to update seller profile:",
                err
            );

            setStoreError(
                err.response?.data?.message ||
                "Failed to update store information."
            );

        } finally {
            setSavingStore(false);
        }
    };
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

    // =====================================================
    // LOADING
    // =====================================================

    if (loading) {

        return (
            <div className="page-container">

                <h2>
                    Loading your profile...
                </h2>

            </div>
        );
    }

    // =====================================================
    // ERROR
    // =====================================================

    if (error) {

        return (
            <div className="page-container">

                <h2>
                    {error}
                </h2>

                <button onClick={loadSellerProfile}>
                    Try Again
                </button>

            </div>
        );
    }

    // =====================================================
    // PROFILE NOT FOUND
    // =====================================================

    if (!seller) {

        return (
            <div className="page-container">

                <h2>
                    Seller profile not found.
                </h2>

            </div>
        );
    }

    return (
        <div className="seller-profile-page">

            {/* =================================================
                SELLER NAVIGATION
            ================================================= */}

            <nav className="seller-navbar">

                <div className="seller-navbar-brand">
                    🏪 {seller.storeName}
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

                    <Link to="/seller/reviews">
                        Reviews
                    </Link>

                    <Link
                        to="/seller/profile"
                        className="active"
                    >
                        My Profile
                    </Link>

                </div>

            </nav>

            {/* =================================================
                PROFILE HEADER
            ================================================= */}

            <section className="seller-profile-header">

                <div className="seller-profile-avatar">
                    {seller.storeImageUrl ? (
                        <img
                            src={seller.storeImageUrl}
                            alt={`${seller.storeName} store`}
                            className="seller-profile-store-image"
                            onError={(e) => {
                                e.currentTarget.style.display = "none";
                                e.currentTarget.nextElementSibling.style.display = "flex";
                            }}
                        />
                    ) : null}

                    <span
                        className="seller-profile-avatar-fallback"
                        style={{
                            display: seller.storeImageUrl ? "none" : "flex"
                        }}
                    >
        🏪
    </span>
                </div>

                <div className="seller-profile-heading">

                    <p className="seller-store-label">
                        SELLER PROFILE
                    </p>

                    <h1>
                        {seller.storeName}
                    </h1>

                    <p>
                        Manage your seller and store information
                    </p>

                </div>

                <div
                    className={
                        seller.approved
                            ? "seller-status approved"
                            : "seller-status pending"
                    }
                >
                    {seller.approved
                        ? "✓ Approved Seller"
                        : "⏳ Pending Approval"}
                </div>

            </section>

            {/* =================================================
                PROFILE CONTENT
            ================================================= */}

            <section className="seller-profile-content">

                {/* =================================================
                    PERSONAL INFORMATION
                ================================================= */}

                <div className="seller-profile-card">

                    <div className="seller-profile-card-header">

                        <div>

                            <p className="seller-store-label">
                                PERSONAL INFORMATION
                            </p>

                            <h2>
                                Seller Details
                            </h2>

                        </div>

                    </div>

                    <div className="seller-profile-info-grid">

                        <div className="seller-profile-info">

                            <span>
                                Full Name
                            </span>

                            <strong>
                                {seller.name}
                            </strong>

                        </div>

                        <div className="seller-profile-info">

                            <span>
                                Email Address
                            </span>

                            <strong>
                                {seller.email}
                            </strong>

                        </div>

                        <div className="seller-profile-info">

                            <span>
                                Seller ID
                            </span>

                            <strong>
                                #{seller.id}
                            </strong>

                        </div>

                        <div className="seller-profile-info">

                            <span>
                                User ID
                            </span>

                            <strong>
                                #{seller.userId}
                            </strong>

                        </div>

                    </div>

                </div>
                {/* =================================================
    STORE INFORMATION
================================================= */}

                <div className="seller-profile-card">

                    <div className="seller-profile-card-header">

                        <div>

                            <p className="seller-store-label">
                                STORE INFORMATION
                            </p>

                            <h2>
                                Your Store
                            </h2>

                        </div>

                        {!editingStore && (
                            <button
                                type="button"
                                className="seller-edit-store-button"
                                onClick={handleEditStore}
                            >
                                ✏️ Edit Store
                            </button>
                        )}

                    </div>

                    {storeMessage && (
                        <div className="seller-store-success-message">
                            ✓ {storeMessage}
                        </div>
                    )}

                    {storeError && (
                        <div className="seller-store-error-message">
                            {storeError}
                        </div>
                    )}

                    {!editingStore ? (

                        <div className="seller-store-information">

                            <div className="seller-store-preview">

                                <div className="seller-store-preview-image">

                                    {seller.storeImageUrl ? (
                                        <img
                                            src={seller.storeImageUrl}
                                            alt={`${seller.storeName} store`}
                                            onError={(event) => {
                                                event.currentTarget.style.display = "none";
                                                event.currentTarget.nextElementSibling.style.display =
                                                    "flex";
                                            }}
                                        />
                                    ) : null}

                                    <span
                                        style={{
                                            display: seller.storeImageUrl
                                                ? "none"
                                                : "flex"
                                        }}
                                    >
                        🏪
                    </span>

                                </div>

                                <div>
                                    <h3>
                                        {seller.storeName}
                                    </h3>

                                    <p>
                                        {seller.description ||
                                            "No store description added yet."}
                                    </p>
                                </div>

                            </div>

                            <div className="seller-store-info-item">

                <span>
                    Store Name
                </span>

                                <strong>
                                    {seller.storeName}
                                </strong>

                            </div>

                            <div className="seller-store-info-item">

                <span>
                    Store Description
                </span>

                                <p>
                                    {seller.description ||
                                        "No store description added yet."}
                                </p>

                            </div>

                            <div className="seller-store-info-item">

                <span>
                    Store Image
                </span>

                                <p>
                                    {seller.storeImageUrl
                                        ? "Store image configured"
                                        : "No store image configured"}
                                </p>

                            </div>

                            <div className="seller-store-info-item">

                <span>
                    Seller Status
                </span>

                                <strong>
                                    {seller.approved
                                        ? "Approved"
                                        : "Pending Approval"}
                                </strong>

                            </div>

                        </div>

                    ) : (

                        <form
                            className="seller-store-edit-form"
                            onSubmit={handleSaveStore}
                        >

                            <div className="seller-form-group">

                                <label htmlFor="seller-name">
                                    Seller Name
                                </label>

                                <input
                                    id="seller-name"
                                    name="name"
                                    type="text"
                                    value={editForm.name}
                                    onChange={handleInputChange}
                                    required
                                />

                            </div>

                            <div className="seller-form-group">

                                <label htmlFor="seller-email">
                                    Email Address
                                </label>

                                <input
                                    id="seller-email"
                                    name="email"
                                    type="email"
                                    value={editForm.email}
                                    onChange={handleInputChange}
                                    required
                                />

                            </div>

                            <div className="seller-form-group">

                                <label htmlFor="store-name">
                                    Store Name
                                </label>

                                <input
                                    id="store-name"
                                    name="storeName"
                                    type="text"
                                    value={editForm.storeName}
                                    onChange={handleInputChange}
                                    required
                                />

                            </div>

                            <div className="seller-form-group">

                                <label htmlFor="store-description">
                                    Store Description
                                </label>

                                <textarea
                                    id="store-description"
                                    name="description"
                                    value={editForm.description}
                                    onChange={handleInputChange}
                                    rows="5"
                                    required
                                />

                            </div>

                            <div className="seller-form-group">

                                <label htmlFor="store-image-url">
                                    Store Image URL
                                </label>

                                <input
                                    id="store-image-url"
                                    name="storeImageUrl"
                                    type="url"
                                    value={editForm.storeImageUrl}
                                    onChange={handleInputChange}
                                    placeholder="https://example.com/store-image.jpg"
                                />

                                <small>
                                    Use a publicly accessible image URL.
                                </small>

                            </div>

                            {editForm.storeImageUrl && (
                                <div className="seller-store-image-preview">

                                    <p>
                                        Image Preview
                                    </p>

                                    <img
                                        src={editForm.storeImageUrl}
                                        alt="Store preview"
                                        onError={(event) => {
                                            event.currentTarget.style.display =
                                                "none";
                                        }}
                                    />

                                </div>
                            )}

                            <div className="seller-store-edit-actions">

                                <button
                                    type="submit"
                                    className="seller-save-store-button"
                                    disabled={savingStore}
                                >
                                    {savingStore
                                        ? "Saving..."
                                        : "✓ Save Changes"}
                                </button>

                                <button
                                    type="button"
                                    className="seller-cancel-store-button"
                                    onClick={() => {
                                        setEditingStore(false);
                                        setStoreMessage("");
                                        setStoreError("");
                                    }}
                                    disabled={savingStore}
                                >
                                    Cancel
                                </button>

                            </div>

                        </form>

                    )}

                </div>
                {/* =================================================
                    QUICK ACTIONS
                ================================================= */}

                <div className="seller-profile-card">

                    <div className="seller-profile-card-header">

                        <div>

                            <p className="seller-store-label">
                                QUICK ACTIONS
                            </p>

                            <h2>
                                Manage Your Store
                            </h2>

                        </div>

                    </div>

                    <div className="seller-profile-actions">

                        {/* VIEW STORE */}

                        <Link
                            to="/seller/home"
                            className="seller-profile-action"
                        >

                            <span>
                                🏪
                            </span>

                            <div>

                                <strong>
                                    View My Store
                                </strong>

                                <small>
                                    See your products
                                </small>

                            </div>

                        </Link>

                        {/* MANAGE PRODUCTS */}

                        <Link
                            to="/seller/products"
                            className="seller-profile-action"
                        >

                            <span>
                                📦
                            </span>

                            <div>

                                <strong>
                                    Manage Products
                                </strong>

                                <small>
                                    Add, edit or remove products
                                </small>

                            </div>

                        </Link>

                        {/* SELLER DASHBOARD */}

                        <Link
                            to="/seller/dashboard"
                            className="seller-profile-action"
                        >

                            <span>
                                📊
                            </span>

                            <div>

                                <strong>
                                    Seller Dashboard
                                </strong>

                                <small>
                                    View store performance
                                </small>

                            </div>

                        </Link>

                        {/* LOGOUT */}

                        <button
                            type="button"
                            className="seller-profile-action seller-logout-action"
                            onClick={handleLogout}
                        >

                            <span>
                                🚪
                            </span>

                            <div>

                                <strong>
                                    Logout
                                </strong>

                                <small>
                                    Sign out of your seller account
                                </small>

                            </div>

                        </button>

                    </div>

                </div>

            </section>

        </div>
    );
}

export default SellerProfile;