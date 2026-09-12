// ============================================
// KIT KIT FASHION - FRONTEND SCRIPT
// ============================================

// ============================================
// BACKEND
// ============================================

const API_URL = "https://kit-kit-fashion-backent.onrender.com";


// ============================================
// OWNER
// ============================================

const OWNER_MOBILE = "9530450140";


// ============================================
// PRODUCTS
// ============================================

let products = [];


// ============================================
// CART
// ============================================

let cart = JSON.parse(
    localStorage.getItem("kitkit_cart") || "[]"
);


function saveCart() {

    localStorage.setItem(
        "kitkit_cart",
        JSON.stringify(cart)
    );

    updateCartCount();
}


function updateCartCount() {

    const element =
        document.getElementById("cartCount");

    if (!element) return;

    const count = cart.reduce(
        (total, item) =>
            total + Number(item.quantity || 0),
        0
    );

    element.textContent = count;
}


// ============================================
// PAGE NAVIGATION
// ============================================

function hideSections() {

    document
        .querySelectorAll("main section")
        .forEach(section => {
            section.classList.add("hidden");
        });
}


function showHome() {

    hideSections();

    const home =
        document.getElementById("homeSection");

    if (home) {
        home.classList.remove("hidden");
    }

    loadProducts();

    window.scrollTo(0, 0);
}


function showCart() {

    hideSections();

    const cartSection =
        document.getElementById("cartSection");

    if (cartSection) {
        cartSection.classList.remove("hidden");
    }

    renderCart();

    window.scrollTo(0, 0);
}


function showSettings() {

    hideSections();

    const settings =
        document.getElementById("settingsSection");

    if (settings) {
        settings.classList.remove("hidden");
    }

    window.scrollTo(0, 0);
}


// ============================================
// LOAD PRODUCTS
// ============================================

async function loadProducts() {

    try {

        const response =
            await fetch(
                `${API_URL}/api/products`
            );

        if (!response.ok) {
            throw new Error("Products load failed");
        }

        const data =
            await response.json();

        if (Array.isArray(data)) {
            products = data;
        }

    } catch (error) {

        console.error(
            "Products Error:",
            error
        );

        // Demo products if backend unavailable
        products = [
            {
                id: "1",
                name: "Classic Oversized T-Shirt",
                price: 799,
                mrp: 1199,
                rating: 4.5,
                image:
                    "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=700&q=80",
                description:
                    "Comfortable premium oversized T-shirt."
            },
            {
                id: "2",
                name: "Premium Casual Shirt",
                price: 1299,
                mrp: 1799,
                rating: 4.6,
                image:
                    "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=700&q=80",
                description:
                    "Premium casual shirt for everyday style."
            },
            {
                id: "3",
                name: "Everyday Hoodie",
                price: 1499,
                mrp: 2199,
                rating: 4.7,
                image:
                    "https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=700&q=80",
                description:
                    "Soft and comfortable everyday hoodie."
            },
            {
                id: "4",
                name: "Relaxed Fit Jeans",
                price: 1599,
                mrp: 2299,
                rating: 4.4,
                image:
                    "https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=700&q=80",
                description:
                    "Relaxed fit jeans with comfortable styling."
            }
        ];
    }

    renderProducts();
}


// ============================================
// RENDER PRODUCTS
// ============================================

function renderProducts() {

    const box =
        document.getElementById("products");

    if (!box) return;

    if (!products.length) {

        box.innerHTML =
            "<p class='muted'>No products available.</p>";

        return;
    }

    box.innerHTML =
        products.map(product => `

        <article class="product-card">

            <img
                src="${product.image || ""}"
                alt="${product.name || "Product"}"
            >

            <h3>
                ${product.name || "Product"}
            </h3>

            <p class="muted">
                ★ ${product.rating || 0}
            </p>

            <p>
                ${product.description || ""}
            </p>

            <p class="price">
                ₹${product.price}
                ${
                    product.mrp
                        ? `<del class="muted">
                            ₹${product.mrp}
                           </del>`
                        : ""
                }
            </p>

            <button
                class="primary-btn"
                onclick="openProduct('${product.id}')"
            >
                View Product
            </button>

            <button
                onclick="addToCart('${product.id}')"
            >
                Add To Cart
            </button>

            <button
                class="primary-btn"
                onclick="buyNow('${product.id}')"
            >
                Buy Now
            </button>

        </article>

    `).join("");
}


// ============================================
// PRODUCT DETAILS
// ============================================

function openProduct(id) {

    const product =
        products.find(
            item =>
                String(item.id) === String(id)
        );

    if (!product) {

        alert("Product nahi mila.");

        return;
    }

    hideSections();

    const section =
        document.getElementById(
            "productSection"
        );

    const detail =
        document.getElementById(
            "productDetail"
        );

    if (!section || !detail) return;

    section.classList.remove("hidden");

    detail.innerHTML = `

        <div class="product-card">

            <img
                src="${product.image || ""}"
                alt="${product.name || "Product"}"
            >

            <h1>
                ${product.name}
            </h1>

            <p>
                ★ ${product.rating || 0}
            </p>

            <p class="price">
                ₹${product.price}
                ${
                    product.mrp
                        ? `<del class="muted">
                            ₹${product.mrp}
                           </del>`
                        : ""
                }
            </p>

            <p>
                ${product.description || ""}
            </p>

            <p>
                Size: S / M / L / XL
            </p>

            <p>
                Delivery available
            </p>

            <button
                onclick="addToCart('${product.id}')"
            >
                Add To Cart
            </button>

            <button
                class="primary-btn"
                onclick="buyNow('${product.id}')"
            >
                Buy Now
            </button>

        </div>

    `;

    const related =
        products
            .filter(
                item =>
                    String(item.id) !==
                    String(product.id)
            )
            .slice(0, 4);

    const relatedBox =
        document.getElementById(
            "relatedProducts"
        );

    if (relatedBox) {

        relatedBox.innerHTML =
            related.map(item => `

                <article class="product-card">

                    <img
                        src="${item.image || ""}"
                        alt="${item.name || "Product"}"
                    >

                    <h3>
                        ${item.name}
                    </h3>

                    <p class="price">
                        ₹${item.price}
                    </p>

                    <button
                        onclick="openProduct('${item.id}')"
                    >
                        View Product
                    </button>

                </article>

            `).join("");
    }

    window.scrollTo(0, 0);
}


// ============================================
// BUY NOW
// ============================================

function buyNow(id) {

    const product =
        products.find(
            item =>
                String(item.id) === String(id)
        );

    if (!product) {

        alert("Product nahi mila.");

        return;
    }

    addToCart(id);

    showCart();
}


// ============================================
// ADD TO CART
// ============================================

function addToCart(id) {

    const product =
        products.find(
            item =>
                String(item.id) === String(id)
        );

    if (!product) {

        alert("Product nahi mila.");

        return;
    }

    const existing =
        cart.find(
            item =>
                String(item.productId) ===
                String(id)
        );

    if (existing) {

        existing.quantity =
            Number(existing.quantity || 0) + 1;

    } else {

        cart.push({
            productId: String(id),
            quantity: 1
        });
    }

    saveCart();

    alert(
        `${product.name} cart me add ho gaya.`
    );
}


// ============================================
// REMOVE FROM CART
// ============================================

function removeFromCart(id) {

    cart =
        cart.filter(
            item =>
                String(item.productId) !==
                String(id)
        );

    saveCart();

    renderCart();
}


// ============================================
// RENDER CART
// ============================================

function renderCart() {

    const box =
        document.getElementById("cartItems");

    const totalBox =
        document.getElementById("cartTotal");

    if (!box || !totalBox) return;

    if (!cart.length) {

        box.innerHTML =
            "<p class='muted'>Your cart is empty.</p>";

        totalBox.textContent = "";

        return;
    }

    let total = 0;

    box.innerHTML =
        cart.map(item => {

            const product =
                products.find(
                    p =>
                        String(p.id) ===
                        String(item.productId)
                );

            if (!product) return "";

            const quantity =
                Number(item.quantity || 1);

            const itemTotal =
                Number(product.price) *
                quantity;

            total += itemTotal;

            return `

                <div class="cart-item">

                    <h3>
                        ${product.name}
                    </h3>

                    <p>
                        ₹${product.price}
                        ×
                        ${quantity}
                    </p>

                    <p>
                        Item Total: ₹${itemTotal}
                    </p>

                    <button
                        onclick="removeFromCart('${product.id}')"
                    >
                        Remove
                    </button>

                </div>

            `;

        }).join("");

    totalBox.textContent =
        "Total: ₹" + total;
}


// ============================================
// CHECKOUT
// ============================================

async function checkout() {

    if (!cart.length) {

        alert("Cart empty hai.");

        return;
    }

    alert(
        "Checkout system next step me connect hoga."
    );
}


// ============================================
// OWNER ACCESS
// ============================================

function ownerAccess() {

    hideSections();

    const loginSection =
        document.getElementById(
            "ownerLoginSection"
        );

    if (!loginSection) return;

    loginSection.classList.remove(
        "hidden"
    );

    const password =
        document.getElementById(
            "ownerPassword"
        );

    const message =
        document.getElementById(
            "ownerLoginMessage"
        );

    if (password) {
        password.value = "";
        password.focus();
    }

    if (message) {
        message.textContent = "";
    }

    window.scrollTo(0, 0);
}


// ============================================
// OWNER PASSWORD LOGIN
// IMPORTANT: HTML calls this function
// ============================================

async function ownerPasswordLogin() {

    const passwordElement =
        document.getElementById(
            "ownerPassword"
        );

    const messageElement =
        document.getElementById(
            "ownerLoginMessage"
        );

    if (!passwordElement) {

        console.error(
            "ownerPassword input HTML me nahi mila."
        );

        return;
    }

    const password =
        passwordElement.value.trim();

    if (!password) {

        if (messageElement) {

            messageElement.textContent =
                "❌ Password enter karo.";
        }

        return;
    }

    if (messageElement) {

        messageElement.textContent =
            "Checking password...";
    }

    try {

        const response =
            await fetch(
                `${API_URL}/api/owner/login`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({
                        password: password
                    })
                }
            );

        let data;

        try {

            data =
                await response.json();

        } catch {

            throw new Error(
                "Server se valid response nahi mila."
            );
        }

        if (!response.ok) {

            throw new Error(
                data.message ||
                "Login failed"
            );
        }

        if (data.success === true) {

            sessionStorage.setItem(
                "kitkit_owner_logged_in",
                "true"
            );

            if (messageElement) {

                messageElement.textContent =
                    "✅ Login successful!";
            }

            alert(
                "✅ Owner Login Successful"
            );

            showOwnerDashboard();

            return;
        }

        throw new Error(
            data.message ||
            "Login failed"
        );

    } catch (error) {

        console.error(
            "Owner Login Error:",
            error
        );

        if (messageElement) {

            messageElement.textContent =
                "❌ " +
                (
                    error.message ||
                    "Login failed"
                );
        }
    }
}


// ============================================
// BACKWARD COMPATIBILITY
// ============================================

function ownerLogin() {
    ownerPasswordLogin();
}


// ============================================
// OWNER DASHBOARD
// ============================================

function showOwnerDashboard() {

    hideSections();

    const ownerSection =
        document.getElementById(
            "ownerSection"
        );

    if (ownerSection) {

        ownerSection.classList.remove(
            "hidden"
        );
    }

    window.scrollTo(0, 0);
}


// ============================================
// OWNER LOGOUT
// ============================================

function ownerLogout() {

    sessionStorage.removeItem(
        "kitkit_owner_logged_in"
    );

    hideSections();

    showSettings();
}


// ============================================
// OWNER PRODUCTS
// ============================================

async function ownerProducts() {

    showOwnerContent(
        "📦 Products",
        `
        <p>
            Products backend database se load ho rahe hain.
        </p>

        <button
            class="primary-btn"
            onclick="loadOwnerProducts()"
        >
            🔄 Load Products
        </button>

        <div id="ownerProductsList"></div>
        `
    );

    loadOwnerProducts();
}


async function loadOwnerProducts() {

    const box =
        document.getElementById(
            "ownerProductsList"
        );

    if (!box) return;

    box.innerHTML =
        "<p>Loading products...</p>";

    try {

        const response =
            await fetch(
                `${API_URL}/api/products`
            );

        if (!response.ok) {

            throw new Error(
                "Products load failed"
            );
        }

        const data =
            await response.json();

        if (!Array.isArray(data) || !data.length) {

            box.innerHTML =
                "<p>No products found.</p>";

            return;
        }

        box.innerHTML =
            data.map(product => `

                <div class="cart-item">

                    <h3>
                        ${product.name}
                    </h3>

                    <p>
                        Price: ₹${product.price}
                    </p>

                    <p>
                        Stock: ${product.stock || 0}
                    </p>

                    <button
                        onclick="deleteProduct('${product.id}')"
                    >
                        🗑 Delete
                    </button>

                </div>

            `).join("");

    } catch (error) {

        console.error(error);

        box.innerHTML =
            "<p>Products load nahi ho paye.</p>";
    }
}


// ============================================
// ADD PRODUCT
// ============================================

function addProduct() {

    showOwnerContent(
        "➕ Add Product",
        `
        <input
            id="newProductName"
            placeholder="Product Name"
        >

        <input
            id="newProductPrice"
            type="number"
            placeholder="Price"
        >

        <input
            id="newProductMRP"
            type="number"
            placeholder="MRP"
        >

        <input
            id="newProductImage"
            placeholder="Image URL"
        >

        <input
            id="newProductCategory"
            placeholder="Category"
        >

        <input
            id="newProductStock"
            type="number"
            placeholder="Stock"
        >

        <textarea
            id="newProductDescription"
            placeholder="Description"
        ></textarea>

        <button
            class="primary-btn"
            onclick="saveNewProduct()"
        >
            Save Product
        </button>
        `
    );
}


async function saveNewProduct() {

    const name =
        document.getElementById(
            "newProductName"
        ).value.trim();

    const price =
        Number(
            document.getElementById(
                "newProductPrice"
            ).value
        );

    const image =
        d
