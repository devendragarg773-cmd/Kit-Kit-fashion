// ============================================
// BACKEND
// ============================================

const API_URL = "https://kit-kit-fashion-backent.onrender.com";


// ============================================
// PRODUCTS
// ============================================

let products = [
    {
        id: "1",
        name: "Classic Oversized T-Shirt",
        price: 799,
        mrp: 1199,
        rating: 4.5,
        image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=700&q=80",
        description: "Comfortable premium oversized T-shirt."
    },
    {
        id: "2",
        name: "Premium Casual Shirt",
        price: 1299,
        mrp: 1799,
        rating: 4.6,
        image: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=700&q=80",
        description: "Premium casual shirt for everyday style."
    },
    {
        id: "3",
        name: "Everyday Hoodie",
        price: 1499,
        mrp: 2199,
        rating: 4.7,
        image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=700&q=80",
        description: "Soft and comfortable everyday hoodie."
    },
    {
        id: "4",
        name: "Relaxed Fit Jeans",
        price: 1599,
        mrp: 2299,
        rating: 4.4,
        image: "https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=700&q=80",
        description: "Relaxed fit jeans with comfortable styling."
    }
];


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

    document
        .getElementById("homeSection")
        .classList.remove("hidden");

    loadProducts();

    window.scrollTo(0, 0);
}


function showCart() {

    hideSections();

    document
        .getElementById("cartSection")
        .classList.remove("hidden");

    renderCart();

    window.scrollTo(0, 0);
}


function showSettings() {

    hideSections();

    document
        .getElementById("settingsSection")
        .classList.remove("hidden");

    window.scrollTo(0, 0);
}


// ============================================
// PRODUCTS
// ============================================

async function loadProducts() {

    if (!API_URL) {

        renderProducts();

        return;
    }

    try {

        const response =
            await fetch(
                `${API_URL}/api/products`
            );

        if (!response.ok) {
            throw new Error("Products load failed");
        }

        const backendProducts =
            await response.json();

        if (
            Array.isArray(backendProducts) &&
            backendProducts.length
        ) {
            products = backendProducts;
        }

    } catch (error) {

        console.error(
            "Backend unavailable:",
            error
        );

    }

    renderProducts();
}


function renderProducts() {

    const box =
        document.getElementById("products");

    if (!box) return;

    box.innerHTML = products.map(product => `

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
                <del class="muted">
                    ₹${product.mrp || ""}
                </del>
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
            item => String(item.id) === String(id)
        );

    if (!product) {
        alert("Product nahi mila.");
        return;
    }

    hideSections();

    const section =
        document.getElementById("productSection");

    const detail =
        document.getElementById("productDetail");

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
                <del class="muted">
                    ₹${product.mrp || ""}
                </del>
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
                    String(item.id) !== String(product.id)
            )
            .slice(0, 4);

    document.getElementById(
        "relatedProducts"
    ).innerHTML = related.map(item => `

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

    window.scrollTo(0, 0);
}


function buyNow(id) {

    const product =
        products.find(
            item => String(item.id) === String(id)
        );

    if (!product) {
        alert("Product nahi mila.");
        return;
    }

    addToCart(id);

    showCart();
}


// ============================================
// CART
// ============================================

function addToCart(id) {

    const product =
        products.find(
            item => String(item.id) === String(id)
        );

    if (!product) {
        alert("Product nahi mila.");
        return;
    }

    const existing =
        cart.find(
            item =>
                String(item.productId) === String(id)
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


function removeFromCart(id) {

    cart =
        cart.filter(
            item =>
                String(item.productId) !== String(id)
        );

    saveCart();

    renderCart();
}


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
                product.price * quantity;

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
        "Checkout system payment + customer details ke saath next step me connect hoga."
    );
}


// ============================================
// OWNER PASSWORD LOGIN
// ============================================

function ownerAccess() {

    hideSections();

    const loginSection =
        document.getElementById("ownerLoginSection");

    if (!loginSection) return;

    loginSection.classList.remove("hidden");

    const password =
        document.getElementById("ownerPassword");

    if (password) {
        password.value = "";
        password.focus();
    }

    const message =
        document.getElementById("ownerLoginMessage");

    if (message) {
        message.textContent = "";
    }

    window.scrollTo(0, 0);
}


// ============================================
// OWNER PASSWORD LOGIN
// ============================================

async function ownerPasswordLogin() {

    const passwordInput =
        document.getElementById("ownerPassword");

    const message =
        document.getElementById("ownerLoginMessage");

    if (!passwordInput) return;

    const password =
        passwordInput.value.trim();

    if (!password) {

        if (message) {
            message.textContent =
                "❌ Password enter karo.";
        }

        return;
    }

    try {

        const response =
            await fetch(
                `${API_URL}/api/owner/login`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        password: password
                    })
                }
            );

        const data =
            await response.json();

        if (!response.ok || !data.success) {

            if (message) {
                message.textContent =
                    "❌ Wrong owner password.";
            }

            return;
        }

        if (message) {
            message.textContent =
                "✅ Login successful.";
        }

        sessionStorage.setItem(
            "kitkit_owner_logged_in",
            "true"
        );

        setTimeout(() => {
            showOwnerDashboard();
        }, 300);

    } catch (error) {

        console.error(
            "Owner Login Error:",
            error
        );

        if (message) {
            message.textContent =
                "❌ Backend se connection nahi ho raha.";
        }
    }
}


// ============================================
// OWNER DASHBOARD
// ============================================

function showOwnerDashboard() {

    hideSections();

    document
        .getElementById("ownerSection")
        .classList.remove("hidden");

    window.scrollTo(0, 0);
}


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

function ownerProducts() {

    showOwnerContent(
        "📦 Products",
        `
        <p>
            Yahan products manage kiye jayenge.
        </p>

        <button onclick="addProduct()">
            ➕ Add Product
        </button>
        `
    );
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


// ============================================
// SAVE PRODUCT
// ============================================

async function saveNewProduct() {

    const name =
        document
            .getElementById("newProductName")
            .value
            .trim();

    const price =
        Number(
            document
                .getElementById("newProductPrice")
                .value
        );

    const mrp =
        Number(
            document
                .getElementById("newProductMRP")
                .value
        );

    const image =
        document
            .getElementById("newProductImage")
            .value
            .trim();

    const description =
        document
            .getElementById("newProductDescription")
            .value
            .trim();


    if (!name || !price) {

        alert(
            "Product name aur price required hai."
        );

        return;
    }


    try {

        const response =
            await fetch(
                `${API_URL}/api/products`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        name: name,
                        price: price,
                        image: image,
                        description: description,
                        category: "Clothing",
                        stock: 0
                    })
                }
            );

        const data =
            await response.json();


        if (!response.ok || !data.success) {

            throw new Error(
                data.message || "Product save failed"
            );
        }


        alert(
            "✅ Product database me save ho gaya."
        );


        await loadProducts();

        showOwnerContent(
            "📦 Products",
            `
            <p>
                Product successfully added.
            </p>

            <button onclick="addProduct()">
                ➕ Add Another Product
            </button>
            `
        );


    } catch (error) {

        console.error(
            "Add Product Error:",
            error
        );

        alert(
            "❌ Product save nahi hua."
        );
    }
}


// ============================================
// CUSTOMER ORDERS
// ============================================

async function customerOrders() {

    try {

        const response =
            await fetch(
                `${API_URL}/api/orders`
            );

        const orders =
            await response.json();


        if (!Array.isArray(orders) || !orders.length) {

            showOwnerContent(
                "🛒 Customer Orders",
                "<p>No orders found.</p>"
            );

            return;
        }


        const html =
            orders.map(order => `

                <div class="dashboard-card">

                    <h3>
                        Order #${order.id}
                    </h3>

                    <p>
                        Customer:
                        ${order.customer_name || "Unknown"}
                    </p>

                    <p>
                        Mobile:
                        ${order.customer_mobile || "N/A"}
                    </p>

                    <p>
                        Total:
                        ₹${order.total}
                    </p>

                    <p>
                        Status:
                        ${order.status}
                    </p>

                    <p>
                        Address:
                        ${order.address || "N/A"}
                    </p>

                </div>

            `).join("");


        showOwnerContent(
            "🛒 Customer Orders",
            html
        );


    } catch (error) {

        console.error(error);

        showOwnerContent(
            "🛒 Customer Orders",
            "<p>Orders load nahi ho paye.</p>"
        );
    }
}


// ============================================
// SHIPPING
// ============================================

function shipping() {

    showOwnerContent(
        "🚚 Shipping",
        `
        <p>
            Shipping status orders ke saath manage kiya jayega.
        </p>
        `
    );
}


// ============================================
// COMPLAINTS
// ============================================

async function complaintsOwner() {

    try {

        const response =
            await fetch(
                `${API_URL}/api/complaints`
            );

        const complaints =
            await response.json();


        if (
            !Array.isArray(complaints) ||
            !complaints.length
        ) {

            showOwnerContent(
                "📝 Complaints",
                "<p>No complaints found.</p>"
            );

            return;
        }


        const html =
            complaints.map(item => `

                <div class="dashboard-card">

                    <h3>
                        Complaint #${item.id}
                    </h3>

                    <p>
                        Name:
                        ${item.customer_name || "N/A"}
                    </p>

                    <p>
                        Mobile:
                        ${item.mobile || "N/A"}
