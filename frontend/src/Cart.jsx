import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "./api";
import "./App.css";

function Cart() {

    const navigate = useNavigate();

    const [cart, setCart] = useState(null);
    const [loading, setLoading] = useState(true);

    const loadCart = async () => {

        try {

            const response = await api.get("/api/cart");

            console.log("Cart:", response.data);

            setCart(response.data);

        } catch (error) {

            console.error(
                "Error loading cart:",
                error
            );

        } finally {

            setLoading(false);

        }
    };

    useEffect(() => {

        loadCart();

    }, []);


    const updateQuantity = async (
        itemId,
        newQuantity
    ) => {

        if (newQuantity < 1) {
            return;
        }

        try {

            await api.put(
                `/api/cart/items/${itemId}`,
                {
                    quantity: newQuantity
                }
            );

            await loadCart();

        } catch (error) {

            console.error(
                "Error updating quantity:",
                error
            );

            alert(
                error.response?.data?.message ||
                "Could not update quantity."
            );

        }
    };


    const removeItem = async (itemId) => {

        try {

            await api.delete(
                `/api/cart/items/${itemId}`
            );

            await loadCart();

        } catch (error) {

            console.error(
                "Error removing item:",
                error
            );

            alert(
                error.response?.data?.message ||
                "Could not remove item."
            );

        }
    };


    /* =========================
       LOADING
    ========================= */

    if (loading) {

        return (

            <div className="cart-loading">

                <div className="cart-loading-icon">
                    🛒
                </div>

                <h2>
                    Loading your cart...
                </h2>

                <p>
                    Please wait while we retrieve your items.
                </p>

            </div>

        );

    }


    const hasItems =
        cart &&
        cart.items &&
        cart.items.length > 0;


    return (

        <div className="app">


            {/* =========================
                NAVBAR
            ========================= */}

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

                    <Link
                        to="/cart"
                        className="active-nav-link"
                    >
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


            {/* =========================
                CART PAGE
            ========================= */}

            <main className="premium-cart-page">


                {/* PAGE HEADER */}

                <div className="cart-page-header">

                    <div>

                        <span className="section-eyebrow">
                            SHOPSPHERE CART
                        </span>

                        <h1>
                            Your Shopping Cart
                        </h1>

                        <p>
                            Review your selected items before
                            placing your order.
                        </p>

                    </div>


                    {hasItems && (

                        <div className="cart-item-count">

                            <strong>
                                {cart.items.length}
                            </strong>

                            <span>
                                {cart.items.length === 1
                                    ? "ITEM"
                                    : "ITEMS"}
                            </span>

                        </div>

                    )}

                </div>


                {hasItems ? (

                    <div className="cart-layout">


                        {/* =========================
                            CART ITEMS
                        ========================= */}

                        <section className="cart-items-section">

                            <div className="cart-section-heading">

                                <h2>
                                    Cart Items
                                </h2>

                                <span>
                                    {cart.items.length}{" "}
                                    {cart.items.length === 1
                                        ? "product"
                                        : "products"}
                                </span>

                            </div>


                            <div className="premium-cart-items">

                                {cart.items.map((item) => {

                                    const itemTotal =
                                        Number(item.price) *
                                        Number(item.quantity);

                                    return (

                                        <article
                                            className="premium-cart-item"
                                            key={item.id}
                                        >


                                            {/* PRODUCT VISUAL */}

                                            <Link
                                                to={`/products/${item.productId}`}
                                                className="cart-product-visual"
                                            >

                                                <span>
                                                    🛍️
                                                </span>

                                            </Link>


                                            {/* PRODUCT INFORMATION */}

                                            <div className="cart-product-information">

                                                <span className="cart-product-label">
                                                    SHOPSPHERE PRODUCT
                                                </span>

                                                <Link
                                                    to={`/products/${item.productId}`}
                                                    className="cart-product-name"
                                                >
                                                    {item.productName}
                                                </Link>

                                                <p className="cart-product-unit-price">
                                                    ₹
                                                    {Number(
                                                        item.price
                                                    ).toLocaleString(
                                                        "en-IN"
                                                    )}{" "}
                                                    per item
                                                </p>


                                                {/* QUANTITY */}

                                                <div className="cart-quantity-area">

                                                    <span>
                                                        Quantity
                                                    </span>

                                                    <div className="cart-quantity-controls">

                                                        <button
                                                            type="button"
                                                            onClick={() => {

                                                                if (
                                                                    item.quantity ===
                                                                    1
                                                                ) {

                                                                    removeItem(
                                                                        item.id
                                                                    );

                                                                } else {

                                                                    updateQuantity(
                                                                        item.id,
                                                                        item.quantity -
                                                                        1
                                                                    );

                                                                }

                                                            }}
                                                        >
                                                            −
                                                        </button>


                                                        <strong>
                                                            {item.quantity}
                                                        </strong>


                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                updateQuantity(
                                                                    item.id,
                                                                    item.quantity +
                                                                    1
                                                                )
                                                            }
                                                        >
                                                            +
                                                        </button>

                                                    </div>

                                                </div>

                                            </div>


                                            {/* ITEM TOTAL */}

                                            <div className="cart-item-right">

                                                <div className="cart-item-total">

                                                    <span>
                                                        ITEM TOTAL
                                                    </span>

                                                    <strong>
                                                        ₹
                                                        {itemTotal.toLocaleString(
                                                            "en-IN"
                                                        )}
                                                    </strong>

                                                </div>


                                                <button
                                                    type="button"
                                                    className="cart-remove-button"
                                                    onClick={() =>
                                                        removeItem(
                                                            item.id
                                                        )
                                                    }
                                                >
                                                    🗑 Remove
                                                </button>

                                            </div>

                                        </article>

                                    );

                                })}

                            </div>


                            {/* CONTINUE SHOPPING */}

                            <Link
                                to="/products"
                                className="cart-continue-shopping"
                            >
                                ← Continue Shopping
                            </Link>

                        </section>


                        {/* =========================
                            ORDER SUMMARY
                        ========================= */}

                        <aside className="cart-summary-card">

                            <div className="cart-summary-header">

                                <span>
                                    ORDER SUMMARY
                                </span>

                                <h2>
                                    Your Order
                                </h2>

                            </div>


                            <div className="cart-summary-lines">

                                <div>
                                    <span>
                                        Items
                                    </span>

                                    <strong>
                                        {cart.items.length}
                                    </strong>
                                </div>


                                <div>
                                    <span>
                                        Subtotal
                                    </span>

                                    <strong>
                                        ₹
                                        {Number(
                                            cart.totalAmount
                                        ).toLocaleString(
                                            "en-IN"
                                        )}
                                    </strong>
                                </div>


                                <div>
                                    <span>
                                        Delivery
                                    </span>

                                    <strong className="free-delivery">
                                        FREE
                                    </strong>
                                </div>

                            </div>


                            <div className="cart-summary-divider">
                            </div>


                            <div className="cart-summary-total">

                                <span>
                                    Total Amount
                                </span>

                                <strong>
                                    ₹
                                    {Number(
                                        cart.totalAmount
                                    ).toLocaleString(
                                        "en-IN"
                                    )}
                                </strong>

                            </div>


                            <button
                                type="button"
                                className="cart-checkout-button"
                                onClick={() =>
                                    navigate("/checkout")
                                }
                            >
                                Proceed to Checkout
                                <span>→</span>
                            </button>


                            <div className="cart-security-note">

                                <span>
                                    🔒
                                </span>

                                <p>
                                    Secure checkout powered by
                                    ShopSphere.
                                </p>

                            </div>

                        </aside>

                    </div>

                ) : (


                    /* =========================
                       EMPTY CART
                    ========================= */

                    <section className="premium-empty-cart">

                        <div className="empty-cart-icon">
                            🛒
                        </div>

                        <span className="section-eyebrow">
                            YOUR CART
                        </span>

                        <h2>
                            Your cart is empty
                        </h2>

                        <p>
                            Looks like you haven't added
                            anything to your cart yet.
                        </p>

                        <Link
                            to="/products"
                            className="empty-cart-shopping-button"
                        >
                            Start Shopping →
                        </Link>

                    </section>

                )}

            </main>


            {/* =========================
                FOOTER
            ========================= */}

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

export default Cart;