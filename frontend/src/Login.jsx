import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "./api";
import "./App.css";

function Login() {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const navigate = useNavigate();

    const handleLogin = async (event) => {

        event.preventDefault();

        try {

            const response = await api.post(
                "/api/auth/login",
                {
                    email: email,
                    password: password
                }
            );

            console.log(
                "Login successful:",
                response.data
            );

            localStorage.setItem(
                "token",
                response.data.token
            );

            const user = {
                id: response.data.id,
                name: response.data.name,
                email: response.data.email,
                role: response.data.role
            };

            localStorage.setItem(
                "user",
                JSON.stringify(user)
            );

            console.log(
                "Logged-in user:",
                user
            );

            alert("Login successful!");

            if (response.data.role === "SELLER") {

                navigate("/seller/dashboard");

            } else if (response.data.role === "ADMIN") {

                navigate("/admin");

            } else {

                navigate("/");

            }

        } catch (error) {

            console.error(
                "Login failed:",
                error
            );

            alert(
                error.response?.data?.message ||
                "Login failed. Please check your email and password."
            );
        }
    };

    return (
        <div className="login-page">

            <div className="login-card">

                <h1>
                    Shop<span>Sphere</span>
                </h1>

                <h2>
                    Welcome Back
                </h2>

                <p>
                    Login to continue shopping
                </p>

                <form onSubmit={handleLogin}>

                    <label>
                        Email
                    </label>

                    <input
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(event) =>
                            setEmail(event.target.value)
                        }
                        required
                    />

                    <label>
                        Password
                    </label>

                    <input
                        type="password"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(event) =>
                            setPassword(event.target.value)
                        }
                        required
                    />

                    <button type="submit">
                        Login
                    </button>

                </form>

                <div className="login-register-section">

                    <p>
                        Don't have a ShopSphere account?
                    </p>

                    <Link
                        to="/register"
                        className="login-register-button"
                    >
                        Create Customer Account
                    </Link>

                    <Link
                        to="/seller/register"
                        className="login-seller-button"
                    >
                        Register as Seller
                    </Link>

                </div>

            </div>

        </div>
    );
}

export default Login;