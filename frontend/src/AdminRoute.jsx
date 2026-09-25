import React from "react";
import { Navigate } from "react-router-dom";

function AdminRoute({ children }) {

    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");

    if (!token || !userData) {
        return <Navigate to="/login" replace />;
    }

    let user;

    try {
        user = JSON.parse(userData);
    } catch (error) {
        console.error("Invalid user data:", error);

        localStorage.removeItem("token");
        localStorage.removeItem("user");

        return <Navigate to="/login" replace />;
    }

    if (user.role !== "ADMIN") {
        if (user.role === "SELLER") {
            return <Navigate to="/seller/home" replace />;
        }

        return <Navigate to="/" replace />;
    }

    return children;
}

export default AdminRoute;