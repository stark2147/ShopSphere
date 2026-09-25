
import React, {
    useEffect,
    useMemo,
    useState
} from "react";

import { Link } from "react-router-dom";

import api from "./api";

import "./App.css";


const SellerProducts = () => {

    // =====================================================
    // STATE
    // =====================================================

    const [imagePreviewError, setImagePreviewError] =
        useState(false);

    const [imageFile, setImageFile] =
        useState(null);

    const [imageUploadPreview, setImageUploadPreview] =
        useState("");

    const [seller, setSeller] =
        useState(null);

    const [products, setProducts] =
        useState([]);

    const [categories, setCategories] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [saving, setSaving] =
        useState(false);

    const [error, setError] =
        useState("");

    const [success, setSuccess] =
        useState("");

    const [showForm, setShowForm] =
        useState(false);

    const [editingProduct, setEditingProduct] =
        useState(null);
    const [previewProduct, setPreviewProduct] = useState(null);

    // =====================================================
    // INVENTORY SEARCH / FILTER / SORT
    // =====================================================

    const [searchTerm, setSearchTerm] =
        useState("");

    const [stockFilter, setStockFilter] =
        useState("all");

    const [sortOption, setSortOption] =
        useState("newest");


    // =====================================================
    // QUICK STOCK MANAGEMENT
    // =====================================================

    const [stockValues, setStockValues] =
        useState({});

    const [updatingStockId, setUpdatingStockId] =
        useState(null);


    // =====================================================
    // PRODUCT FORM
    // =====================================================

    const [formData, setFormData] = useState({
        name: "",
        description: "",
        price: "",
        stockQuantity: "",
        categoryId: "",
        imageUrl: ""
    });


    // =====================================================
    // LOAD SELLER + PRODUCTS + CATEGORIES
    // =====================================================

    const loadData = async () => {

        try {

            setLoading(true);

            setError("");

            const [
                sellerResponse,
                productsResponse,
                categoriesResponse
            ] = await Promise.all([

                api.get("/api/sellers/me"),

                api.get("/api/products/my-products"),

                api.get("/api/categories")

            ]);


            // -------------------------------------------------
            // SELLER
            // -------------------------------------------------

            setSeller(
                sellerResponse.data
            );


            // -------------------------------------------------
            // PRODUCTS
            // -------------------------------------------------

            const productsData =
                Array.isArray(productsResponse.data)
                    ? productsResponse.data
                    : productsResponse.data?.content || [];


            setProducts(
                productsData
            );


            // -------------------------------------------------
            // QUICK STOCK VALUES
            // -------------------------------------------------

            const initialStockValues = {};

            productsData.forEach((product) => {

                initialStockValues[product.id] =
                    Number(
                        product.stockQuantity || 0
                    );

            });

            setStockValues(
                initialStockValues
            );


            // -------------------------------------------------
            // CATEGORIES
            // -------------------------------------------------

            const categoriesData =
                Array.isArray(categoriesResponse.data)
                    ? categoriesResponse.data
                    : categoriesResponse.data?.content || [];


            setCategories(
                categoriesData
            );


        } catch (err) {

            console.error(
                "Error loading seller products:",
                err
            );

            setError(
                err.response?.data?.message ||
                "Unable to load seller products."
            );

        } finally {

            setLoading(false);

        }

    };


    // =====================================================
    // INITIAL LOAD
    // =====================================================

    useEffect(() => {

        loadData();

    }, []);
    useEffect(() => {
        const handleEscape = (event) => {
            if (event.key === "Escape") {
                setPreviewProduct(null);
            }
        };

        if (previewProduct) {
            document.addEventListener("keydown", handleEscape);
        }

        return () => {
            document.removeEventListener("keydown", handleEscape);
        };
    }, [previewProduct]);

    // =====================================================
    // FORM INPUT CHANGE
    // =====================================================

    const handleInputChange = (event) => {

        const {
            name,
            value
        } = event.target;

        setFormData(
            (previous) => ({
                ...previous,
                [name]: value
            })
        );


        // Reset image error whenever image URL changes
        if (name === "imageUrl") {

            setImagePreviewError(false);

            setImageFile(null);
            setImageUploadPreview(value);

        }

    };


    // =====================================================
    // PRODUCT IMAGE FILE UPLOAD
    // =====================================================

    const handleImageFileChange = (event) => {

        const file = event.target.files?.[0];

        if (!file) {
            return;
        }

        if (!file.type.startsWith("image/")) {
            setError("Please select a valid image file.");
            event.target.value = "";
            return;
        }

        const maxSize = 5 * 1024 * 1024;

        if (file.size > maxSize) {
            setError("Product image must be 5 MB or smaller.");
            event.target.value = "";
            return;
        }

        setError("");
        setImagePreviewError(false);
        setImageFile(file);

        const reader = new FileReader();

        reader.onload = () => {
            setImageUploadPreview(reader.result);
        };

        reader.readAsDataURL(file);
    };

    const clearSelectedImage = () => {
        setImageFile(null);
        setImageUploadPreview("");
        setImagePreviewError(false);

        setFormData((previous) => ({
            ...previous,
            imageUrl: ""
        }));
    };

    // =====================================================
    // RESET FORM
    // =====================================================

    const resetForm = () => {

        setFormData({
            name: "",
            description: "",
            price: "",
            stockQuantity: "",
            categoryId: "",
            imageUrl: ""
        });

        setEditingProduct(null);

        setImagePreviewError(false);

        setImageFile(null);
        setImageUploadPreview("");

        setShowForm(false);

    };


    // =====================================================
    // OPEN ADD PRODUCT FORM
    // =====================================================

    const handleAddProduct = () => {

        setError("");

        setSuccess("");

        setEditingProduct(null);

        setImagePreviewError(false);
        setImageFile(null);
        setImageUploadPreview("");

        setFormData({
            name: "",
            description: "",
            price: "",
            stockQuantity: "",
            categoryId: "",
            imageUrl: ""
        });

        setShowForm(true);

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    };


    // =====================================================
    // OPEN EDIT PRODUCT FORM
    // =====================================================
    const handlePreviewProduct = (product) => {
        setPreviewProduct(product);
    };
    const handleEditProduct = (product) => {

        setError("");

        setSuccess("");

        setEditingProduct(product);

        setImagePreviewError(false);
        setImageFile(null);
        setImageUploadPreview(product.imageUrl || "");

        setFormData({
            name: product.name || "",
            description: product.description || "",
            price: product.price || "",
            stockQuantity:
                product.stockQuantity ?? "",
            categoryId:
                product.categoryId ?? "",
            imageUrl:
                product.imageUrl || ""
        });

        setShowForm(true);

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    };


    // =====================================================
    // IMAGE URL VALIDATION
    // =====================================================

    const isValidImageUrl = (url) => {

        if (!url || !url.trim()) {

            return true;

        }


        try {

            const parsedUrl =
                new URL(
                    url.trim()
                );


            return (
                parsedUrl.protocol === "http:" ||
                parsedUrl.protocol === "https:"
            );

        } catch {

            return false;

        }

    };


    // =====================================================
    // SAVE PRODUCT
    // =====================================================

    const handleSaveProduct = async (event) => {

        event.preventDefault();

        setError("");

        setSuccess("");


        // -------------------------------------------------
        // IMAGE URL VALIDATION
        // -------------------------------------------------

        if (
            !isValidImageUrl(
                formData.imageUrl
            )
        ) {

            setError(
                "Please enter a valid image URL starting with http:// or https://."
            );

            return;

        }


        try {

            setSaving(true);

            let finalImageUrl = formData.imageUrl.trim();

            if (imageFile) {

                const imageFormData = new FormData();

                imageFormData.append("file", imageFile);

                const uploadResponse =
                    await api.post(
                        "/api/products/upload-image",
                        imageFormData,
                        {
                            headers: {
                                "Content-Type": "multipart/form-data"
                            }
                        }
                    );

                finalImageUrl =
                    uploadResponse.data?.imageUrl || "";
            }

            const payload = {

                name:
                    formData.name.trim(),

                description:
                    formData.description.trim(),

                price:
                    Number(formData.price),

                stockQuantity:
                    Number(formData.stockQuantity),

                categoryId:
                    Number(formData.categoryId),

                imageUrl:
                finalImageUrl

            };


            // -------------------------------------------------
            // BASIC FRONTEND VALIDATION
            // -------------------------------------------------

            if (!payload.name) {

                setError(
                    "Product name is required."
                );

                return;

            }


            if (!payload.description) {

                setError(
                    "Product description is required."
                );

                return;

            }


            if (
                !payload.price ||
                payload.price <= 0
            ) {

                setError(
                    "Product price must be greater than 0."
                );

                return;

            }


            if (
                Number.isNaN(
                    payload.stockQuantity
                ) ||
                payload.stockQuantity < 0
            ) {

                setError(
                    "Stock quantity cannot be negative."
                );

                return;

            }


            if (
                !payload.categoryId ||
                payload.categoryId <= 0
            ) {

                setError(
                    "Please select a category."
                );

                return;

            }


            // -------------------------------------------------
            // UPDATE
            // -------------------------------------------------

            if (editingProduct) {

                const response =
                    await api.put(
                        `/api/products/${editingProduct.id}`,
                        payload
                    );


                const updatedProduct =
                    response.data;


                setProducts(
                    (previous) =>
                        previous.map(
                            (product) =>
                                product.id ===
                                editingProduct.id
                                    ? updatedProduct
                                    : product
                        )
                );


                setStockValues(
                    (previous) => ({
                        ...previous,
                        [updatedProduct.id]:
                            Number(
                                updatedProduct.stockQuantity || 0
                            )
                    })
                );


                setSuccess(
                    "Product updated successfully."
                );

            }


                // -------------------------------------------------
                // CREATE
            // -------------------------------------------------

            else {

                const response =
                    await api.post(
                        "/api/products",
                        payload
                    );


                const newProduct =
                    response.data;


                setProducts(
                    (previous) => [
                        newProduct,
                        ...previous
                    ]
                );


                setStockValues(
                    (previous) => ({
                        ...previous,
                        [newProduct.id]:
                            Number(
                                newProduct.stockQuantity || 0
                            )
                    })
                );


                setSuccess(
                    "Product created successfully."
                );

            }


            resetForm();


        } catch (err) {

            console.error(
                "Error saving product:",
                err
            );

            setError(
                err.response?.data?.message ||
                "Unable to save product."
            );

        } finally {

            setSaving(false);

        }

    };


    // =====================================================
    // DELETE PRODUCT
    // =====================================================

    const handleDeleteProduct = async (product) => {

        const confirmed =
            window.confirm(
                `Are you sure you want to delete "${product.name}"?`
            );


        if (!confirmed) {

            return;

        }


        try {

            setError("");

            setSuccess("");


            await api.delete(
                `/api/products/${product.id}`
            );


            setProducts(
                (previous) =>
                    previous.filter(
                        (item) =>
                            item.id !== product.id
                    )
            );


            setStockValues(
                (previous) => {

                    const updated = {
                        ...previous
                    };

                    delete updated[product.id];

                    return updated;

                }
            );


            setSuccess(
                "Product deleted successfully."
            );


        } catch (err) {

            console.error(
                "Error deleting product:",
                err
            );

            setError(
                err.response?.data?.message ||
                "Unable to delete product."
            );

        }

    };


    // =====================================================
    // STOCK STATUS
    // =====================================================

    const getStockStatus = (stock) => {

        const quantity =
            Number(stock || 0);


        if (quantity <= 0) {

            return {

                text: "Out of Stock",

                className:
                    "seller-product-stock out"

            };

        }


        if (quantity <= 5) {

            return {

                text: "Low Stock",

                className:
                    "seller-product-stock low"

            };

        }


        return {

            text: "Healthy Stock",

            className:
                "seller-product-stock available"

        };

    };


    // =====================================================
    // QUICK STOCK - CHANGE VALUE
    // =====================================================

    const changeStockValue = (
        productId,
        amount
    ) => {

        setStockValues(
            (previous) => {

                const currentValue =
                    Number(
                        previous[productId] ?? 0
                    );


                const newValue =
                    Math.max(
                        0,
                        currentValue + amount
                    );


                return {

                    ...previous,

                    [productId]:
                    newValue

                };

            }
        );

    };


    // =====================================================
    // QUICK STOCK - DIRECT INPUT
    // =====================================================

    const handleStockInputChange = (
        productId,
        value
    ) => {

        const numericValue =
            value === ""
                ? ""
                : Math.max(
                    0,
                    Number(value)
                );


        setStockValues(
            (previous) => ({

                ...previous,

                [productId]:
                numericValue

            })
        );

    };


    // =====================================================
    // QUICK STOCK - UPDATE API
    // =====================================================

    const handleStockUpdate = async (
        productId
    ) => {

        const quantity =
            Number(
                stockValues[productId] ?? 0
            );


        if (quantity < 0) {

            setError(
                "Stock quantity cannot be negative."
            );

            return;

        }


        try {

            setUpdatingStockId(
                productId
            );

            setError("");

            setSuccess("");


            const response =
                await api.put(
                    `/api/products/${productId}/stock`,
                    null,
                    {
                        params: {
                            quantity
                        }
                    }
                );


            const updatedProduct =
                response.data;


// -------------------------------------------------
// UPDATE PRODUCT STATE
// -------------------------------------------------

            setProducts(
                (previous) =>
                    previous.map(
                        (product) =>
                            product.id === productId
                                ? {
                                    ...product,
                                    stockQuantity:
                                    updatedProduct.stockQuantity
                                }
                                : product
                    )
            );


// -------------------------------------------------
// UPDATE QUICK STOCK STATE
// -------------------------------------------------

            setStockValues(
                (previous) => ({

                    ...previous,

                    [productId]:
                        Number(
                            updatedProduct.stockQuantity || 0
                        )

                })
            );


            setSuccess(
                `${updatedProduct.name} stock updated to ${updatedProduct.stockQuantity} units.`
            );


        } catch (err) {

            console.error(
                "Stock update failed:",
                err
            );

            setError(
                err.response?.data?.message ||
                "Unable to update stock."
            );

        } finally {

            setUpdatingStockId(
                null
            );

        }

    };


// =====================================================
// INVENTORY STATISTICS
// =====================================================

    const inventoryStats =
        useMemo(() => {

            const totalProducts =
                products.length;


            const totalUnits =
                products.reduce(
                    (total, product) =>
                        total +
                        Number(
                            product.stockQuantity || 0
                        ),
                    0
                );


            const lowStockProducts =
                products.filter(
                    (product) =>
                        Number(
                            product.stockQuantity || 0
                        ) > 0 &&
                        Number(
                            product.stockQuantity || 0
                        ) <= 5
                ).length;


            const outOfStockProducts =
                products.filter(
                    (product) =>
                        Number(
                            product.stockQuantity || 0
                        ) <= 0
                ).length;


            const inventoryValue =
                products.reduce(
                    (total, product) =>
                        total +
                        Number(
                            product.price || 0
                        ) *
                        Number(
                            product.stockQuantity || 0
                        ),
                    0
                );


            return {

                totalProducts,

                totalUnits,

                lowStockProducts,

                outOfStockProducts,

                inventoryValue

            };

        }, [products]);


// =====================================================
// FILTERED + SORTED PRODUCTS
// =====================================================

    const filteredProducts =
        useMemo(() => {

            let result = [
                ...products
            ];


            // -------------------------------------------------
            // SEARCH
            // -------------------------------------------------

            const search =
                searchTerm
                    .trim()
                    .toLowerCase();


            if (search) {

                result =
                    result.filter(
                        (product) => {

                            const name =
                                (
                                    product.name || ""
                                ).toLowerCase();


                            const description =
                                (
                                    product.description || ""
                                ).toLowerCase();


                            const category =
                                (
                                    product.categoryName || ""
                                ).toLowerCase();


                            return (

                                name.includes(search) ||

                                description.includes(search) ||

                                category.includes(search)

                            );

                        }
                    );

            }


            // -------------------------------------------------
            // STOCK FILTER
            // -------------------------------------------------

            if (
                stockFilter === "in-stock"
            ) {

                result =
                    result.filter(
                        (product) =>
                            Number(
                                product.stockQuantity || 0
                            ) > 5
                    );

            }


            if (
                stockFilter === "low-stock"
            ) {

                result =
                    result.filter(
                        (product) => {

                            const stock =
                                Number(
                                    product.stockQuantity || 0
                                );


                            return (
                                stock > 0 &&
                                stock <= 5
                            );

                        }
                    );

            }


            if (
                stockFilter === "out-of-stock"
            ) {

                result =
                    result.filter(
                        (product) =>
                            Number(
                                product.stockQuantity || 0
                            ) <= 0
                    );

            }


            // -------------------------------------------------
            // SORT
            // -------------------------------------------------

            if (
                sortOption === "name-asc"
            ) {

                result.sort(
                    (a, b) =>
                        (
                            a.name || ""
                        ).localeCompare(
                            b.name || ""
                        )
                );

            }


            if (
                sortOption === "name-desc"
            ) {

                result.sort(
                    (a, b) =>
                        (
                            b.name || ""
                        ).localeCompare(
                            a.name || ""
                        )
                );

            }


            if (
                sortOption === "price-low"
            ) {

                result.sort(
                    (a, b) =>
                        Number(
                            a.price || 0
                        ) -
                        Number(
                            b.price || 0
                        )
                );

            }


            if (
                sortOption === "price-high"
            ) {

                result.sort(
                    (a, b) =>
                        Number(
                            b.price || 0
                        ) -
                        Number(
                            a.price || 0
                        )
                );

            }


            if (
                sortOption === "stock-low"
            ) {

                result.sort(
                    (a, b) =>
                        Number(
                            a.stockQuantity || 0
                        ) -
                        Number(
                            b.stockQuantity || 0
                        )
                );

            }


            if (
                sortOption === "stock-high"
            ) {

                result.sort(
                    (a, b) =>
                        Number(
                            b.stockQuantity || 0
                        ) -
                        Number(
                            a.stockQuantity || 0
                        )
                );

            }


            if (
                sortOption === "newest"
            ) {

                result.sort(
                    (a, b) =>
                        Number(
                            b.id || 0
                        ) -
                        Number(
                            a.id || 0
                        )
                );

            }


            return result;

        }, [
            products,
            searchTerm,
            stockFilter,
            sortOption
        ]);


// =====================================================
// CLEAR FILTERS
// =====================================================

    const clearFilters = () => {

        setSearchTerm("");

        setStockFilter("all");

        setSortOption("newest");

    };


// =====================================================
// LOADING SCREEN
// =====================================================

    if (loading) {

        return (

            <div className="app">

                <nav className="navbar">

                    <Link
                        to="/seller/home"
                        className="logo"
                    >
                        Shop<span>Sphere</span>
                    </Link>

                </nav>


                <main className="seller-dashboard-container">

                    <div className="seller-products-loading">

                        <div className="seller-loading-spinner"></div>

                        <h2>
                            Loading your products...
                        </h2>

                        <p>
                            Please wait while we load
                            your seller inventory.
                        </p>

                    </div>

                </main>

            </div>

        );

    }


// =====================================================
// MAIN SELLER VIEW
// =====================================================

    return (

        <div className="app">


            {/* =================================================
                SELLER NAVBAR
            ================================================= */}

            <nav className="navbar">

                <Link
                    to="/seller/home"
                    className="logo"
                >
                    Shop<span>Sphere</span>
                </Link>


                <div className="nav-actions">

                    <Link
                        to="/seller/home"
                    >
                        Dashboard
                    </Link>


                    <Link
                        to="/seller/products"
                        className="active-nav-link"
                    >
                        Products
                    </Link>


                    <Link
                        to="/seller/orders"
                    >
                        Orders
                    </Link>


                    <Link
                        to="/seller/reviews"
                    >
                        Reviews
                    </Link>


                    <Link
                        to="/seller/profile"
                    >
                        Store Profile
                    </Link>


                    <Link
                        to="/"
                        className="login-link"
                    >
                        Customer View
                    </Link>

                </div>

            </nav>


            {/* =================================================
                SELLER MAIN CONTENT
            ================================================= */}

            <main className="seller-dashboard-container">


                {/* =================================================
                    PAGE HEADER
                ================================================= */}

                <section className="seller-dashboard-header">

                    <div>

                        <p className="dashboard-eyebrow">
                            SELLER CENTER
                        </p>

                        <h1>
                            Product Management
                        </h1>

                        <p>
                            Manage your products,
                            inventory and stock from
                            one place.
                        </p>

                    </div>


                    <button
                        type="button"
                        className="seller-add-product-button"
                        onClick={
                            handleAddProduct
                        }
                    >
                        + Add Product
                    </button>

                </section>


                {/* =================================================
                    ALERTS
                ================================================= */}

                {error && (

                    <div className="seller-alert seller-alert-error">

                        <span>
                            ⚠️
                        </span>

                        <p>
                            {error}
                        </p>

                        <button
                            type="button"
                            onClick={() =>
                                setError("")
                            }
                        >
                            ×
                        </button>

                    </div>

                )}


                {success && (

                    <div className="seller-alert seller-alert-success">

                        <span>
                            ✓
                        </span>

                        <p>
                            {success}
                        </p>

                        <button
                            type="button"
                            onClick={() =>
                                setSuccess("")
                            }
                        >
                            ×
                        </button>

                    </div>

                )}


                {/* =================================================
                    SELLER STORE INFO
                ================================================= */}

                {seller && (

                    <section className="seller-store-banner">

                        <div className="seller-store-banner-image">

                            {seller.storeImageUrl ? (

                                <img
                                    src={
                                        seller.storeImageUrl
                                    }
                                    alt={
                                        seller.storeName ||
                                        "Store"
                                    }
                                />

                            ) : (

                                <div className="seller-store-banner-fallback">
                                    🏪
                                </div>

                            )}

                        </div>


                        <div className="seller-store-banner-content">

                            <span>
                                YOUR STORE
                            </span>

                            <h2>
                                {seller.storeName ||
                                    "ShopSphere Store"}
                            </h2>

                            <p>
                                {seller.description ||
                                    "Manage your ShopSphere store inventory."}
                            </p>

                        </div>


                        {seller.id && (

                            <Link
                                to={`/store/${seller.id}`}
                                className="seller-view-store-button"
                            >
                                View Store →
                            </Link>

                        )}

                    </section>

                )}


                {/* =================================================
                    INVENTORY SUMMARY
                ================================================= */}

                <section className="seller-inventory-summary">


                    <div className="seller-inventory-stat-card">

                        <span className="seller-inventory-stat-icon">
                            📦
                        </span>

                        <span className="seller-inventory-stat-label">
                            TOTAL PRODUCTS
                        </span>

                        <strong className="seller-inventory-stat-value">
                            {inventoryStats.totalProducts}
                        </strong>

                        <small>
                            Products in your catalog
                        </small>

                    </div>


                    <div className="seller-inventory-stat-card">

                        <span className="seller-inventory-stat-icon">
                            📊
                        </span>

                        <span className="seller-inventory-stat-label">
                            TOTAL UNITS
                        </span>

                        <strong className="seller-inventory-stat-value">
                            {inventoryStats.totalUnits}
                        </strong>

                        <small>
                            Units currently available
                        </small>

                    </div>


                    <div className="seller-inventory-stat-card seller-inventory-stat-low">

                        <span className="seller-inventory-stat-icon">
                            ⚠️
                        </span>

                        <span className="seller-inventory-stat-label">
                            LOW STOCK
                        </span>

                        <strong className="seller-inventory-stat-value">
                            {inventoryStats.lowStockProducts}
                        </strong>

                        <small>
                            Products needing attention
                        </small>

                    </div>


                    <div className="seller-inventory-stat-card seller-inventory-stat-out">

                        <span className="seller-inventory-stat-icon">
                            🚨
                        </span>

                        <span className="seller-inventory-stat-label">
                            OUT OF STOCK
                        </span>

                        <strong className="seller-inventory-stat-value">
                            {inventoryStats.outOfStockProducts}
                        </strong>

                        <small>
                            Products unavailable
                        </small>

                    </div>


                    {/* =================================================
                        INVENTORY VALUE
                    ================================================= */}

                    <div className="seller-inventory-stat-card seller-inventory-stat-value-card">

                        <span className="seller-inventory-stat-icon">
                            💰
                        </span>

                        <span className="seller-inventory-stat-label">
                            INVENTORY VALUE
                        </span>

                        <strong className="seller-inventory-stat-value">

                            ₹
                            {inventoryStats.inventoryValue.toLocaleString(
                                "en-IN",
                                {
                                    maximumFractionDigits: 2
                                }
                            )}

                        </strong>

                        <small>
                            Current stock value
                        </small>

                    </div>


                </section>


                {/* =================================================
                    PRODUCT FORM
                ================================================= */}

                {showForm && (

                    <section className="seller-product-form-section">

                        <div className="seller-product-form-header">

                            <div>

                                <p className="dashboard-eyebrow">
                                    {editingProduct
                                        ? "EDIT PRODUCT"
                                        : "NEW PRODUCT"}
                                </p>

                                <h2>
                                    {editingProduct
                                        ? "Update Product"
                                        : "Add New Product"}
                                </h2>

                                <p>
                                    Enter the product
                                    information below.
                                </p>

                            </div>


                            <button
                                type="button"
                                className="seller-form-close-button"
                                onClick={
                                    resetForm
                                }
                            >
                                ×
                            </button>

                        </div>


                        <form
                            onSubmit={
                                handleSaveProduct
                            }
                        >

                            <div className="seller-form-grid">


                                {/* PRODUCT NAME */}

                                <div className="seller-form-field">

                                    <label>
                                        Product Name
                                    </label>

                                    <input
                                        type="text"
                                        name="name"
                                        value={
                                            formData.name
                                        }
                                        onChange={
                                            handleInputChange
                                        }
                                        placeholder="Enter product name"
                                        required
                                    />

                                </div>


                                {/* CATEGORY */}

                                <div className="seller-form-field">

                                    <label>
                                        Category
                                    </label>

                                    <select
                                        name="categoryId"
                                        value={
                                            formData.categoryId
                                        }
                                        onChange={
                                            handleInputChange
                                        }
                                        required
                                    >

                                        <option value="">
                                            Select category
                                        </option>

                                        {categories.map(
                                            (category) => (

                                                <option
                                                    key={
                                                        category.id
                                                    }
                                                    value={
                                                        category.id
                                                    }
                                                >
                                                    {
                                                        category.name
                                                    }
                                                </option>

                                            )
                                        )}

                                    </select>

                                </div>


                                {/* PRICE */}

                                <div className="seller-form-field">

                                    <label>
                                        Price
                                    </label>

                                    <input
                                        type="number"
                                        name="price"
                                        min="0.01"
                                        step="0.01"
                                        value={
                                            formData.price
                                        }
                                        onChange={
                                            handleInputChange
                                        }
                                        placeholder="Enter price"
                                        required
                                    />

                                </div>


                                {/* STOCK */}

                                <div className="seller-form-field">

                                    <label>
                                        Stock Quantity
                                    </label>

                                    <input
                                        type="number"
                                        name="stockQuantity"
                                        min="0"
                                        value={
                                            formData.stockQuantity
                                        }
                                        onChange={
                                            handleInputChange
                                        }
                                        placeholder="Enter stock quantity"
                                        required
                                    />

                                    <small className="seller-form-help">
                                        Stock cannot be negative.
                                    </small>

                                </div>


                                {/* PRODUCT IMAGE */}


                                <div className="seller-form-field seller-form-field-full">

                                    <label>
                                        Product Image
                                    </label>

                                    <div className="seller-image-upload-box">

                                        <label
                                            htmlFor="seller-product-image-upload"
                                            className="seller-image-upload-label"
                                        >
                                        <span className="seller-image-upload-icon">
                                            🖼️
                                        </span>

                                            <strong>
                                                Upload Product Image
                                            </strong>

                                            <small>
                                                JPG, JPEG, PNG or WEBP · Maximum 5 MB
                                            </small>

                                            <span className="seller-image-upload-button">
                                            Choose Image
                                        </span>
                                        </label>

                                        <input
                                            id="seller-product-image-upload"
                                            type="file"
                                            accept="image/png,image/jpeg,image/jpg,image/webp"
                                            onChange={handleImageFileChange}
                                            className="seller-image-file-input"
                                        />

                                    </div>


                                    <div className="seller-image-or-divider">
                                        <span>OR</span>
                                    </div>


                                    <input
                                        type="url"
                                        name="imageUrl"
                                        value={formData.imageUrl}
                                        onChange={handleInputChange}
                                        placeholder="https://example.com/product-image.jpg"
                                    />

                                    <small className="seller-form-help">
                                        You can upload an image or use a direct image URL.
                                        Uploaded images are stored by ShopSphere.
                                    </small>


                                    {(imageFile || formData.imageUrl) && (

                                        <div className="seller-selected-image-info">

                                        <span>
                                            {imageFile
                                                ? `Selected: ${imageFile.name}`
                                                : "Using image URL"}
                                        </span>

                                            <button
                                                type="button"
                                                className="seller-clear-image-button"
                                                onClick={clearSelectedImage}
                                            >
                                                Remove Image
                                            </button>

                                        </div>

                                    )}

                                </div>


                                {/* IMAGE PREVIEW */}


                                <div className="seller-image-preview-section seller-form-field-full">

                                    <label>
                                        Image Preview
                                    </label>


                                    <div className="seller-image-preview">

                                        {imageUploadPreview && !imagePreviewError ? (

                                            <img
                                                src={imageUploadPreview}
                                                alt="Product preview"
                                                onError={() =>
                                                    setImagePreviewError(true)
                                                }
                                            />

                                        ) : (

                                            <div className="seller-image-preview-fallback">

                                            <span>
                                                📦
                                            </span>

                                                <p>
                                                    {imagePreviewError
                                                        ? "Unable to load this image"
                                                        : "No image added"}
                                                </p>

                                            </div>

                                        )}

                                    </div>

                                </div>


                                {/* DESCRIPTION */}

                                <div className="seller-form-field seller-form-field-full">

                                    <label>
                                        Description
                                    </label>

                                    <textarea
                                        name="description"
                                        rows="5"
                                        value={
                                            formData.description
                                        }
                                        onChange={
                                            handleInputChange
                                        }
                                        placeholder="Describe your product..."
                                        required
                                    />

                                </div>

                            </div>


                            {/* FORM ACTIONS */}

                            <div className="seller-form-actions">

                                <button
                                    type="button"
                                    className="seller-cancel-button"
                                    onClick={
                                        resetForm
                                    }
                                    disabled={saving}
                                >
                                    Cancel
                                </button>


                                <button
                                    type="submit"
                                    className="seller-save-button"
                                    disabled={saving}
                                >
                                    {saving
                                        ? "Saving..."
                                        : editingProduct
                                            ? "Update Product"
                                            : "Create Product"}
                                </button>

                            </div>

                        </form>

                    </section>

                )}


                {/* =================================================
                    INVENTORY CONTROLS
                ================================================= */}

                <section className="seller-inventory-controls">

                    <div className="seller-inventory-controls-header">

                        <div>

                            <p className="dashboard-eyebrow">
                                INVENTORY
                            </p>

                            <h2>
                                Your Products
                            </h2>

                        </div>


                        <span className="seller-product-count">
                            {filteredProducts.length}
                            {" "}
                            {filteredProducts.length === 1
                                ? "product"
                                : "products"}
                        </span>

                    </div>


                    <div className="seller-inventory-filter-row">


                        {/* SEARCH */}

                        <div className="seller-search-box">

                            <span>
                                🔍
                            </span>

                            <input
                                type="text"
                                value={
                                    searchTerm
                                }
                                onChange={(
                                    event
                                ) =>
                                    setSearchTerm(
                                        event.target.value
                                    )
                                }
                                placeholder="Search products..."
                            />

                        </div>


                        {/* STOCK FILTER */}

                        <select
                            className="seller-filter-select"
                            value={
                                stockFilter
                            }
                            onChange={(
                                event
                            ) =>
                                setStockFilter(
                                    event.target.value
                                )
                            }
                        >

                            <option value="all">
                                All Stock
                            </option>

                            <option value="in-stock">
                                Healthy Stock
                            </option>

                            <option value="low-stock">
                                Low Stock
                            </option>

                            <option value="out-of-stock">
                                Out of Stock
                            </option>

                        </select>


                        {/* SORT */}

                        <select
                            className="seller-filter-select"
                            value={
                                sortOption
                            }
                            onChange={(
                                event
                            ) =>
                                setSortOption(
                                    event.target.value
                                )
                            }
                        >

                            <option value="newest">
                                Newest
                            </option>

                            <option value="name-asc">
                                Name A-Z
                            </option>

                            <option value="name-desc">
                                Name Z-A
                            </option>

                            <option value="price-low">
                                Price Low-High
                            </option>

                            <option value="price-high">
                                Price High-Low
                            </option>

                            <option value="stock-low">
                                Stock Low-High
                            </option>

                            <option value="stock-high">
                                Stock High-Low
                            </option>

                        </select>


                        {/* CLEAR */}

                        {(searchTerm ||
                            stockFilter !== "all" ||
                            sortOption !== "newest") && (

                            <button
                                type="button"
                                className="seller-clear-filter-button"
                                onClick={
                                    clearFilters
                                }
                            >
                                Clear Filters
                            </button>

                        )}

                    </div>

                </section>


                {/* =================================================
                    NO PRODUCTS
                ================================================= */}

                {filteredProducts.length === 0 ? (

                    <section className="seller-no-products">

                        <div className="seller-no-products-icon">
                            📦
                        </div>

                        <h2>
                            No products found
                        </h2>

                        <p>

                            {products.length === 0
                                ? "You have not added any products yet."
                                : "No products match your current search or filters."}

                        </p>


                        {products.length === 0 ? (

                            <button
                                type="button"
                                className="seller-add-product-button"
                                onClick={
                                    handleAddProduct
                                }
                            >
                                + Add Your First Product
                            </button>

                        ) : (

                            <button
                                type="button"
                                className="seller-clear-filter-button"
                                onClick={
                                    clearFilters
                                }
                            >
                                Clear Filters
                            </button>

                        )}

                    </section>

                ) : (

                    /* =================================================
                       PRODUCT GRID
                    ================================================= */

                    <section className="seller-products-grid">

                        {filteredProducts.map(
                            (product) => {

                                const stockStatus =
                                    getStockStatus(
                                        product.stockQuantity
                                    );


                                const currentStock =
                                    stockValues[
                                        product.id
                                        ] ?? 0;


                                const stockChanged =
                                    Number(
                                        currentStock
                                    ) !==
                                    Number(
                                        product.stockQuantity || 0
                                    );


                                const isUpdating =
                                    updatingStockId ===
                                    product.id;


                                // -------------------------------------------------
                                // INVENTORY VALUE
                                // -------------------------------------------------

                                const inventoryValue =
                                    Number(
                                        product.price || 0
                                    ) *
                                    Number(
                                        product.stockQuantity || 0
                                    );


                                // -------------------------------------------------
                                // DESCRIPTION PREVIEW
                                // -------------------------------------------------

                                const productDescription =
                                    product.description ||
                                    "No product description available.";


                                const descriptionPreview =
                                    productDescription.length > 110
                                        ? `${productDescription.substring(
                                            0,
                                            110
                                        )}...`
                                        : productDescription;


                                return (

                                    <article
                                        key={
                                            product.id
                                        }
                                        className="seller-management-card"
                                    >


                                        {/* =================================================
                                           PRODUCT IMAGE
                                        ================================================= */}

                                        <div className="seller-management-image">

                                            {product.imageUrl ? (

                                                <img
                                                    src={
                                                        product.imageUrl
                                                    }
                                                    alt={
                                                        product.name
                                                    }
                                                    onError={(
                                                        event
                                                    ) => {

                                                        event.currentTarget.style.display =
                                                            "none";


                                                        const fallback =
                                                            event.currentTarget
                                                                .parentElement
                                                                ?.querySelector(
                                                                    ".seller-management-image-fallback"
                                                                );


                                                        if (
                                                            fallback
                                                        ) {

                                                            fallback.style.display =
                                                                "flex";

                                                        }

                                                    }}
                                                />

                                            ) : null}


                                            <div
                                                className="seller-management-image-fallback"
                                                style={{
                                                    display:
                                                        product.imageUrl
                                                            ? "none"
                                                            : "flex"
                                                }}
                                            >

                                                <span>
                                                    📦
                                                </span>

                                                <p>
                                                    No image available
                                                </p>

                                            </div>


                                            {/* IMAGE OVERLAY */}

                                            <div className="seller-product-image-overlay">

                                                <span>
                                                    Product Image
                                                </span>

                                            </div>

                                        </div>


                                        {/* =================================================
                                           PRODUCT CONTENT
                                        ================================================= */}

                                        <div className="seller-management-content">


                                            {/* CATEGORY + STATUS */}

                                            <div className="seller-product-card-top">

                                                <span className="seller-product-category">

                                                    {product.categoryName ||
                                                        "Uncategorized"}

                                                </span>


                                                <span
                                                    className={
                                                        product.stockQuantity <= 0
                                                            ? "product-status out"
                                                            : product.stockQuantity <= 5
                                                                ? "seller-stock-warning"
                                                                : "product-status active"
                                                    }
                                                >

                                                    {product.stockQuantity <= 0
                                                        ? "Out of Stock"
                                                        : product.stockQuantity <= 5
                                                            ? "Low Stock"
                                                            : "Active"}

                                                </span>

                                            </div>


                                            {/* NAME */}

                                            <h3 className="seller-product-card-title">

                                                {product.name}

                                            </h3>


                                            {/* DESCRIPTION */}

                                            <p className="seller-product-card-description">

                                                {descriptionPreview}

                                            </p>


                                            {/* PRICE + STOCK SUMMARY */}

                                            <div className="seller-product-card-price-row">

                                                <span className="seller-product-card-price">

                                                    ₹
                                                    {Number(
                                                        product.price || 0
                                                    ).toLocaleString(
                                                        "en-IN",
                                                        {
                                                            maximumFractionDigits: 2
                                                        }
                                                    )}

                                                </span>


                                                <span className="seller-product-card-stock-count">

                                                    {Number(
                                                        product.stockQuantity || 0
                                                    )}
                                                    {" "}
                                                    units

                                                </span>

                                            </div>


                                            {/* PRODUCT META */}

                                            <div className="seller-product-meta">


                                                <div className="seller-product-meta-item">

                                                    <span>
                                                        PRICE
                                                    </span>

                                                    <strong>

                                                        ₹
                                                        {Number(
                                                            product.price || 0
                                                        ).toLocaleString(
                                                            "en-IN",
                                                            {
                                                                maximumFractionDigits: 2
                                                            }
                                                        )}

                                                    </strong>

                                                </div>


                                                <div className="seller-product-meta-item">

                                                    <span>
                                                        STOCK
                                                    </span>

                                                    <strong>
                                                        {Number(
                                                            product.stockQuantity || 0
                                                        )}
                                                    </strong>

                                                </div>


                                                <div className="seller-product-meta-item">

                                                    <span>
                                                        INVENTORY VALUE
                                                    </span>

                                                    <strong>

                                                        ₹
                                                        {inventoryValue.toLocaleString(
                                                            "en-IN",
                                                            {
                                                                maximumFractionDigits: 2
                                                            }
                                                        )}

                                                    </strong>

                                                </div>


                                                <div className="seller-product-meta-item">

                                                    <span>
                                                        CATEGORY
                                                    </span>

                                                    <strong>
                                                        {product.categoryName ||
                                                            "Uncategorized"}
                                                    </strong>

                                                </div>

                                            </div>


                                            {/* STORE */}

                                            <div className="seller-product-owner">

                                                <div className="seller-owner-icon">
                                                    🏪
                                                </div>

                                                <div>

                                                    <span>
                                                        YOUR STORE
                                                    </span>

                                                    <strong>
                                                        {product.storeName ||
                                                            seller?.storeName ||
                                                            "ShopSphere Seller"}
                                                    </strong>

                                                </div>

                                            </div>


                                            {/* =================================================
                                               STOCK STATUS
                                            ================================================= */}

                                            <div
                                                className={
                                                    stockStatus.className
                                                }
                                            >

                                                <span className="seller-stock-dot">
                                                    ●
                                                </span>

                                                {stockStatus.text}

                                                <span>
                                                    {" "}
                                                    ·
                                                    {" "}
                                                    {Number(
                                                        product.stockQuantity || 0
                                                    )}
                                                    {" "}
                                                    units available
                                                </span>

                                            </div>


                                            {/* =================================================
                                               QUICK INVENTORY
                                            ================================================= */}

                                            <div className="seller-quick-stock">


                                                <div className="seller-quick-stock-header">

                                                    <div>

                                                        <span>
                                                            QUICK INVENTORY
                                                        </span>

                                                        <strong>
                                                            {currentStock}
                                                            {" "}
                                                            units
                                                        </strong>

                                                    </div>


                                                    {stockChanged && (

                                                        <small>
                                                            Unsaved changes
                                                        </small>

                                                    )}

                                                </div>


                                                <div className="seller-stock-controls">


                                                    <button
                                                        type="button"
                                                        className="seller-stock-adjust-button"
                                                        onClick={() =>
                                                            changeStockValue(
                                                                product.id,
                                                                -1
                                                            )
                                                        }
                                                        disabled={
                                                            isUpdating ||
                                                            Number(
                                                                currentStock
                                                            ) <= 0
                                                        }
                                                        aria-label="Decrease stock"
                                                    >
                                                        −
                                                    </button>


                                                    <input
                                                        type="number"
                                                        min="0"
                                                        className="seller-stock-number-input"
                                                        value={
                                                            currentStock
                                                        }
                                                        onChange={(
                                                            event
                                                        ) =>
                                                            handleStockInputChange(
                                                                product.id,
                                                                event.target.value
                                                            )
                                                        }
                                                        disabled={
                                                            isUpdating
                                                        }
                                                    />


                                                    <button
                                                        type="button"
                                                        className="seller-stock-adjust-button"
                                                        onClick={() =>
                                                            changeStockValue(
                                                                product.id,
                                                                1
                                                            )
                                                        }
                                                        disabled={
                                                            isUpdating
                                                        }
                                                        aria-label="Increase stock"
                                                    >
                                                        +
                                                    </button>

                                                </div>


                                                <button
                                                    type="button"
                                                    className="seller-update-stock-button"
                                                    onClick={() =>
                                                        handleStockUpdate(
                                                            product.id
                                                        )
                                                    }
                                                    disabled={
                                                        isUpdating ||
                                                        !stockChanged ||
                                                        currentStock === ""
                                                    }
                                                >

                                                    {isUpdating
                                                        ? "Updating Stock..."
                                                        : stockChanged
                                                            ? "Update Stock"
                                                            : "Stock Saved ✓"}

                                                </button>

                                            </div>


                                            {/* =================================================
                                               ACTIONS
                                            ================================================= */}

                                            <div className="seller-management-actions">


                                                <Link
                                                    to={`/products/${product.id}`}
                                                    className="seller-view-button"
                                                >
                                                    View
                                                </Link>


                                                <button
                                                    type="button"
                                                    className="seller-preview-button"
                                                    onClick={() =>
                                                        handlePreviewProduct(
                                                            product
                                                        )
                                                    }
                                                >
                                                    👁 Preview
                                                </button>


                                                <button
                                                    type="button"
                                                    className="seller-edit-button"
                                                    onClick={() =>
                                                        handleEditProduct(
                                                            product
                                                        )
                                                    }
                                                >
                                                    Edit
                                                </button>


                                                <button
                                                    type="button"
                                                    className="seller-delete-button"
                                                    onClick={() =>
                                                        handleDeleteProduct(
                                                            product
                                                        )
                                                    }
                                                >
                                                    Delete
                                                </button>

                                            </div>

                                        </div>

                                    </article>

                                );

                            }
                        )}

                    </section>

                )}

            </main>


            {/* =================================================
                PRODUCT PREVIEW MODAL
            ================================================= */}

            {previewProduct && (

                <div
                    className="seller-product-preview-overlay"
                    onClick={() =>
                        setPreviewProduct(null)
                    }
                >

                    <div
                        className="seller-product-preview-modal"
                        onClick={(event) =>
                            event.stopPropagation()
                        }
                    >

                        <button
                            type="button"
                            className="seller-product-preview-close"
                            onClick={() =>
                                setPreviewProduct(null)
                            }
                            aria-label="Close product preview"
                        >
                            ×
                        </button>


                        <div className="seller-product-preview-content">


                            {/* PRODUCT IMAGE */}

                            <div className="seller-product-preview-image-section">

                                {previewProduct.imageUrl ? (

                                    <img
                                        src={
                                            previewProduct.imageUrl
                                        }
                                        alt={
                                            previewProduct.name ||
                                            "Product"
                                        }
                                        className="seller-product-preview-image"
                                        onError={(
                                            event
                                        ) => {

                                            event.currentTarget.style.display =
                                                "none";

                                            const fallback =
                                                event.currentTarget
                                                    .parentElement
                                                    ?.querySelector(
                                                        ".seller-product-preview-image-fallback"
                                                    );

                                            if (fallback) {
                                                fallback.style.display =
                                                    "flex";
                                            }

                                        }}
                                    />

                                ) : null}


                                <div
                                    className="seller-product-preview-image-fallback"
                                    style={{
                                        display:
                                            previewProduct.imageUrl
                                                ? "none"
                                                : "flex"
                                    }}
                                >

                                    <span>
                                        📦
                                    </span>

                                    <p>
                                        No product image
                                    </p>

                                </div>

                            </div>


                            {/* PRODUCT INFORMATION */}

                            <div className="seller-product-preview-info">


                                <span className="seller-product-preview-category">
                                    {previewProduct.categoryName ||
                                        "Uncategorized"}
                                </span>


                                <h2>
                                    {previewProduct.name ||
                                        "Product"}
                                </h2>


                                <div className="seller-product-preview-rating">

                                    <span className="seller-preview-stars">
                                        ★★★★★
                                    </span>

                                    <span>
                                        Customer-style preview
                                    </span>

                                </div>


                                <div className="seller-product-preview-price">

                                    ₹
                                    {Number(
                                        previewProduct.price || 0
                                    ).toLocaleString(
                                        "en-IN",
                                        {
                                            maximumFractionDigits: 2
                                        }
                                    )}

                                </div>


                                <div className="seller-product-preview-stock">

                                    <span
                                        className={
                                            Number(
                                                previewProduct.stockQuantity ||
                                                0
                                            ) > 0
                                                ? "seller-preview-stock-dot available"
                                                : "seller-preview-stock-dot out"
                                        }
                                    ></span>

                                    {Number(
                                        previewProduct.stockQuantity || 0
                                    ) > 0
                                        ? "In Stock"
                                        : "Out of Stock"}

                                </div>


                                <div className="seller-product-preview-divider"></div>


                                <h3>
                                    Product Description
                                </h3>


                                <p className="seller-product-preview-description">

                                    {previewProduct.description ||
                                        "No product description available."}

                                </p>


                                <div className="seller-product-preview-details">


                                    <div className="seller-preview-detail-item">

                                        <span>
                                            Category
                                        </span>

                                        <strong>
                                            {previewProduct.categoryName ||
                                                "Uncategorized"}
                                        </strong>

                                    </div>


                                    <div className="seller-preview-detail-item">

                                        <span>
                                            Available Stock
                                        </span>

                                        <strong>
                                            {Number(
                                                previewProduct.stockQuantity ||
                                                0
                                            )}{" "}
                                            units
                                        </strong>

                                    </div>


                                    <div className="seller-preview-detail-item">

                                        <span>
                                            Store
                                        </span>

                                        <strong>
                                            {previewProduct.storeName ||
                                                seller?.storeName ||
                                                "ShopSphere Seller"}
                                        </strong>

                                    </div>


                                    <div className="seller-preview-detail-item">

                                        <span>
                                            Seller
                                        </span>

                                        <strong>
                                            {previewProduct.sellerName ||
                                                seller?.user?.name ||
                                                "Seller"}
                                        </strong>

                                    </div>

                                </div>


                                <div className="seller-product-preview-notice">

                                    <span>
                                        ℹ️
                                    </span>

                                    <p>
                                        This is a customer-style
                                        preview. No order or payment
                                        will be created from this
                                        screen.
                                    </p>

                                </div>


                                <button
                                    type="button"
                                    className="seller-product-preview-close-btn"
                                    onClick={() =>
                                        setPreviewProduct(null)
                                    }
                                >
                                    Close Preview
                                </button>

                            </div>

                        </div>

                    </div>

                </div>

            )}


            {/* =================================================
                FOOTER
            ================================================= */}

            <footer className="dashboard-footer">

                <p>
                    © 2026 ShopSphere. Seller Center.
                </p>

            </footer>

        </div>

    );

};


export default SellerProducts;
