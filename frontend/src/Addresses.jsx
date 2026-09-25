import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "./api";
import "./App.css";

function Addresses() {

    const emptyForm = {
        fullName: "",
        phoneNumber: "",
        addressLine1: "",
        addressLine2: "",
        landmark: "",
        city: "",
        state: "",
        pincode: "",
        country: "India",
        addressType: "HOME",
        defaultAddress: false
    };

    const [addresses, setAddresses] = useState([]);
    const [form, setForm] = useState(emptyForm);

    const [editingId, setEditingId] = useState(null);
    const [showForm, setShowForm] = useState(false);

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [message, setMessage] = useState("");
    const [error, setError] = useState("");


    /* =========================================================
       LOAD ADDRESSES
       ========================================================= */

    useEffect(() => {
        loadAddresses();
    }, []);


    const loadAddresses = async () => {

        try {

            const response = await api.get(
                "/api/addresses"
            );

            console.log(
                "My addresses:",
                response.data
            );

            setAddresses(
                response.data || []
            );

        } catch (error) {

            console.error(
                "Error loading addresses:",
                error
            );

            setError(
                error.response?.data?.message ||
                "Could not load your addresses."
            );

        } finally {

            setLoading(false);

        }
    };


    /* =========================================================
       FORM HANDLING
       ========================================================= */

    const handleChange = (event) => {

        const {
            name,
            value,
            type,
            checked
        } = event.target;

        setForm((previousForm) => ({
            ...previousForm,
            [name]:
                type === "checkbox"
                    ? checked
                    : value
        }));
    };


    /* =========================================================
       OPEN ADD FORM
       ========================================================= */

    const openAddForm = () => {

        setEditingId(null);
        setForm({
            ...emptyForm
        });

        setMessage("");
        setError("");

        setShowForm(true);
    };


    /* =========================================================
       OPEN EDIT FORM
       ========================================================= */

    const openEditForm = (address) => {

        setEditingId(address.id);

        setForm({
            fullName:
                address.fullName || "",

            phoneNumber:
                address.phoneNumber || "",

            addressLine1:
                address.addressLine1 || "",

            addressLine2:
                address.addressLine2 || "",

            landmark:
                address.landmark || "",

            city:
                address.city || "",

            state:
                address.state || "",

            pincode:
                address.pincode || "",

            country:
                address.country || "India",

            addressType:
                address.addressType || "HOME",

            defaultAddress:
                address.defaultAddress || false
        });

        setMessage("");
        setError("");

        setShowForm(true);
    };


    /* =========================================================
       CLOSE FORM
       ========================================================= */

    const closeForm = () => {

        setShowForm(false);
        setEditingId(null);

        setForm({
            ...emptyForm
        });

        setMessage("");
        setError("");
    };


    /* =========================================================
       SAVE / UPDATE ADDRESS
       ========================================================= */

    const saveAddress = async (event) => {

        event.preventDefault();

        setSaving(true);
        setMessage("");
        setError("");

        try {

            if (editingId) {

                await api.put(
                    `/api/addresses/${editingId}`,
                    form
                );

                setMessage(
                    "Address updated successfully! ✅"
                );

            } else {

                await api.post(
                    "/api/addresses",
                    form
                );

                setMessage(
                    "Address added successfully! ✅"
                );
            }

            await loadAddresses();

            setShowForm(false);
            setEditingId(null);

            setForm({
                ...emptyForm
            });

        } catch (error) {

            console.error(
                "Error saving address:",
                error
            );

            setError(
                error.response?.data?.message ||
                "Could not save the address."
            );

        } finally {

            setSaving(false);
        }
    };


    /* =========================================================
       DELETE ADDRESS
       ========================================================= */

    const deleteAddress = async (id) => {

        const confirmed = window.confirm(
            "Are you sure you want to delete this address?"
        );

        if (!confirmed) {
            return;
        }

        try {

            await api.delete(
                `/api/addresses/${id}`
            );

            setMessage(
                "Address deleted successfully! ✅"
            );

            await loadAddresses();

        } catch (error) {

            console.error(
                "Error deleting address:",
                error
            );

            setError(
                error.response?.data?.message ||
                "Could not delete the address."
            );
        }
    };


    /* =========================================================
       SET DEFAULT ADDRESS
       ========================================================= */

    const makeDefault = async (id) => {

        try {

            await api.put(
                `/api/addresses/${id}/default`
            );

            setMessage(
                "Default address updated successfully! ❤️"
            );

            await loadAddresses();

        } catch (error) {

            console.error(
                "Error setting default address:",
                error
            );

            setError(
                error.response?.data?.message ||
                "Could not update the default address."
            );
        }
    };


    /* =========================================================
       ADDRESS ICON
       ========================================================= */

    const getAddressIcon = (type) => {

        if (type === "HOME") {
            return "🏠";
        }

        if (type === "WORK") {
            return "💼";
        }

        return "📍";
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

                <main className="premium-address-loading">

                    <div className="address-loading-icon">
                        📍
                    </div>

                    <h2>
                        Loading your addresses...
                    </h2>

                    <p>
                        Please wait while we retrieve
                        your saved delivery addresses.
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
                ADDRESS PAGE
            ================================================= */}

            <main className="premium-address-page">


                {/* PAGE HEADER */}

                <section className="address-page-header">

                    <div>

                        <span className="section-eyebrow">
                            MY ACCOUNT
                        </span>

                        <h1>
                            Saved Addresses
                        </h1>

                        <p>
                            Manage your delivery addresses
                            for faster checkout.
                        </p>

                    </div>


                    <button
                        type="button"
                        className="premium-add-address-button"
                        onClick={openAddForm}
                    >
                        <span>+</span>
                        Add New Address
                    </button>

                </section>


                {/* =================================================
                    MESSAGES
                ================================================= */}

                {message && (

                    <div className="premium-address-message success">

                        <span>✓</span>

                        <p>
                            {message}
                        </p>

                        <button
                            type="button"
                            onClick={() => setMessage("")}
                        >
                            ✕
                        </button>

                    </div>

                )}


                {error && (

                    <div className="premium-address-message error">

                        <span>⚠</span>

                        <p>
                            {error}
                        </p>

                        <button
                            type="button"
                            onClick={() => setError("")}
                        >
                            ✕
                        </button>

                    </div>

                )}


                {/* =================================================
                    ADD / EDIT FORM
                ================================================= */}

                {showForm && (

                    <section className="premium-address-form-card">


                        <div className="premium-address-form-header">

                            <div>

                                <span>
                                    {editingId
                                        ? "UPDATE DELIVERY ADDRESS"
                                        : "NEW DELIVERY ADDRESS"}
                                </span>

                                <h2>
                                    {editingId
                                        ? "Edit Address"
                                        : "Add New Address"}
                                </h2>

                                <p>
                                    Enter the details where you
                                    would like your orders delivered.
                                </p>

                            </div>


                            <button
                                type="button"
                                className="premium-close-address-button"
                                onClick={closeForm}
                            >
                                ✕
                            </button>

                        </div>


                        <form
                            className="premium-address-form"
                            onSubmit={saveAddress}
                        >

                            <div className="premium-address-form-grid">


                                {/* FULL NAME */}

                                <div className="premium-address-field">

                                    <label>
                                        Full Name *
                                    </label>

                                    <input
                                        type="text"
                                        name="fullName"
                                        value={form.fullName}
                                        onChange={handleChange}
                                        placeholder="Enter recipient name"
                                        required
                                    />

                                </div>


                                {/* PHONE */}

                                <div className="premium-address-field">

                                    <label>
                                        Phone Number *
                                    </label>

                                    <input
                                        type="tel"
                                        name="phoneNumber"
                                        value={form.phoneNumber}
                                        onChange={handleChange}
                                        placeholder="+91 9876543210"
                                        required
                                    />

                                </div>


                                {/* ADDRESS LINE 1 */}

                                <div className="premium-address-field full">

                                    <label>
                                        Address Line 1 *
                                    </label>

                                    <input
                                        type="text"
                                        name="addressLine1"
                                        value={form.addressLine1}
                                        onChange={handleChange}
                                        placeholder="House / Flat / Building / Street"
                                        required
                                    />

                                </div>


                                {/* ADDRESS LINE 2 */}

                                <div className="premium-address-field full">

                                    <label>
                                        Address Line 2
                                    </label>

                                    <input
                                        type="text"
                                        name="addressLine2"
                                        value={form.addressLine2}
                                        onChange={handleChange}
                                        placeholder="Apartment, area, locality (optional)"
                                    />

                                </div>


                                {/* LANDMARK */}

                                <div className="premium-address-field">

                                    <label>
                                        Landmark
                                    </label>

                                    <input
                                        type="text"
                                        name="landmark"
                                        value={form.landmark}
                                        onChange={handleChange}
                                        placeholder="Nearby landmark"
                                    />

                                </div>


                                {/* CITY */}

                                <div className="premium-address-field">

                                    <label>
                                        City *
                                    </label>

                                    <input
                                        type="text"
                                        name="city"
                                        value={form.city}
                                        onChange={handleChange}
                                        placeholder="Enter city"
                                        required
                                    />

                                </div>


                                {/* STATE */}

                                <div className="premium-address-field">

                                    <label>
                                        State *
                                    </label>

                                    <input
                                        type="text"
                                        name="state"
                                        value={form.state}
                                        onChange={handleChange}
                                        placeholder="Enter state"
                                        required
                                    />

                                </div>


                                {/* PINCODE */}

                                <div className="premium-address-field">

                                    <label>
                                        Pincode *
                                    </label>

                                    <input
                                        type="text"
                                        name="pincode"
                                        value={form.pincode}
                                        onChange={handleChange}
                                        placeholder="6-digit pincode"
                                        maxLength="6"
                                        required
                                    />

                                </div>


                                {/* COUNTRY */}

                                <div className="premium-address-field">

                                    <label>
                                        Country *
                                    </label>

                                    <input
                                        type="text"
                                        name="country"
                                        value={form.country}
                                        onChange={handleChange}
                                        required
                                    />

                                </div>


                                {/* ADDRESS TYPE */}

                                <div className="premium-address-field">

                                    <label>
                                        Address Type *
                                    </label>

                                    <select
                                        name="addressType"
                                        value={form.addressType}
                                        onChange={handleChange}
                                    >

                                        <option value="HOME">
                                            🏠 Home
                                        </option>

                                        <option value="WORK">
                                            💼 Work
                                        </option>

                                        <option value="OTHER">
                                            📍 Other
                                        </option>

                                    </select>

                                </div>

                            </div>


                            {/* DEFAULT ADDRESS */}

                            <label className="premium-default-address">

                                <input
                                    type="checkbox"
                                    name="defaultAddress"
                                    checked={
                                        form.defaultAddress
                                    }
                                    onChange={handleChange}
                                />

                                <span className="premium-checkbox-box">
                                    ✓
                                </span>

                                <span>
                                    Make this my default delivery address
                                </span>

                            </label>


                            {/* FORM ACTIONS */}

                            <div className="premium-address-form-actions">

                                <button
                                    type="button"
                                    className="premium-cancel-address-button"
                                    onClick={closeForm}
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    className="premium-save-address-button"
                                    disabled={saving}
                                >
                                    {saving
                                        ? "Saving..."
                                        : editingId
                                            ? "Update Address →"
                                            : "Save Address →"}
                                </button>

                            </div>

                        </form>

                    </section>

                )}


                {/* =================================================
                    ADDRESS LIST
                ================================================= */}

                {addresses.length === 0 ? (

                    <section className="premium-empty-addresses">

                        <div className="empty-address-visual">
                            📍
                        </div>

                        <span className="section-eyebrow">
                            DELIVERY ADDRESSES
                        </span>

                        <h2>
                            No saved addresses
                        </h2>

                        <p>
                            Add your first delivery address to
                            make checkout faster and easier.
                        </p>

                        <button
                            type="button"
                            className="premium-empty-address-button"
                            onClick={openAddForm}
                        >
                            + Add Your First Address
                        </button>

                    </section>

                ) : (

                    <section className="saved-address-section">


                        <div className="saved-address-section-header">

                            <div>

                                <span>
                                    YOUR ADDRESSES
                                </span>

                                <h2>
                                    Saved Delivery Addresses
                                </h2>

                            </div>

                            <strong>
                                {addresses.length}{" "}
                                {addresses.length === 1
                                    ? "address"
                                    : "addresses"}
                            </strong>

                        </div>


                        <div className="premium-address-grid">

                            {addresses.map((address) => (

                                <article
                                    className={
                                        address.defaultAddress
                                            ? "premium-address-card default"
                                            : "premium-address-card"
                                    }
                                    key={address.id}
                                >


                                    {/* CARD HEADER */}

                                    <div className="premium-address-card-header">

                                        <div className="premium-address-type">

                                            <div className="premium-address-type-icon">
                                                {getAddressIcon(
                                                    address.addressType
                                                )}
                                            </div>

                                            <div>

                                                <span>
                                                    ADDRESS TYPE
                                                </span>

                                                <strong>
                                                    {address.addressType}
                                                </strong>

                                            </div>

                                        </div>


                                        {address.defaultAddress && (

                                            <span className="premium-default-badge">
                                                DEFAULT
                                            </span>

                                        )}

                                    </div>


                                    {/* CARD BODY */}

                                    <div className="premium-address-card-body">

                                        <h3>
                                            {address.fullName}
                                        </h3>

                                        <div className="premium-address-phone">
                                            📞 {address.phoneNumber}
                                        </div>

                                        <p>
                                            {address.addressLine1}
                                        </p>

                                        {address.addressLine2 && (

                                            <p>
                                                {address.addressLine2}
                                            </p>

                                        )}

                                        {address.landmark && (

                                            <p>
                                                <span>
                                                    Landmark:
                                                </span>{" "}
                                                {address.landmark}
                                            </p>

                                        )}

                                        <p>
                                            {address.city},{" "}
                                            {address.state}{" "}
                                            -{" "}
                                            {address.pincode}
                                        </p>

                                        <p>
                                            {address.country}
                                        </p>

                                    </div>


                                    {/* CARD ACTIONS */}

                                    <div className="premium-address-card-actions">


                                        {!address.defaultAddress && (

                                            <button
                                                type="button"
                                                className="premium-set-default-button"
                                                onClick={() =>
                                                    makeDefault(
                                                        address.id
                                                    )
                                                }
                                            >
                                                ☆ Set Default
                                            </button>

                                        )}


                                        <button
                                            type="button"
                                            className="premium-edit-address-button"
                                            onClick={() =>
                                                openEditForm(
                                                    address
                                                )
                                            }
                                        >
                                            ✏ Edit
                                        </button>


                                        <button
                                            type="button"
                                            className="premium-delete-address-button"
                                            onClick={() =>
                                                deleteAddress(
                                                    address.id
                                                )
                                            }
                                        >
                                            🗑 Delete
                                        </button>

                                    </div>

                                </article>

                            ))}

                        </div>

                    </section>

                )}


                {/* =================================================
                    ACCOUNT NAVIGATION
                ================================================= */}

                <div className="address-account-navigation">

                    <Link to="/profile">
                        ← Back to My Account
                    </Link>

                    <Link to="/checkout">
                        Continue to Checkout →
                    </Link>

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

export default Addresses;