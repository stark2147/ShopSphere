import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "./api";
import "./App.css";

function Register() {

    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: ""
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
                "/api/users/register",
                {
                    name: formData.name,
                    email: formData.email,
                    password: formData.password
                }
            );

            setSuccess(
                "Registration successful! Redirecting to login..."
            );

            setTimeout(() => {
                navigate("/login");
            }, 1500);

        } catch (error) {

            console.error(
                "Customer registration failed:",
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
                    "Registration failed. Please try again."
                );
            }

        } finally {

            setLoading(false);
        }
    };

    return (
        <div className="register-page">

            <div className="register-card">

                <div className="register-brand">
                    Shop<span>Sphere</span>
                </div>

                <h1>Create Customer Account</h1>

                <p className="register-subtitle">
                    Join ShopSphere and start shopping today.
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

                        <label htmlFor="name">
                            Full Name
                        </label>

                        <input
                            id="name"
                            name="name"
                            type="text"
                            placeholder="Enter your full name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />

                    </div>

                    <div className="register-field">

                        <label htmlFor="email">
                            Email
                        </label>

                        <input
                            id="email"
                            name="email"
                            type="email"
                            placeholder="Enter your email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />

                    </div>

                    <div className="register-field">

                        <label htmlFor="password">
                            Password
                        </label>

                        <input
                            id="password"
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

                    <button
                        type="submit"
                        className="register-button"
                        disabled={loading}
                    >

                        {loading
                            ? "Creating Account..."
                            : "Create Account"
                        }

                    </button>

                </form>

                <div className="register-divider">
                    <span>OR</span>
                </div>

                <div className="seller-register-box">

                    <h3>
                        Want to sell on ShopSphere?
                    </h3>

                    <p>
                        Create your seller account and start
                        building your store.
                    </p>

                    <Link
                        to="/seller/register"
                        className="seller-register-link"
                    >
                        Register as Seller
                    </Link>

                </div>

                <p className="register-login-text">

                    Already have an account?

                    {" "}

                    <Link to="/login">
                        Login here
                    </Link>

                </p>

            </div>

        </div>
    );
}

export default Register;