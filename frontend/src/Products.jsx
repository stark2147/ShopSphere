import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "./api";
import "./App.css";

function Products() {

    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);

    const [searchKeyword, setSearchKeyword] = useState("");
    const [sortOption, setSortOption] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("");

    // Price filters
    const [minPrice, setMinPrice] = useState("");
    const [maxPrice, setMaxPrice] = useState("");
// Stock filter
    const [stockFilter, setStockFilter] = useState("");
    const [loading, setLoading] = useState(true);

    // =========================
    // LOAD PRODUCTS
    // =========================
    const loadProducts = async () => {
        try {

            const response = await api.get("/api/products");

            console.log("All products:", response.data);

            setProducts(
                response.data.content || response.data
            );

        } catch (error) {

            console.error(
                "Error loading products:",
                error
            );

        } finally {

            setLoading(false);
        }
    };

    // =========================
    // LOAD CATEGORIES
    // =========================
    const loadCategories = async () => {
        try {

            const response = await api.get("/api/categories");

            console.log("Categories:", response.data);

            setCategories(response.data);

        } catch (error) {

            console.error(
                "Error loading categories:",
                error
            );
        }
    };

    // =========================
    // INITIAL LOAD
    // =========================
    useEffect(() => {

        loadProducts();
        loadCategories();

    }, []);

    // =========================
    // SEARCH PRODUCTS
    // =========================
    const searchProducts = async () => {

        if (searchKeyword.trim() === "") {

            loadProducts();
            return;
        }

        try {

            const response = await api.get(
                `/api/products/search?keyword=${encodeURIComponent(
                    searchKeyword
                )}`
            );

            console.log(
                "Search results:",
                response.data
            );

            setProducts(response.data);

        } catch (error) {

            console.error(
                "Error searching products:",
                error
            );
        }
    };

    // =========================
    // CLEAR ALL FILTERS
    // =========================
    const clearSearch = () => {

        setSearchKeyword("");
        setSortOption("");
        setSelectedCategory("");
        setMinPrice("");
        setMaxPrice("");
        setStockFilter("");
        loadProducts();
    };

    // =========================
    // ADD TO CART
    // =========================
    const addToCart = async (product) => {

        try {

            await api.post(
                "/api/cart/items",
                {
                    productId: product.id,
                    quantity: 1
                }
            );

            alert(
                `${product.name} added to cart!`
            );

        } catch (error) {

            console.error(
                "Error adding product:",
                error
            );

            alert(
                error.response?.data?.message ||
                "Could not add product to cart."
            );
        }
    };

    // =========================
    // ADD TO WISHLIST
    // =========================
    const addToWishlist = async (product) => {

        try {

            await api.post(
                `/api/wishlist/${product.id}`
            );

            alert(
                `${product.name} added to wishlist ❤️`
            );

        } catch (error) {

            console.error(
                "Error adding product to wishlist:",
                error
            );

            alert(
                error.response?.data?.message ||
                "Could not add product to wishlist."
            );
        }
    };

    // =========================
    // LOADING SCREEN
    // =========================
    if (loading) {

        return (
            <div className="products-page-loading">

                <div className="loading-icon">
                    🛍️
                </div>

                <h2>
                    Loading products...
                </h2>

                <p>
                    Please wait while we load the marketplace.
                </p>

            </div>
        );
    }

    // =========================
    // DISPLAYED PRODUCTS
    // =========================

    let displayedProducts = [...products];

    // =========================
    // CATEGORY FILTER
    // =========================

    if (selectedCategory) {

        displayedProducts =
            displayedProducts.filter(
                (product) =>
                    String(product.categoryId) ===
                    String(selectedCategory)
            );
    }

    // =========================
    // MIN PRICE FILTER
    // =========================

    if (minPrice !== "") {

        displayedProducts =
            displayedProducts.filter(
                (product) =>
                    Number(product.price) >=
                    Number(minPrice)
            );
    }

    // =========================
    // MAX PRICE FILTER
    // =========================

    if (maxPrice !== "") {

        displayedProducts =
            displayedProducts.filter(
                (product) =>
                    Number(product.price) <=
                    Number(maxPrice)
            );
    }
    // =========================
// STOCK FILTER
// =========================

    if (stockFilter === "in-stock") {

        displayedProducts =
            displayedProducts.filter(
                (product) =>
                    Number(product.stockQuantity) > 0
            );
    }

    if (stockFilter === "out-of-stock") {

        displayedProducts =
            displayedProducts.filter(
                (product) =>
                    Number(product.stockQuantity) <= 0
            );
    }

    // =========================
    // SORTING
    // =========================

    if (sortOption === "price-low") {

        displayedProducts.sort(
            (a, b) =>
                Number(a.price) -
                Number(b.price)
        );
    }

    if (sortOption === "price-high") {

        displayedProducts.sort(
            (a, b) =>
                Number(b.price) -
                Number(a.price)
        );
    }

    if (sortOption === "name-az") {

        displayedProducts.sort(
            (a, b) =>
                a.name.localeCompare(b.name)
        );
    }

    if (sortOption === "name-za") {

        displayedProducts.sort(
            (a, b) =>
                b.name.localeCompare(a.name)
        );
    }

    // =========================
    // MAIN UI
    // =========================

    return (

        <div className="products-page">

            {/* =========================
                NAVBAR
            ========================= */}

            <nav className="navbar">

                <div className="navbar-brand">

                    <Link to="/">

                        <span className="brand-icon">
                            🛍️
                        </span>

                        ShopSphere

                    </Link>

                </div>

                <div className="navbar-links">

                    <Link to="/">
                        Home
                    </Link>

                    <Link
                        to="/products"
                        className="active"
                    >
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

                    <Link to="/profile">
                        My Account
                    </Link>

                </div>

            </nav>


            {/* =========================
                HERO SECTION
            ========================= */}

            <section className="products-hero">

                <div className="products-hero-content">

                    <span className="products-hero-badge">
                        ShopSphere Marketplace
                    </span>

                    <h1>
                        Discover Products
                    </h1>

                    <p>
                        Explore products from trusted
                        sellers across the ShopSphere
                        marketplace.
                    </p>

                </div>

                <div className="products-count-card">

                    <span>
                        Products
                    </span>

                    <strong>
                        {displayedProducts.length}
                    </strong>

                </div>

            </section>


            {/* =========================
                SEARCH & FILTER TOOLBAR
            ========================= */}

            {/* =========================
    SEARCH & FILTER TOOLBAR
========================= */}

            <section className="products-toolbar">

                {/* SEARCH */}

                <div className="products-search-group">

                    <div className="products-search">

            <span className="products-search-icon">
                🔍
            </span>

                        <input
                            type="text"
                            placeholder="Search products..."
                            value={searchKeyword}
                            onChange={(event) =>
                                setSearchKeyword(event.target.value)
                            }
                            onKeyDown={(event) => {
                                if (event.key === "Enter") {
                                    searchProducts();
                                }
                            }}
                        />

                        {searchKeyword && (
                            <button
                                className="search-clear-btn"
                                onClick={() => setSearchKeyword("")}
                                type="button"
                                aria-label="Clear search"
                            >
                                ✕
                            </button>
                        )}

                        <button
                            className="primary-btn products-search-btn"
                            onClick={searchProducts}
                            type="button"
                        >
                            Search
                        </button>

                    </div>

                </div>


                {/* FILTERS */}

                <div className="products-filter-group">

                    {/* SORT */}

                    <div className="products-filter">

                        <label htmlFor="sort">
                            Sort by
                        </label>

                        <select
                            id="sort"
                            value={sortOption}
                            onChange={(event) =>
                                setSortOption(event.target.value)
                            }
                        >

                            <option value="">
                                Recommended
                            </option>

                            <option value="price-low">
                                Price: Low to High
                            </option>

                            <option value="price-high">
                                Price: High to Low
                            </option>

                            <option value="name-az">
                                Name: A-Z
                            </option>

                            <option value="name-za">
                                Name: Z-A
                            </option>

                        </select>

                    </div>


                    {/* CATEGORY */}

                    <div className="products-filter">

                        <label htmlFor="category">
                            Category
                        </label>

                        <select
                            id="category"
                            value={selectedCategory}
                            onChange={(event) =>
                                setSelectedCategory(event.target.value)
                            }
                        >

                            <option value="">
                                All Categories
                            </option>

                            {categories.map((category) => (
                                <option
                                    key={category.id}
                                    value={category.id}
                                >
                                    {category.name}
                                </option>
                            ))}

                        </select>

                    </div>


                    {/* PRICE */}

                    <div className="products-price-filter">

                        <label>
                            Price
                        </label>

                        <div className="price-inputs">

                            <div className="price-input-wrapper">

                                <span>₹</span>

                                <input
                                    type="number"
                                    min="0"
                                    placeholder="Min"
                                    value={minPrice}
                                    onChange={(event) =>
                                        setMinPrice(event.target.value)
                                    }
                                />

                            </div>

                            <span className="price-separator">
                    —
                </span>

                            <div className="price-input-wrapper">

                                <span>₹</span>

                                <input
                                    type="number"
                                    min="0"
                                    placeholder="Max"
                                    value={maxPrice}
                                    onChange={(event) =>
                                        setMaxPrice(event.target.value)
                                    }
                                />

                            </div>

                        </div>

                    </div>


                    {/* STOCK */}

                    <div className="products-filter">

                        <label htmlFor="stock">
                            Stock
                        </label>

                        <select
                            id="stock"
                            value={stockFilter}
                            onChange={(event) =>
                                setStockFilter(event.target.value)
                            }
                        >

                            <option value="">
                                All Products
                            </option>

                            <option value="in-stock">
                                In Stock
                            </option>

                            <option value="out-of-stock">
                                Out of Stock
                            </option>

                        </select>

                    </div>


                    {/* CLEAR */}

                    {(searchKeyword ||
                        sortOption ||
                        selectedCategory ||
                        minPrice ||
                        maxPrice ||
                        stockFilter) && (

                        <button
                            className="secondary-btn products-clear-btn"
                            onClick={clearSearch}
                            type="button"
                        >
                            ✕ Clear
                        </button>

                    )}

                </div>

            </section>


            {/* =========================
                ACTIVE FILTER INFO
            ========================= */}

            {(minPrice || maxPrice) && (

                <div className="price-filter-info">

                    <span>
                        💰 Price range:
                    </span>

                    <strong>

                        {minPrice
                            ? ` ₹${Number(
                                minPrice
                            ).toLocaleString("en-IN")}`
                            : " ₹0"}

                        {" — "}

                        {maxPrice
                            ? `₹${Number(
                                maxPrice
                            ).toLocaleString("en-IN")}`
                            : "No limit"}

                    </strong>

                </div>

            )}


            {/* =========================
                SEARCH RESULT INFO
            ========================= */}

            {searchKeyword && (

                <div className="search-result-info">

                    <p>

                        Showing results for:

                        <strong>
                            {" "}
                            "{searchKeyword}"
                        </strong>

                    </p>

                </div>

            )}


            {/* =========================
                PRODUCTS SECTION
            ========================= */}

            <section className="products-section">

                <div className="products-results-header">

                    <div>

                        <h2>
                            Marketplace Products
                        </h2>

                        <p>

                            {displayedProducts.length}
                            {" "}
                            product
                            {displayedProducts.length !== 1
                                ? "s"
                                : ""}
                            {" "}
                            available

                        </p>

                    </div>

                </div>


                {/* =========================
                    EMPTY STATE
                ========================= */}

                {displayedProducts.length === 0 ? (

                    <div className="empty-state">

                        <div className="empty-state-icon">
                            🛍️
                        </div>

                        <h2>
                            No Products Found
                        </h2>

                        <p>
                            Try changing your search, category,
                            price range, or stock filter.
                        </p>

                        <button
                            className="primary-btn"
                            onClick={clearSearch}
                        >
                            View All Products
                        </button>

                    </div>

                ) : (

                    /* =========================
                       PRODUCT GRID
                    ========================= */

                    <div className="market-products-grid">

                        {displayedProducts.map(
                            (product) => (

                                <div
                                    className="market-product-card"
                                    key={product.id}
                                >

                                    {/* PRODUCT IMAGE */}

                                    <div className="market-product-image">

                                        {product.imageUrl ? (

                                            <img
                                                src={
                                                    product.imageUrl
                                                }
                                                alt={
                                                    product.name
                                                }
                                                className="market-product-real-image"
                                            />

                                        ) : (

                                            <span className="market-product-icon">
                                                🛍️
                                            </span>

                                        )}

                                        <span className="market-product-badge">
                                            ShopSphere
                                        </span>

                                    </div>


                                    {/* PRODUCT CONTENT */}

                                    <div className="market-product-content">

                                        <span className="market-product-category">

                                            {product.categoryName ||
                                                "General"}

                                        </span>


                                        <h3>
                                            {product.name}
                                        </h3>


                                        <p className="market-product-description">

                                            {product.description}

                                        </p>


                                        {/* RATING */}

                                        <div className="market-product-rating">

                                            <span>
                                                ⭐⭐⭐⭐⭐
                                            </span>

                                            <span>
                                                5.0
                                            </span>

                                        </div>


                                        {/* STOCK */}

                                        <div className="market-product-stock">

                                            {product.stockQuantity >
                                            0 ? (

                                                <span className="in-stock">
                                                    ✓ In Stock
                                                </span>

                                            ) : (

                                                <span className="out-of-stock">
                                                    Out of Stock
                                                </span>

                                            )}

                                        </div>


                                        {/* PRICE */}

                                        <div className="market-product-price">

                                            ₹
                                            {Number(
                                                product.price
                                            ).toLocaleString(
                                                "en-IN"
                                            )}

                                        </div>


                                        {/* ACTIONS */}

                                        <div className="market-product-actions">

                                            <button
                                                className="wishlist-btn"
                                                onClick={() =>
                                                    addToWishlist(
                                                        product
                                                    )
                                                }
                                                disabled={
                                                    product.stockQuantity <=
                                                    0
                                                }
                                            >
                                                ❤️
                                            </button>


                                            <button
                                                className="add-cart-btn"
                                                onClick={() =>
                                                    addToCart(
                                                        product
                                                    )
                                                }
                                                disabled={
                                                    product.stockQuantity <=
                                                    0
                                                }
                                            >
                                                Add to Cart
                                            </button>

                                        </div>


                                        {/* DETAILS */}

                                        <Link
                                            to={`/products/${product.id}`}
                                            className="view-product-btn"
                                        >
                                            View Details →
                                        </Link>

                                    </div>

                                </div>

                            )
                        )}

                    </div>

                )}

            </section>


            {/* =========================
                FOOTER
            ========================= */}

            <footer className="products-footer">

                <div>

                    <h3>
                        ShopSphere
                    </h3>

                    <p>
                        Your trusted multi-vendor
                        shopping marketplace.
                    </p>

                </div>

                <div>

                    <h4>
                        Quick Links
                    </h4>

                    <Link to="/">
                        Home
                    </Link>

                    <Link to="/products">
                        Products
                    </Link>

                    <Link to="/wishlist">
                        Wishlist
                    </Link>

                    <Link to="/orders">
                        Orders
                    </Link>

                </div>

            </footer>

        </div>
    );
}

export default Products;