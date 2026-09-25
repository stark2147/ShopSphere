import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "./api";
import "./App.css";

function SellerRegister() {

    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        storeName: "",
        description: "",
        storeImageUrl: ""
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleChange = (event) => {

        const { name, value } = event.target;

        setFormData((previousData) => ({
            ...previousData,
            [name]: value
        }));

        setError("");
        setSuccess("");
    };

    const handleSubmit = async (event) => {

        event.preventDefault();

        setError("");
        setSuccess("");

        if (formData.password.length < 6) {
            setError("Password must contain at least 6 characters.");
            return;
        }

        try {

            setLoading(true);

            await api.post(
                "/api/sellers/register",
                {
                    name: formData.name,
                    email: formData.email,
                    password: formData.password,
                    storeName: formData.storeName,
                    description: formData.description,
                    storeImageUrl: formData.storeImageUrl
                }
            );

            setSuccess(
                "Seller registration successful! Your account is waiting for admin approval."
            );

            setTimeout(() => {
                navigate("/login");
            }, 2000);

        } catch (error) {

            console.error(
                "Seller registration failed:",
                error
            );

            const backendMessage =
                error.response?.data?.message;

            if (backendMessage) {

                setError(backendMessage);

            } else if (error.response?.data?.errors) {

                const validationErrors =
                    error.response.data.errors;

                setError(
                    Object.values(validationErrors).join(", ")
                );

            } else {

                setError(
                    "Seller registration failed. Please try again."
                );
            }

        } finally {

            setLoading(false);
        }
    };

    return (
        <div className="register-page">

            <div className="seller-register-card">

                <div className="register-brand">
                    Shop<span>Sphere</span>
                </div>

                <h1>
                    Become a Seller
                </h1>

                <p className="register-subtitle">
                    Create your store and start selling on ShopSphere.
                </p>

                {error && (
                    <div className="register-message register-error">
                        {error}
                    </div>
                )}

                {success && (
                    <div className="register-message register-success">
                        {success}
                    </div>
                )}

                <form onSubmit={handleSubmit}>

                    <div className="register-field">

                        <label htmlFor="seller-name">
                            Your Name
                        </label>

                        <input
                            id="seller-name"
                            name="name"
                            type="text"
                            placeholder="Enter your full name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />

                    </div>

                    <div className="register-field">

                        <label htmlFor="seller-email">
                            Email
                        </label>

                        <input
                            id="seller-email"
                            name="email"
                            type="email"
                            placeholder="Enter your email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />

                    </div>

                    <div className="register-field">

                        <label htmlFor="seller-password">
                            Password
                        </label>

                        <input
                            id="seller-password"
                            name="password"
                            type="password"
                            placeholder="Create a password"
                            value={formData.password}
                            onChange={handleChange}
                            minLength="6"
                            required
                        />

                        <small>
                            Password must contain at least 6 characters.
                        </small>

                    </div>

                    <div className="register-field">

                        <label htmlFor="store-name">
                            Store Name
                        </label>

                        <input
                            id="store-name"
                            name="storeName"
                            type="text"
                            placeholder="Enter your store name"
                            value={formData.storeName}
                            onChange={handleChange}
                            required
                        />

                    </div>

                    <div className="register-field">

                        <label htmlFor="store-description">
                            Store Description
                        </label>

                        <textarea
                            id="store-description"
                            name="description"
                            placeholder="Describe what your store sells..."
                            value={formData.description}
                            onChange={handleChange}
                            rows="4"
                            required
                        />

                    </div>

                    <div className="register-field">

                        <label htmlFor="store-image">
                            Store Image URL
                            <span className="optional-label">
                                Optional
                            </span>
                        </label>

                        <input
                            id="store-image"
                            name="storeImageUrl"
                            type="url"
                            placeholder="https://example.com/store-image.jpg"
                            value={formData.storeImageUrl}
                            onChange={handleChange}
                        />

                    </div>

                    <button
                        type="submit"
                        className="register-button"
                        disabled={loading}
                    >

                        {loading
                            ? "Creating Seller Account..."
                            : "Create Seller Account"
                        }

                    </button>

                </form>

                <div className="seller-approval-note">

                    <strong>
                        Seller approval required
                    </strong>

                    <p>
                        After registration, your seller account
                        will need to be approved by an administrator
                        before you can start selling.
                    </p>

                </div>

                <p className="register-login-text">

                    Already have an account?

                    {" "}

                    <Link to="/login">
                        Login here
                    </Link>

                </p>

                <p className="register-login-text">

                    Want to shop instead?

                    {" "}

                    <Link to="/register">
                        Create Customer Account
                    </Link>

                </p>

            </div>

        </div>
    );
}

export default SellerRegister;