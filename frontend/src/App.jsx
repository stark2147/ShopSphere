import React from "react";
import "./App.css";
import api from "./api";
import { Link, Routes, Route } from "react-router-dom";

import Login from "./Login";
import Register from "./Register";
import SellerRegister from "./SellerRegister";
import Cart from "./Cart";
import Checkout from "./Checkout";
import OrderSuccess from "./OrderSuccess";
import Orders from "./Orders";
import Products from "./Products";
import ProductDetails from "./ProductDetails";
import Wishlist from "./Wishlist";
import OrderDetails from "./OrderDetails";
import Profile from "./Profile";
import Addresses from "./Addresses";

import SellerDashboard from "./SellerDashboard";
import SellerProducts from "./SellerProducts";
import SellerHome from "./SellerHome";
import SellerProfile from "./SellerProfile";
import SellerOrders from "./SellerOrders";
import SellerReviews from "./SellerReviews";

import AdminDashboard from "./AdminDashboard";
import AdminRoute from "./AdminRoute";
import AdminProducts from "./AdminProducts";
import AdminProductDetails from "./AdminProductDetails";
import AdminOrders from "./AdminOrders";
import AdminUserDetails from "./AdminUserDetails";
import AdminUsers from "./AdminUsers";
import AdminSellerDetails from "./AdminSellerDetails";
import AdminSellers from "./AdminSellers";
import AdminOrderDetails from "./AdminOrderDetails";
import AdminReviews from "./AdminReviews";

import Notifications from "./Notifications";
import StorePage from "./StorePage";
import AiShoppingAssistant from "./AiShoppingAssistant";


function Home() {

    const [products, setProducts] = React.useState([]);
    const [searchKeyword, setSearchKeyword] = React.useState("");

    // ============================================================
    // NOTIFICATION UNREAD COUNT
    // ============================================================

    const [unreadCount, setUnreadCount] = React.useState(0);


    // ============================================================
    // LOAD PRODUCTS
    // ============================================================

    React.useEffect(() => {

        api
            .get("/api/products")
            .then((response) => {

                setProducts(
                    response.data.content || response.data
                );

            })
            .catch((error) => {

                console.error(
                    "Error fetching products:",
                    error
                );

            });

    }, []);


    // ============================================================
    // LOAD + AUTO REFRESH NOTIFICATION UNREAD COUNT
    // ============================================================

    React.useEffect(() => {

        const loadUnreadCount = async () => {

            try {

                const response =
                    await api.get(
                        "/api/notifications/unread-count"
                    );

                setUnreadCount(response.data);

            } catch (error) {

                setUnreadCount(0);

            }

        };

        loadUnreadCount();

        const interval = setInterval(() => {
            loadUnreadCount();
        }, 30000);

        return () => {
            clearInterval(interval);
        };

    }, []);


    // ============================================================
    // PRODUCT SEARCH
    // ============================================================

    const handleSearch = async () => {

        try {

            if (searchKeyword.trim() === "") {

                const response =
                    await api.get("/api/products");

                setProducts(
                    response.data.content ||
                    response.data
                );

                return;
            }

            const response =
                await api.get(
                    `/api/products/search?keyword=${encodeURIComponent(
                        searchKeyword
                    )}`
                );

            setProducts(response.data);

        } catch (error) {

            console.error(
                "Error searching products:",
                error
            );

        }

    };


    // ============================================================
    // ADD TO CART
    // ============================================================

    const handleAddToCart = async (product) => {

        try {

            await api.post(
                "/api/cart/items",
                {
                    productId: product.id,
                    quantity: 1,
                }
            );

            alert(
                `${product.name} added to cart!`
            );

        } catch (error) {

            console.error(
                "Error adding product to cart:",
                error
            );

            if (error.response) {

                alert(
                    error.response.data?.message ||
                    "Could not add product to cart."
                );

            } else {

                alert(
                    "Could not connect to the server."
                );

            }

        }

    };


    return (

        <div className="app">

            {/* =====================================================
                NAVBAR
            ===================================================== */}

            <nav className="navbar">

                <div className="logo">
                    Shop<span>Sphere</span>
                </div>


                <div className="search-box">

                    <input
                        type="text"
                        placeholder="Search for products..."
                        value={searchKeyword}
                        onChange={(event) =>
                            setSearchKeyword(
                                event.target.value
                            )
                        }
                        onKeyDown={(event) => {

                            if (event.key === "Enter") {
                                handleSearch();
                            }

                        }}
                    />

                    <button onClick={handleSearch}>
                        Search
                    </button>

                </div>


                <div className="nav-actions">

                    <Link to="/products">
                        Products
                    </Link>


                    <Link to="/wishlist">
                        Wishlist
                    </Link>


                    <Link to="/orders">
                        My Orders
                    </Link>


                    <Link to="/cart">
                        Cart
                    </Link>


                    {/* =================================================
                        NOTIFICATION BELL
                    ================================================= */}

                    <Link
                        to="/notifications"
                        className="notification-bell"
                        title="Notifications"
                    >

                        🔔

                        {unreadCount > 0 && (

                            <span className="notification-badge">
                                {unreadCount}
                            </span>

                        )}

                    </Link>


                    <Link
                        to="/profile"
                        className="login-link"
                    >
                        My Account 👤
                    </Link>

                </div>

            </nav>


            {/* =====================================================
                HERO
            ===================================================== */}

            <section className="home-hero">

                <div className="home-hero-content">

                    <div className="hero-badge">
                        ✨ SMARTER SHOPPING STARTS HERE
                    </div>


                    <h1>
                        Everything you need,
                        <br />
                        <span>
                            all in one place.
                        </span>
                    </h1>


                    <p>
                        Discover amazing products from
                        trusted sellers and enjoy a
                        smarter, faster shopping experience.
                    </p>


                    <div className="hero-actions">

                        <Link
                            to="/products"
                            className="hero-primary-button"
                        >
                            Explore Products →
                        </Link>


                        <Link
                            to="/wishlist"
                            className="hero-secondary-button"
                        >
                            View Wishlist
                        </Link>

                    </div>


                    <div className="hero-trust-row">

                        <div className="hero-trust-item">

                            <span>🛡️</span>

                            <div>

                                <strong>
                                    Trusted Sellers
                                </strong>

                                <small>
                                    Quality products
                                </small>

                            </div>

                        </div>


                        <div className="hero-trust-item">

                            <span>💳</span>

                            <div>

                                <strong>
                                    Secure Payments
                                </strong>

                                <small>
                                    Safe checkout
                                </small>

                            </div>

                        </div>


                        <div className="hero-trust-item">

                            <span>🚚</span>

                            <div>

                                <strong>
                                    Easy Delivery
                                </strong>

                                <small>
                                    Track your orders
                                </small>

                            </div>

                        </div>

                    </div>

                </div>


                <div className="home-hero-visual">

                    <div className="hero-floating-card hero-card-top">

                        <span>⚡</span>

                        <div>

                            <strong>
                                Smart Shopping
                            </strong>

                            <small>
                                Find products faster
                            </small>

                        </div>

                    </div>


                    <div className="hero-shopping-card">

                        <div className="shopping-card-icon">
                            🛍️
                        </div>

                        <span className="shopping-card-label">
                            SHOPSPHERE
                        </span>


                        <h2>
                            Your marketplace,
                            <br />
                            made smarter.
                        </h2>


                        <div className="shopping-card-stats">

                            <div>

                                <strong>
                                    100+
                                </strong>

                                <span>
                                    Products
                                </span>

                            </div>


                            <div>

                                <strong>
                                    24/7
                                </strong>

                                <span>
                                    Shopping
                                </span>

                            </div>

                        </div>

                    </div>


                    <div className="hero-floating-card hero-card-bottom">

                        <span>⭐</span>

                        <div>

                            <strong>
                                Great Experience
                            </strong>

                            <small>
                                Built for modern shoppers
                            </small>

                        </div>

                    </div>

                </div>

            </section>


            {/* =====================================================
                CATEGORY SECTION
            ===================================================== */}

            <section className="section home-category-section">

                <div className="section-header">

                    <div>

                        <span className="section-eyebrow">
                            EXPLORE
                        </span>

                        <h2>
                            Shop by Category
                        </h2>

                        <p className="section-subtitle">
                            Find what you're looking for faster.
                        </p>

                    </div>


                    <Link
                        to="/products"
                        className="view-all"
                    >
                        View All →
                    </Link>

                </div>


                <div className="categories">

                    <div className="category-card">

                        <div className="category-icon">
                            💻
                        </div>

                        <h3>
                            Electronics
                        </h3>

                        <p>
                            Latest gadgets
                        </p>

                        <span className="category-arrow">
                            →
                        </span>

                    </div>


                    <div className="category-card">

                        <div className="category-icon">
                            📱
                        </div>

                        <h3>
                            Mobiles
                        </h3>

                        <p>
                            Smartphones and more
                        </p>

                        <span className="category-arrow">
                            →
                        </span>

                    </div>


                    <div className="category-card">

                        <div className="category-icon">
                            🎧
                        </div>

                        <h3>
                            Accessories
                        </h3>

                        <p>
                            Tech accessories
                        </p>

                        <span className="category-arrow">
                            →
                        </span>

                    </div>


                    <div className="category-card">

                        <div className="category-icon">
                            ⌚
                        </div>

                        <h3>
                            Wearables
                        </h3>

                        <p>
                            Smart watches
                        </p>

                        <span className="category-arrow">
                            →
                        </span>

                    </div>

                </div>

            </section>


            {/* =====================================================
                FEATURED PRODUCTS
            ===================================================== */}

            <section className="section featured-section">

                <div className="section-header">

                    <div>

                        <span className="section-eyebrow">
                            POPULAR NOW
                        </span>

                        <h2>
                            Featured Products
                        </h2>

                        <p className="section-subtitle">
                            Handpicked products from our marketplace.
                        </p>

                    </div>


                    <Link
                        to="/products"
                        className="view-all"
                    >
                        View All →
                    </Link>

                </div>


                <div className="products">

                    {products
                        .slice(0, 8)
                        .map((product) => (

                            <div
                                className="product-card"
                                key={product.id}
                            >

                                <div className="product-image">

                                    {product.imageUrl ? (

                                        <img
                                            src={product.imageUrl}
                                            alt={product.name}
                                            className="home-product-real-image"
                                        />

                                    ) : (

                                        <span className="product-placeholder-icon">
                                            🛍️
                                        </span>

                                    )}

                                    <span className="product-badge">
                                        Featured
                                    </span>

                                </div>


                                <div className="product-info">

                                    <p className="product-category">
                                        {
                                            product.categoryName ||
                                            "Product"
                                        }
                                    </p>


                                    <h3>
                                        {product.name}
                                    </h3>


                                    <div className="rating">

                                        ⭐⭐⭐⭐⭐

                                        <span>
                                            5.0
                                        </span>

                                    </div>


                                    {product.stockQuantity > 0 ? (

                                        <p className="stock available">
                                            ● In Stock
                                        </p>

                                    ) : (

                                        <p className="stock unavailable">
                                            ● Out of Stock
                                        </p>

                                    )}


                                    <div className="product-bottom">

                                        <span className="price">
                                            ₹
                                            {Number(
                                                product.price
                                            ).toLocaleString(
                                                "en-IN"
                                            )}
                                        </span>


                                        <button
                                            className="add-cart"
                                            disabled={
                                                product.stockQuantity <= 0
                                            }
                                            onClick={() =>
                                                handleAddToCart(
                                                    product
                                                )
                                            }
                                        >

                                            {product.stockQuantity > 0
                                                ? "Add to Cart"
                                                : "Out of Stock"}

                                        </button>

                                    </div>

                                </div>

                            </div>

                        ))}

                </div>


                {products.length === 0 && (

                    <div className="home-products-empty">

                        <div>
                            🛍️
                        </div>

                        <h3>
                            No products available
                        </h3>

                        <p>
                            Products will appear here once they are added.
                        </p>

                    </div>

                )}

            </section>


            {/* =====================================================
                WHY SHOPSPHERE
            ===================================================== */}

            <section className="home-benefits">

                <div className="home-benefits-container">

                    <div className="home-benefits-heading">

                        <span className="section-eyebrow">
                            WHY SHOPSPHERE
                        </span>

                        <h2>
                            Shopping made simple.
                        </h2>

                        <p>
                            Everything you need for a smooth
                            and reliable online shopping experience.
                        </p>

                    </div>


                    <div className="benefits-grid">

                        <div className="benefit-card">

                            <div className="benefit-icon">
                                🛡️
                            </div>

                            <h3>
                                Trusted Marketplace
                            </h3>

                            <p>
                                Shop from trusted sellers and
                                discover quality products.
                            </p>

                        </div>


                        <div className="benefit-card">

                            <div className="benefit-icon">
                                🔒
                            </div>

                            <h3>
                                Secure Checkout
                            </h3>

                            <p>
                                Your checkout experience is
                                designed with security in mind.
                            </p>

                        </div>


                        <div className="benefit-card">

                            <div className="benefit-icon">
                                📦
                            </div>

                            <h3>
                                Easy Order Tracking
                            </h3>

                            <p>
                                Keep track of your purchases
                                from order to delivery.
                            </p>

                        </div>


                        <div className="benefit-card">

                            <div className="benefit-icon">
                                ✨
                            </div>

                            <h3>
                                Smarter Shopping
                            </h3>

                            <p>
                                Built with intelligent features
                                for a better shopping experience.
                            </p>

                        </div>

                    </div>

                </div>

            </section>


            {/* =====================================================
                FINAL CTA
            ===================================================== */}

            <section className="home-final-cta">

                <div>

                    <span>
                        READY TO SHOP?
                    </span>

                    <h2>
                        Find something you'll love.
                    </h2>

                    <p>
                        Explore our growing marketplace and
                        discover your next favorite product.
                    </p>

                    <Link
                        to="/products"
                        className="hero-primary-button"
                    >
                        Start Shopping →
                    </Link>

                </div>

            </section>


            {/* =====================================================
                FOOTER
            ===================================================== */}

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


/* =========================================================
   MAIN APP
========================================================= */

function App() {

    return (

        <>

            <Routes>

                {/* ================= CUSTOMER ================= */}

                <Route
                    path="/"
                    element={<Home />}
                />

                <Route
                    path="/login"
                    element={<Login />}
                />

                <Route
                    path="/profile"
                    element={<Profile />}
                />

                <Route
                    path="/cart"
                    element={<Cart />}
                />

                <Route
                    path="/checkout"
                    element={<Checkout />}
                />

                <Route
                    path="/order-success"
                    element={<OrderSuccess />}
                />

                <Route
                    path="/orders"
                    element={<Orders />}
                />

                <Route
                    path="/orders/:id"
                    element={<OrderDetails />}
                />

                <Route
                    path="/products"
                    element={<Products />}
                />

                <Route
                    path="/products/:id"
                    element={<ProductDetails />}
                />

                <Route
                    path="/wishlist"
                    element={<Wishlist />}
                />

                <Route
                    path="/addresses"
                    element={<Addresses />}
                />

                <Route
                    path="/notifications"
                    element={<Notifications />}
                />


                {/* ================= SELLER ================= */}

                <Route
                    path="/seller"
                    element={<SellerHome />}
                />

                <Route
                    path="/seller/dashboard"
                    element={<SellerDashboard />}
                />

                <Route
                    path="/seller/products"
                    element={<SellerProducts />}
                />

                <Route
                    path="/seller/orders"
                    element={<SellerOrders />}
                />

                <Route
                    path="/seller/reviews"
                    element={<SellerReviews />}
                />

                <Route
                    path="/seller/profile"
                    element={<SellerProfile />}
                />


                {/* ================= ADMIN ================= */}

                <Route
                    path="/admin"
                    element={
                        <AdminRoute>
                            <AdminDashboard />
                        </AdminRoute>
                    }
                />

                <Route
                    path="/admin/products"
                    element={
                        <AdminRoute>
                            <AdminProducts />
                        </AdminRoute>
                    }
                />

                <Route
                    path="/admin/products/:id"
                    element={
                        <AdminRoute>
                            <AdminProductDetails />
                        </AdminRoute>
                    }
                />

                <Route
                    path="/admin/orders"
                    element={
                        <AdminRoute>
                            <AdminOrders />
                        </AdminRoute>
                    }
                />

                <Route
                    path="/admin/orders/:id"
                    element={
                        <AdminRoute>
                            <AdminOrderDetails />
                        </AdminRoute>
                    }
                />

                <Route
                    path="/admin/users"
                    element={
                        <AdminRoute>
                            <AdminUsers />
                        </AdminRoute>
                    }
                />

                <Route
                    path="/admin/users/:id"
                    element={
                        <AdminRoute>
                            <AdminUserDetails />
                        </AdminRoute>
                    }
                />

                <Route
                    path="/admin/sellers"
                    element={
                        <AdminRoute>
                            <AdminSellers />
                        </AdminRoute>
                    }
                />

                <Route
                    path="/admin/sellers/:id"
                    element={
                        <AdminRoute>
                            <AdminSellerDetails />
                        </AdminRoute>
                    }
                />

                <Route
                    path="/admin/reviews"
                    element={
                        <AdminRoute>
                            <AdminReviews />
                        </AdminRoute>
                    }
                />

                <Route
                    path="/store/:sellerId"
                    element={<StorePage />}
                />

                <Route
                    path="/register"
                    element={<Register />}
                />

                <Route
                    path="/seller/register"
                    element={<SellerRegister />}
                />

            </Routes>


            {/* =====================================================
                FLOATING AI ASSISTANT
            ===================================================== */}

            <AiShoppingAssistant />

        </>

    );

}


export default App;