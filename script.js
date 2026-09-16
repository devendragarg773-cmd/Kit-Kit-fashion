// ============================================
// KIT KIT FASHION
// ============================================

const API_URL = "";


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

    const count = cart.reduce(
        (total, item) => total + item.quantity,
        0
    );

    document.getElementById("cartCount").textContent = count;
}


// ============================================
// NAVIGATION
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

    window.scrollTo(0, 0);

    loadProducts();
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

function showOwner() {

    hideSections();

    document
        .getElementById("ownerSection")
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

        const response = await fetch(
            `${API_URL}/api/products`
        );

        if (!response.ok) {
            throw new Error("Products load failed");
        }

        const backendProducts = await response.json();

        if (
            Array.isArray(backendProducts) &&
            backendProducts.length
        ) {
            products = backendProducts;
        }

    } catch (error) {
        console.error(error);
    }

    renderProducts();
}


function renderProducts() {

    const box = document.getElementById("products");

    box.innerHTML = products.map(product => `

        <article class="product-card">

            <img
                src="${product.image || ""}"
                alt="${product.name}"
            >

            <h3>${product.name}</h3>

            <p class="muted">
                ★ ${product.rating || 0}
            </p>

            <p>
                ${product.description || ""}
            </p>

            <p class="price">
                ₹${product.price}
            </p>

            <button
                class="primary-btn"
                onclick="openProduct('${product.id}')"
            >
                View Product
            </button>

            <button
                class="back-btn"
                onclick="addToCart('${product.id}')"
            >
                Add To Cart
            </button>

        </article>

    `).join("");
}


// ============================================
// PRODUCT PAGE
// ============================================

function openProduct(id) {

    const product = products.find(
        item => item.id === id
    );

    if (!product) return;

    hideSections();

    document
        .getElementById("productSection")
        .classList.remove("hidden");

    document
        .getElementById("productDetail")
        .innerHTML = `

        <div class="product-card">

            <img
                src="${product.image || ""}"
                alt="${product.name}"
            >

            <h1>${product.name}</h1>

            <p>★ ${product.rating || 0}</p>

            <p class="price">
                ₹${product.price}

                <del class="muted">
                    ₹${product.mrp}
                </del>
            </p>

            <p>${product.description || ""}</p>

            <p>
                Size: S / M / L / XL
            </p>

            <p>
                Delivery available
            </p>

            <button
                class="primary-btn"
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

    const related = products
        .filter(item => item.id !== product.id)
        .slice(0, 4);

    document
        .getElementById("relatedProducts")
        .innerHTML = related.map(item => `

            <article
                class="product-card"
                onclick="openProduct('${item.id}')"
            >

                <img
                    src="${item.image || ""}"
                    alt="${item.name}"
                >

                <h3>${item.name}</h3>

                <p class="price">
                    ₹${item.price}
                </p>

            </article>

        `).join("");

    window.scrollTo(0, 0);
}


function buyNow(id) {
    addToCart(id);
    showCart();
}


// ============================================
// CART
// ============================================

function addToCart(id) {

    const product = products.find(
        item => item.id === id
    );

    if (!product) return;

    const existing = cart.find(
        item => item.productId === id
    );

    if (existing) {
        existing.quantity++;
    } else {
        cart.push({
            productId: id,
            quantity: 1
        });
    }

    saveCart();

    alert("Product cart me add ho gaya.");
}


function removeFromCart(id) {

    cart = cart.filter(
        item => item.productId !== id
    );

    saveCart();

    renderCart();
}


function renderCart() {

    const box = document.getElementById("cartItems");

    if (!cart.length) {

        box.innerHTML =
            "<p class='muted'>Your cart is empty.</p>";

        document.getElementById(
            "cartTotal"
        ).textContent = "";

        return;
    }

    let total = 0;

    box.innerHTML = cart.map(item => {

        const product = products.find(
            p => p.id === item.productId
        );

        if (!product) return "";

        total +=
            product.price * item.quantity;

        return `

            <div class="cart-item">

                <h3>${product.name}</h3>

                <p>
                    ₹${product.price}
                    ×
                    ${item.quantity}
                </p>

                <button
                    class="back-btn"
                    onclick="removeFromCart('${product.id}')"
                >
                    Remove
                </button>

            </div>
        `;

    }).join("");

    document.getElementById(
        "cartTotal"
    ).textContent =
        "Total: ₹" + total;
}


function checkout() {

    if (!cart.length) {
        alert("Cart empty hai.");
        return;
    }

    alert(
        "Checkout page ready hai. Payment/order system baad me connect kiya ja sakta hai."
    );
}


// ============================================
// OWNER ACCESS
// ============================================

function ownerAccess() {

    const password = prompt(
        "🔐 Owner Password enter karo:"
    );

    if (password === null) return;

    // Demo password
    if (password === "123456") {

        showOwner();

    } else {

        alert("❌ Wrong Owner Password.");
    }
}


// ============================================
// OWNER DASHBOARD PAGES
// ============================================

const ownerPages = {

    products: {
        title: "👕 Products",
        content: `
            <p>Yahan aap store ke products manage kar sakte ho.</p>

            <button class="primary-btn"
                onclick="alert('Product list refresh ho gayi.')">
                Refresh Products
            </button>

            <button class="primary-btn"
                onclick="openOwnerPage('addProduct')">
                Add New Product
            </button>
        `
    },

    addProduct: {
        title: "➕ Add Product",
        content: `
            <form class="owner-form"
                onsubmit="addDemoProduct(event)">

                <input
                    id="newName"
                    placeholder="Product Name"
                    required
                >

                <input
                    id="newPrice"
                    type="number"
                    placeholder="Price"
                    required
                >

                <input
                    id="newMrp"
                    type="number"
                    placeholder="MRP"
                    required
                >

                <input
                    id="newImage"
                    placeholder="Image URL"
                    required
                >

                <textarea
                    id="newDescription"
                    placeholder="Product Description"
                    required
                ></textarea>

                <button class="primary-btn">
                    Add Product
                </button>

            </form>
        `
    },

    orders: {
        title: "📦 Customer Orders",
        content: `
            <p>No new orders available.</p>

            <button class="primary-btn"
                onclick="alert('Orders refreshed.')">
                Refresh Orders
            </button>
        `
    },

    shipping: {
        title: "🚚 Shipping",
        content: `
            <p>Manage shipping status here.</p>

            <select class="owner-form">
                <option>Processing</option>
                <option>Packed</option>
                <option>Shipped</option>
                <option>Delivered</option>
            </select>

            <button class="primary-btn"
                onclick="alert('Shipping status saved.')">
                Save Status
            </button>
        `
    },

    complaints: {
        title: "📝 Complaints",
        content: `
            <p>No complaints available.</p>

            <button class="primary-btn"
                onclick="alert('Complaints refreshed.')">
                Refresh
            </button>
        `
    },

    customers: {
        title: "👥 Customers",
        content: `
            <p>Customer management page.</p>

            <button class="primary-btn"
                onclick="alert('Customer list refreshed.')">
                View Customers
            </button>
        `
    },

    offers: {
        title: "🏷️ Offers",
        content: `
            <form class="owner-form"
                onsubmit="saveOffer(event)">

                <input
                    id="offerName"
                    placeholder="Offer Name"
                    required
                >

                <input
                    id="offerDiscount"
                    type="number"
                    placeholder="Discount %"
                    required
                >

                <button class="primary-btn">
                    Save Offer
                </button>

            </form>
        `
    },

    arrivals: {
        title: "✨ New Arrivals",
        content: `
            <p>New arrivals management page.</p>

            <button class="primary-btn"
                onclick="alert('New arrivals updated.')">
                Update Arrivals
            </button>
        `
    },

    coins: {
        title: "🪙 ND's Coins",
        content: `
            <h3>Current Reward Rule</h3>

            <p>
                Every ₹200 eligible purchase = 8 ND's Coins.
            </p>

            <button class="primary-btn"
                onclick="alert('Coin settings saved.')">
                Save Coin Settings
            </button>
        `
    },

    storeSettings: {
        title: "⚙️ Store Settings",
        content: `
            <form class="owner-form"
                onsubmit="saveStore(event)">

                <input
                    id="storeName"
                    value="Kit Kit Fashion"
                    placeholder="Store Name"
                    required
                >

                <input
                    id="storePhone"
                    placeholder="Store Phone"
                    required
                >

                <input
                    id="storeLocation"
                    placeholder="Store Location"
                    required
                >

                <button class="primary-btn">
                    Save Store Settings
                </button>

            </form>
        `
    },

    sales: {
        title: "📊 Sales",
        content: `
            <h3>Sales Overview</h3>

            <p>
                Total Products: ${products.length}
            </p>

            <p>
                Cart Items: ${cart.length}
            </p>

            <button class="primary-btn"
                onclick="alert('Sales report generated.')">
                Generate Report
            </button>
        `
    },

    notifications: {
        title: "🔔 Notifications",
        content: `
            <form class="owner-form"
                onsubmit="sendNotification(event)">

                <input
                    id="notificationTitle"
                    placeholder="Notification Title"
                    required
                >

                <textarea
                    id="notificationMessage"
                    placeholder="Notification Message"
                    required
                ></textarea>

                <button class="primary-btn">
                    Send Notification
                </button>

            </form>
        `
    }

};


// ============================================
// OPEN OWNER PAGE
// ============================================

function openOwnerPage(page) {

    const data = ownerPages[page];

    if (!data) return;

    hideSections();

    document
        .getElementById("ownerPageSection")
        .classList.remove("hidden");

    document
        .getElementById("ownerPageContent")
        .innerHTML = `

        <div class="owner-page-box">

            <h1>${data.title}</h1>

            ${data.content}

        </div>
    `;

    window.scrollTo(0, 0);
}


// ============================================
// OWNER PAGE ACTIONS
// ============================================

function addDemoProduct(event) {

    event.preventDefault();

    const name =
        document.getElementById("newName").value;

    const price =
        Number(document.getElementById("newPrice").value);

    const mrp =
        Number(document.getElementById("newMrp").value);

    const image =
        document.getElementById("newImage").value;

    const description =
        document.getElementById("newDescription").value;

    products.push({
        id: Date.now().toString(),
        name,
        price,
        mrp,
        rating: 5,
        image,
        description
    });

    alert("✅ Product successfully added.");

    openOwnerPage("products");
}


function saveOffer(event) {

    event.preventDefault();

    const name =
        document.getElementById("offerName").value;

    const discount =
        document.getElementById("offerDiscount").value;

    localStorage.setItem(
        "kitkit_offer",
        JSON.stringify({
            name,
            discount
        })
    );

    alert("✅ Offer saved successfully.");
}


function saveStore(event) {

    event.preventDefault();

    localStorage.setItem(
        "kitkit_store",
        JSON.stringify({
            name: document.getElementById("storeName").value,
            phone: document.getElementById("storePhone").value,
            location: document.getElementById("storeLocation").value
        })
    );

    alert("✅ Store settings saved.");
}


function sendNotification(event) {

    event.preventDefault();

    alert("🔔 Notification created successfully.");
}


// ============================================
// SETTINGS PAGES
// ============================================

function helpDesk() {

    alert(
        "☎ Helpline\n\nCustomer support is available here."
    );
}


function complaint() {

    const message = prompt(
        "📝 Complaint / Feedback likho:"
    );

    if (!message) return;

    localStorage.setItem(
        "kitkit_complaint",
        message
    );

    alert("✅ Complaint / Feedback submit ho gaya.");
}


function myOrders() {

    alert(
        "📦 My Orders\n\nAbhi koi order available nahi hai."
    );
}


function storeLocation() {

    alert(
        "📍 Store Location\n\nStore location yahan add ki ja sakti hai."
    );
}


function aboutUs() {

    alert(
        "ℹ Kit Kit Fashion\n\nYour stylish everyday clothing store."
    );
}


function privacy() {

    alert(
        "🔒 Privacy Policy & Terms\n\nYour information should be handled responsibly."
    );
}


// ============================================
// SCROLL
// ============================================

function scrollToProducts() {

    document
        .getElementById("products")
        .scrollIntoView({
            behavior: "smooth"
        });
}


// ============================================
// START
// ============================================

updateCartCount();
showHome();process.on("uncaughtException", (err) => {
    console.error("UNCAUGHT ERROR:", err);
});

process.on("unhandledRejection", (err) => {
    console.error("UNHANDLED REJECTION:", err);
});
