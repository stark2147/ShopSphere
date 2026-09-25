import React, { useEffect, useState } from "react";
import api from "./api";
import "./App.css";

const Notifications = () => {

    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);

    const loadNotifications = async () => {
        try {
            const response = await api.get("/api/notifications");
            setNotifications(response.data);
        } catch (error) {
            console.error("Failed to load notifications", error);
        } finally {
            setLoading(false);
        }
    };

    const markAsRead = async (id) => {
        try {
            await api.put(`/api/notifications/${id}/read`);
            loadNotifications();
        } catch (error) {
            console.error("Failed to mark notification as read", error);
        }
    };

    const markAllAsRead = async () => {
        try {
            await api.put("/api/notifications/read-all");
            loadNotifications();
        } catch (error) {
            console.error("Failed to mark notifications as read", error);
        }
    };

    useEffect(() => {
        loadNotifications();
    }, []);

    if (loading) {
        return <div className="page-container">Loading notifications...</div>;
    }

    return (
        <div className="page-container">

            <div className="page-header">
                <div>
                    <h1>Notifications</h1>
                    <p>Stay updated with your ShopSphere activity.</p>
                </div>

                {notifications.length > 0 && (
                    <button
                        className="primary-btn"
                        onClick={markAllAsRead}
                    >
                        Mark All as Read
                    </button>
                )}
            </div>

            {notifications.length === 0 ? (

                <div className="empty-state">
                    <h2>No Notifications</h2>
                    <p>You don't have any notifications yet.</p>
                </div>

            ) : (

                <div className="notifications-list">

                    {notifications.map((notification) => (

                        <div
                            key={notification.id}
                            className={
                                `notification-card ${
                                    notification.read
                                        ? "read"
                                        : "unread"
                                }`
                            }
                            onClick={() =>
                                !notification.read &&
                                markAsRead(notification.id)
                            }
                        >

                            <div className="notification-content">

                                <h3>
                                    {notification.title}
                                </h3>

                                <p>
                                    {notification.message}
                                </p>

                                <small>
                                    {new Date(
                                        notification.createdAt
                                    ).toLocaleString()}
                                </small>

                            </div>

                            {!notification.read && (
                                <span className="notification-dot">
                                    ●
                                </span>
                            )}

                        </div>

                    ))}

                </div>
            )}

        </div>
    );
};

export default Notifications;