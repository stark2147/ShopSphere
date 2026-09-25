import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "./api";
import "./App.css";

function Checkout() {
    const [cart, setCart] = useState(null);
    const [addresses, setAddresses] = useState([]);
    const [selectedAddressId, setSelectedAddressId] = useState(null);

    const [loading, setLoading] = useState(true);
    const [addressLoading, setAddressLoading] = useState(true);
    const [paymentLoading, setPaymentLoading] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        loadCheckoutData();
    }, []);

    const loadCheckoutData = async () => {
        try {
            const [cartResponse, addressResponse] = await Promise.all([
                api.get("/api/cart"),
                api.get("/api/addresses")
            ]);

            console.log("Checkout cart:", cartResponse.data);
            console.log("Checkout addresses:", addressResponse.data);

            setCart(cartResponse.data);

            const loadedAddresses = addressResponse.data || [];

            setAddresses(loadedAddresses);

            const defaultAddress = loadedAddresses.find(
                (address) => address.defaultAddress
            );

            if (defaultAddress) {
                setSelectedAddressId(defaultAddress.id);
            } else if (loadedAddresses.length > 0) {
                setSelectedAddressId(loadedAddresses[0].id);
            }
        } catch (error) {
            console.error("Error loading checkout:", error);

            alert(
                error.response?.data?.message ||
                "Could not load checkout information."
            );
        } finally {
            setLoading(false);
            setAddressLoading(false);
        }
    };

    const getSelectedAddress = () => {
        return addresses.find(
            (address) => address.id === selectedAddressId
        );
    };

    const handlePayment = async () => {
        if (paymentLoading) return;

        if (!selectedAddressId) {
            alert(
                "Please select a delivery address before placing your order."
            );
            return;
        }

        const selectedAddress = getSelectedAddress();

        if (!selectedAddress) {
            alert("Please select a valid delivery address.");
            return;
        }

        try {
            setPaymentLoading(true);

            console.log(
                "Selected delivery address:",
                selectedAddress
            );

            /*
             * STEP 1
             * Create ShopSphere order
             */
            const orderResponse = await api.post(
                "/api/orders",
                null,
                {
                    params: {
                        addressId: selectedAddressId
                    }
                }
            );

            const createdOrder = orderResponse.data;

            console.log(
                "ShopSphere order created:",
                createdOrder
            );

            /*
             * STEP 2
             * Create Razorpay payment order
             */
            const paymentResponse = await api.post(
                `/api/payments/create/${createdOrder.id}`
            );

            const paymentData = paymentResponse.data;

            console.log(
                "Razorpay order created:",
                paymentData
            );

            /*
             * STEP 3
             * Check Razorpay Checkout
             */
            if (!window.Razorpay) {
                alert(
                    "Razorpay Checkout could not be loaded. Please refresh the page and try again."
                );
                setPaymentLoading(false);
                return;
            }

            /*
             * STEP 4
             * Razorpay Checkout Configuration
             */
            const options = {
                key: paymentData.keyId,

                amount: paymentData.amount,

                currency: paymentData.currency,

                name: "ShopSphere",

                description: `Payment for ShopSphere Order #${createdOrder.id}`,

                order_id: paymentData.razorpayOrderId,

                handler: async function (paymentResponse) {
                    console.log(
                        "Razorpay payment successful:",
                        paymentResponse
                    );

                    try {
                        /*
                         * STEP 5
                         * Verify payment with backend
                         */
                        const verifyResponse = await api.post(
                            "/api/payments/verify",
                            {
                                razorpayOrderId:
                                paymentResponse.razorpay_order_id,

                                razorpayPaymentId:
                                paymentResponse.razorpay_payment_id,

                                razorpaySignature:
                                paymentResponse.razorpay_signature
                            }
                        );

                        console.log(
                            "Payment verification:",
                            verifyResponse.data
                        );

                        /*
                         * STEP 6
                         * Go to Order Success
                         */
                        navigate("/order-success", {
                            state: {
                                orderId: createdOrder.id,
                                amount: paymentData.amount
                            }
                        });
                    } catch (error) {
                        console.error(
                            "Payment verification failed:",
                            error
                        );

                        setPaymentLoading(false);

                        alert(
                            error.response?.data?.message ||
                            "Payment verification failed."
                        );
                    }
                },

                modal: {
                    ondismiss: function () {
                        console.log(
                            "Razorpay checkout closed by customer."
                        );

                        setPaymentLoading(false);
                    }
                },

                theme: {
                    color: "#6c3df4"
                }
            };

            /*
             * STEP 4B
             * Create Razorpay instance
             */
            const razorpay =
                new window.Razorpay(options);

            razorpay.on(
                "payment.failed",
                function (response) {
                    console.error(
                        "Razorpay payment failed:",
                        response.error
                    );

                    setPaymentLoading(false);

                    alert(
                        response.error?.description ||
                        "Payment failed. Please try again."
                    );
                }
            );

            razorpay.open();
        } catch (error) {
            console.error(
                "Error starting payment:",
                error
            );

            setPaymentLoading(false);

            alert(
                error.response?.data?.message ||
                "Could not start payment. Please try again."
            );
        }
    };

    /*
     * Loading screen
     */
    if (loading) {
        return (
            <div className="checkout-loading-page">
                <div className="checkout-loading-icon">
                    🛒
                </div>

                <h2>Preparing your checkout...</h2>

                <p>
                    Please wait while we load your cart and delivery details.
                </p>
            </div>
        );
    }

    /*
     * Empty cart
     */
    if (!cart || !cart.items || cart.items.length === 0) {
        return (
            <div className="app">
                <nav className="navbar">
                    <Link to="/" className="logo">
                        Shop<span>Sphere</span>
                    </Link>

                    <div className="nav-actions">
                        <Link to="/">Home</Link>
                        <Link to="/products">Products</Link>
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

                <main className="checkout-empty-page">
                    <div className="checkout-empty-icon">
                        🛒
                    </div>

                    <span className="section-eyebrow">
                        SHOPSPHERE CHECKOUT
                    </span>

                    <h1>Your Cart is Empty</h1>

                    <p>
                        Add some products to your cart before proceeding
                        to checkout.
                    </p>

                    <Link
                        to="/products"
                        className="checkout-empty-button"
                    >
                        Start Shopping →
                    </Link>
                </main>

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
                        <p>© 2026 ShopSphere</p>
                        <p>Built with React + Spring Boot</p>
                    </div>
                </footer>
            </div>
        );
    }

    const selectedAddress = getSelectedAddress();

    return (
        <div className="app">

            {/* =================================================
                NAVBAR
            ================================================= */}

            <nav className="navbar">

                <Link to="/" className="logo">
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
                CHECKOUT PAGE
            ================================================= */}

            <main className="premium-checkout-page">

                {/* HEADER */}

                <section className="checkout-page-header">

                    <div>

                        <span className="section-eyebrow">
                            SHOPSPHERE CHECKOUT
                        </span>

                        <h1>
                            Complete Your Order
                        </h1>

                        <p>
                            Confirm your delivery details and securely
                            complete your purchase.
                        </p>

                    </div>

                    <Link
                        to="/cart"
                        className="checkout-back-cart"
                    >
                        ← Back to Cart
                    </Link>

                </section>


                {/* CHECKOUT STEPS */}

                <div className="checkout-progress">

                    <div className="checkout-progress-step active">
                        <span>1</span>
                        <div>
                            <strong>Delivery</strong>
                            <small>Address</small>
                        </div>
                    </div>

                    <div className="checkout-progress-line"></div>

                    <div className="checkout-progress-step active">
                        <span>2</span>
                        <div>
                            <strong>Order</strong>
                            <small>Review</small>
                        </div>
                    </div>

                    <div className="checkout-progress-line"></div>

                    <div className="checkout-progress-step">
                        <span>3</span>
                        <div>
                            <strong>Payment</strong>
                            <small>Secure checkout</small>
                        </div>
                    </div>

                </div>


                {/* MAIN CHECKOUT LAYOUT */}

                <div className="premium-checkout-layout">

                    {/* =================================================
                        LEFT SIDE
                    ================================================= */}

                    <div className="checkout-main-column">


                        {/* =========================
                            ADDRESS SECTION
                        ========================= */}

                        <section className="premium-checkout-section">

                            <div className="premium-checkout-section-header">

                                <div className="checkout-heading-left">

                                    <span className="checkout-section-number">
                                        1
                                    </span>

                                    <div>

                                        <span className="checkout-heading-label">
                                            DELIVERY
                                        </span>

                                        <h2>
                                            Delivery Address
                                        </h2>

                                        <p>
                                            Choose where you'd like your
                                            order delivered.
                                        </p>

                                    </div>

                                </div>

                                <Link
                                    to="/addresses"
                                    className="checkout-manage-address"
                                >
                                    Manage Addresses
                                </Link>

                            </div>


                            {addressLoading ? (

                                <div className="checkout-address-loading">
                                    <span>📍</span>
                                    Loading your saved addresses...
                                </div>

                            ) : addresses.length === 0 ? (

                                <div className="checkout-no-address">

                                    <div className="checkout-no-address-icon">
                                        📍
                                    </div>

                                    <h3>
                                        No delivery address yet
                                    </h3>

                                    <p>
                                        Add an address before placing your
                                        order.
                                    </p>

                                    <Link
                                        to="/addresses"
                                        className="checkout-add-address-button"
                                    >
                                        + Add Delivery Address
                                    </Link>

                                </div>

                            ) : (

                                <div className="premium-address-list">

                                    {addresses.map((address) => {

                                        const isSelected =
                                            selectedAddressId === address.id;

                                        return (
                                            <div
                                                key={address.id}
                                                className={
                                                    isSelected
                                                        ? "premium-address-card selected"
                                                        : "premium-address-card"
                                                }
                                                onClick={() =>
                                                    setSelectedAddressId(
                                                        address.id
                                                    )
                                                }
                                            >

                                                <div className="address-radio-wrapper">

                                                    <input
                                                        type="radio"
                                                        name="deliveryAddress"
                                                        checked={isSelected}
                                                        onChange={() =>
                                                            setSelectedAddressId(
                                                                address.id
                                                            )
                                                        }
                                                    />

                                                </div>


                                                <div className="premium-address-content">

                                                    <div className="premium-address-top">

                                                        <div className="premium-address-type">

                                                            <span className="address-type-icon">

                                                                {address.addressType ===
                                                                "HOME"
                                                                    ? "🏠"
                                                                    : address.addressType ===
                                                                    "WORK"
                                                                        ? "💼"
                                                                        : "📍"}

                                                            </span>

                                                            <strong>
                                                                {address.addressType}
                                                            </strong>

                                                            {address.defaultAddress && (
                                                                <span className="checkout-default-badge">
                                                                    DEFAULT
                                                                </span>
                                                            )}

                                                        </div>

                                                        {isSelected && (
                                                            <span className="address-selected-badge">
                                                                ✓ SELECTED
                                                            </span>
                                                        )}

                                                    </div>


                                                    <h3>
                                                        {address.fullName}
                                                    </h3>

                                                    <p>
                                                        📞{" "}
                                                        {address.phoneNumber}
                                                    </p>

                                                    <p>
                                                        {address.addressLine1}
                                                    </p>

                                                    {address.addressLine2 && (
                                                        <p>
                                                            {
                                                                address.addressLine2
                                                            }
                                                        </p>
                                                    )}

                                                    {address.landmark && (
                                                        <p>
                                                            <span className="address-detail-label">
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


                                                <Link
                                                    to="/addresses"
                                                    className="checkout-edit-address"
                                                    onClick={(event) =>
                                                        event.stopPropagation()
                                                    }
                                                >
                                                    Edit
                                                </Link>

                                            </div>
                                        );
                                    })}

                                </div>
                            )}

                        </section>


                        {/* =================================================
                            ORDER ITEMS
                        ================================================= */}

                        <section className="premium-checkout-section">

                            <div className="premium-checkout-section-header">

                                <div className="checkout-heading-left">

                                    <span className="checkout-section-number">
                                        2
                                    </span>

                                    <div>

                                        <span className="checkout-heading-label">
                                            ORDER
                                        </span>

                                        <h2>
                                            Review Your Items
                                        </h2>

                                        <p>
                                            Check the products and quantities
                                            before payment.
                                        </p>

                                    </div>

                                </div>

                                <Link
                                    to="/cart"
                                    className="checkout-review-cart-link"
                                >
                                    Edit Cart
                                </Link>

                            </div>


                            <div className="premium-checkout-items">

                                {cart.items.map((item) => {

                                    const itemTotal =
                                        Number(item.price) *
                                        Number(item.quantity);

                                    return (
                                        <article
                                            className="premium-checkout-item"
                                            key={item.id}
                                        >

                                            <Link
                                                to={`/products/${item.productId}`}
                                                className="checkout-item-visual"
                                            >
                                                <span>
                                                    🛍️
                                                </span>
                                            </Link>


                                            <div className="checkout-item-information">

                                                <span className="checkout-item-label">
                                                    SHOPSPHERE PRODUCT
                                                </span>

                                                <Link
                                                    to={`/products/${item.productId}`}
                                                    className="checkout-item-name"
                                                >
                                                    {item.productName}
                                                </Link>

                                                <div className="checkout-item-meta">

                                                    <span>
                                                        ₹
                                                        {Number(
                                                            item.price
                                                        ).toLocaleString(
                                                            "en-IN"
                                                        )}{" "}
                                                        each
                                                    </span>

                                                    <span>
                                                        × {item.quantity}
                                                    </span>

                                                </div>

                                            </div>


                                            <div className="checkout-item-price">

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

                                        </article>
                                    );
                                })}

                            </div>

                        </section>


                        {/* =================================================
                            PAYMENT INFORMATION
                        ================================================= */}

                        <section className="checkout-payment-info">

                            <div className="checkout-payment-icon">
                                🔒
                            </div>

                            <div>

                                <strong>
                                    Secure Payment
                                </strong>

                                <p>
                                    Your payment is securely processed by
                                    Razorpay. ShopSphere does not store your
                                    card or banking credentials.
                                </p>

                            </div>

                        </section>

                    </div>


                    {/* =================================================
                        RIGHT SIDE — ORDER SUMMARY
                    ================================================= */}

                    <aside className="premium-checkout-summary">

                        <div className="checkout-summary-card">

                            <div className="checkout-summary-card-header">

                                <span>
                                    ORDER SUMMARY
                                </span>

                                <h2>
                                    Your Order
                                </h2>

                            </div>


                            {/* ITEM COUNT */}

                            <div className="checkout-summary-line">

                                <span>
                                    Items
                                </span>

                                <strong>
                                    {cart.items.length}
                                </strong>

                            </div>


                            {/* SUBTOTAL */}

                            <div className="checkout-summary-line">

                                <span>
                                    Subtotal
                                </span>

                                <strong>
                                    ₹
                                    {Number(
                                        cart.totalAmount
                                    ).toLocaleString("en-IN")}
                                </strong>

                            </div>


                            {/* DELIVERY */}

                            <div className="checkout-summary-line">

                                <span>
                                    Delivery
                                </span>

                                <strong className="checkout-free-delivery">
                                    FREE
                                </strong>

                            </div>


                            <div className="checkout-summary-divider"></div>


                            {/* TOTAL */}

                            <div className="checkout-summary-total">

                                <span>
                                    Total Amount
                                </span>

                                <strong>
                                    ₹
                                    {Number(
                                        cart.totalAmount
                                    ).toLocaleString("en-IN")}
                                </strong>

                            </div>


                            {/* SELECTED ADDRESS */}

                            {selectedAddress && (

                                <div className="checkout-selected-address">

                                    <div className="checkout-selected-address-heading">
                                        <span>📍</span>
                                        <strong>
                                            Delivering to
                                        </strong>
                                    </div>

                                    <strong className="checkout-selected-name">
                                        {selectedAddress.fullName}
                                    </strong>

                                    <span>
                                        {selectedAddress.addressLine1}
                                    </span>

                                    <span>
                                        {selectedAddress.city},{" "}
                                        {selectedAddress.state}{" "}
                                        -{" "}
                                        {selectedAddress.pincode}
                                    </span>

                                    <span>
                                        📞{" "}
                                        {selectedAddress.phoneNumber}
                                    </span>

                                </div>

                            )}


                            {/* PAYMENT BUTTON */}

                            <button
                                type="button"
                                className={
                                    paymentLoading
                                        ? "checkout-pay-button loading"
                                        : "checkout-pay-button"
                                }
                                onClick={handlePayment}
                                disabled={
                                    addresses.length === 0 ||
                                    !selectedAddressId ||
                                    paymentLoading
                                }
                            >

                                {paymentLoading ? (
                                    <>
                                        <span className="checkout-spinner"></span>
                                        Opening Secure Payment...
                                    </>
                                ) : (
                                    <>
                                        <span>
                                            💳
                                        </span>

                                        Pay & Place Order

                                        <span className="checkout-pay-arrow">
                                            →
                                        </span>
                                    </>
                                )}

                            </button>


                            {/* ADDRESS WARNING */}

                            {addresses.length === 0 && (

                                <p className="checkout-warning">
                                    📍 Please add a delivery address first.
                                </p>

                            )}

                            {addresses.length > 0 &&
                                !selectedAddressId && (

                                    <p className="checkout-warning">
                                        📍 Please select a delivery address.
                                    </p>

                                )}


                            {/* SECURE TEXT */}

                            <div className="checkout-secure-payment">

                                <span>
                                    🔒
                                </span>

                                <div>
                                    <strong>
                                        Secure Checkout
                                    </strong>

                                    <p>
                                        Protected by Razorpay
                                    </p>
                                </div>

                            </div>

                        </div>


                        {/* TRUST FEATURES */}

                        <div className="checkout-trust-card">

                            <div>
                                <span>🔒</span>

                                <p>
                                    <strong>
                                        Secure Payments
                                    </strong>

                                    <small>
                                        Protected checkout
                                    </small>
                                </p>
                            </div>

                            <div>
                                <span>🚚</span>

                                <p>
                                    <strong>
                                        Reliable Delivery
                                    </strong>

                                    <small>
                                        Track your order
                                    </small>
                                </p>
                            </div>

                            <div>
                                <span>🛡️</span>

                                <p>
                                    <strong>
                                        Trusted Marketplace
                                    </strong>

                                    <small>
                                        Shop with confidence
                                    </small>
                                </p>
                            </div>

                        </div>

                    </aside>

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

export default Checkout;