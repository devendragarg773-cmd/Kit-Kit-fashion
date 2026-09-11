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

    const element = document.getElementById("cartCount");

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

    const home = document.getElementById("homeSection");

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
// PRODUCTS
// ============================================

async function loadProducts() {

    try {

        const response = await fetch(
            `${API_URL}/api/products`
        );

        if (!response.ok) {
            throw new Error("Products load failed");
        }

        const backendProducts =
            await response.json();

        if (
            Array.isArray(backendProducts) &&
            backendProducts.length > 0
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
                ${
                    product.mrp
                    ? `<del class="muted">₹${product.mrp}</del>`
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
                ${
                    product.mrp
                    ? `<del class="muted">₹${product.mrp}</del>`
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
        document.getElementById("relatedProducts");

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
                Number(product.price) * quantity;

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
        "Checkout system payment/customer details ke saath next step me connect hoga."
    );
}


// ============================================
// OWNER LOGIN - PASSWORD
// ============================================

function ownerAccess() {

    hideSections();

    const loginSection =
        document.getElementById(
            "ownerLoginSection"
        );

    if (!loginSection) return;

    loginSection.classList.remove("hidden");

    const mobile =
        document.getElementById("ownerMobile");

    const password =
        document.getElementById("ownerPassword");

    const message =
        document.getElementById(
            "ownerLoginMessage"
        );

    if (mobile) {
        mobile.value = OWNER_MOBILE;
        mobile.readOnly = true;
    }

    if (password) {
        password.value = "";
    }

    if (message) {
        message.textContent = "";
    }

    window.scrollTo(0, 0);
}


async function ownerLogin() {

    const mobileElement =
        document.getElementById("ownerMobile");

    const passwordElement =
        document.getElementById("ownerPassword");

    const messageElement =
        document.getElementById(
            "ownerLoginMessage"
        );

    if (!mobileElement || !passwordElement) {

        console.error(
            "Owner login fields missing in HTML."
        );

        return;
    }

    const mobile =
        mobileElement.value.trim();

    const password =
        passwordElement.value;

    if (mobile !== OWNER_MOBILE) {

        if (messageElement) {

            messageElement.textContent =
                "❌ Owner mobile number valid nahi hai.";
        }

        return;
    }

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
                        mobile: mobile,
                        password: password
                    })
                }
            );

        const data =
            await response.json();

        if (!response.ok) {

            throw new Error(
                data.message ||
                "Login failed"
            );
        }

        if (data.success) {

            sessionStorage.setItem(
                "kitkit_owner_logged_in",
                "true"
            );

            if (messageElement) {

                messageElement.textContent =
                    "✅ Owner login successful.";
            }

            alert(
                "✅ Owner Login Successful"
            );

            showOwnerDashboard();

        } else {

            throw new Error(
                data.message ||
                "Login failed"
            );
        }

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
                    "Wrong password"
                );
        }
    }
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
        <p>Products backend database se load ho rahe hain.</p>

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

    const mrp =
        Number(
            document.getElementById(
                "newProductMRP"
            ).value
        );

    const image =
        document.getElementById(
            "newProductImage"
        ).value.trim();

    const category =
        document.getElementById(
            "newProductCategory"
        ).value.trim();

    const stock =
        Number(
            document.getElementById(
                "newProductStock"
            ).value
        );

    const description =
        document.getElementById(
            "newProductDescription"
        ).value.trim();

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
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({

                        name: name,

                        price: price,

                        image: image,

                        description: description,

                        category: category,

                        stock: stock

                    })
                }
            );

        const data =
            await response.json();

        if (!response.ok) {

            throw new Error(
                data.message ||
                "Product add failed"
            );
        }

        alert(
            "✅ Product database me save ho gaya."
        );

        await loadProducts();

        ownerProducts();

    } catch (error) {

        console.error(error);

        alert(
            "❌ Product save nahi hua."
        );
    }
}


// ============================================
// CUSTOMER ORDERS
// ============================================

async function customerOrders() {

    showOwnerContent(
        "🛒 Customer Orders",
        `
        <p>Orders database se load ho rahe hain...</p>

        <div id="ordersList"></div>
        `
    );

    loadOrders();
}


async function loadOrders() {

    const box =
        document.getElementById(
            "ordersList"
        );

    if (!box) return;

    try {

        const response =
            await fetch(
                `${API_URL}/api/orders`
            );

        if (!response.ok) {

            throw new Error(
                "Orders load failed"
            );
        }

        const orders =
            await response.json();

        if (!Array.isArray(orders) || !orders.length) {

            box.innerHTML =
                "<p>No orders found.</p>";

            return;
        }

        box.innerHTML =
            orders.map(order => `

                <div class="cart-item">

                    <h3>
                        Order #${order.id}
                    </h3>

                    <p>
                        Customer:
                        ${order.customer_name || "Guest"}
                    </p>

                    <p>
                        Mobile:
                        ${order.customer_mobile || "-"}
                    </p>

                    <p>
                        Total:
                        ₹${order.total}
                    </p>

                    <p>
                        Status:
                        ${order.status}
                    </p>

                    <button
                        onclick="updateOrderStatus(${order.id}, 'Shipped')"
                    >
                        Mark Shipped
                    </button>

                    <button
                        onclick="updateOrderStatus(${order.id}, 'Delivered')"
                    >
                        Mark Delivered
                    </button>

                </div>

            `).join("");

    } catch (error) {

        console.error(error);

        box.innerHTML =
            "<p>Orders load nahi ho paye.</p>";
    }
}


async function updateOrderStatus(id, status) {

    try {

        const response =
            await fetch(
                `${API_URL}/api/orders/${id}/status`,
                {
                    method: "PUT",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({
                        status: status
                    })
                }
            );

        const data =
            await response.json();

        if (!response.ok) {

            throw new Error(
                data.message ||
                "Status update failed"
            );
        }

        alert(
            "✅ Order status updated."
        );

        loadOrders();

    } catch (error) {

        console.error(error);

        alert(
            "❌ Status update nahi hua."
        );
    }
}


// ============================================
// SHIPPING
// ============================================

function shipping() {

    customerOrders();
}


// ============================================
// OWNER COMPLAINTS
// ============================================

async function complaintsOwner() {

    showOwnerContent(
        "📝 Complaints",
        `
        <p>Complaints database se load ho rahi hain...</p>

        <div id="complaintsList"></div>
        `
    );

    loadComplaints();
}


async function loadComplaints() {

    const box =
        document.getElementById(
            "complaintsList"
        );

    if (!box) return;

    try {

        const response =
            await fetch(
                `${API_URL}/api/complaints`
            );

        if (!response.ok) {

            throw new Error(
                "Complaints load failed"
            );
        }

        const complaints =
            await response.json();

        if (
            !Array.isArray(complaints) ||
            !complaints.length
        ) {

            box.innerHTML =
                "<p>No complaints found.</p>";

            return;
        }

        box.innerHTML =
            complaints.map(complaint => `

                <div class="cart-item">

                    <h3>
                        Complaint #${complaint.id}
                    </h3>

                    <p>
                        Name:
                        ${complaint.customer_name || "-"}
                    </p>

                    <p>
                        Mobile:
                        ${complaint.mobile || "-"}
                    </p>

                    <p>
                        Message:
                        ${complaint.message}
                    </p>

                    <p>
                        Status:
                        ${complaint.status}
                    </p>

                </div>

            `).join("");

    } catch (error) {

        console.error(error);

        box.innerHTML =
            "<p>Complaints load nahi hui.</p>";
    }
}


// ============================================
// CUSTOMERS
// ============================================

async function customers() {

    showOwnerContent(
        "👥 Customers",
        `
        <p>Customers database se load ho rahe hain...</p>

        <div id="customersList"></div>
        `
    );

    loadCustomers();
}


async function loadCustomers() {

    const box =
        document.getElementById(
            "customersList"
        );

    if (!box) return;

    try {

        const response =
            await fetch(
                `${API_URL}/api/customers`
            );

        if (!response.ok) {

            throw new Error(
                "Customers load failed"
            );
        }

        const data =
            await response.json();

        if (!Array.isArray(data) || !data.length) {

            box.innerHTML =
                "<p>No customers found.</p>";

            return;
        }

        box.innerHTML =
            data.map(customer => `

                <div class="cart-item">

                    <h3>
                        ${customer.name || "Customer"}
                    </h3>

                    <p>
                        Mobile:
                        ${customer.mobile || "-"}
                    </p>

                    <p>
                        Email:
                        ${customer.email || "-"}
                    </p>

                </div>

            `).join("");

    } catch (error) {

        console.error(error);

        box.innerHTML =
            "<p>Customers load nahi hue.</p>";
    }
}


// ============================================
// OFFERS
// ============================================

function offers() {

    showOwnerContent(
        "🏷️ Offers",
        `
        <input
            id="offerName"
            placeholder="Offer name"
        >

        <input
            id="offerDiscount"
            placeholder="Discount"
        >

        <button
            class="primary-btn"
            onclick="saveOffer()"
        >
            Save Offer
        </button>

        <p id="offerMessage"></p>
        `
    );
}


function saveOffer() {

    const name =
        document.getElementById(
            "offerName"
        ).value.trim();

    const discount =
        document.getElementById(
            "offerDiscount"
        ).value.trim();

    if (!name || !discount) {

        alert(
            "Offer name aur discount required hai."
        );

        return;
    }

    localStorage.setItem(
        "kitkit_offer",
        JSON.stringify({
            name: name,
            discount: discount
        })
    );

    document.getElementById(
        "offerMessage"
    ).textContent =
        "✅ Offer saved.";
}


// ============================================
// NEW ARRIVALS
// ============================================

function newArrivals() {

    showOwnerContent(
        "🆕 New Arrivals",
        `
        <p>
            New arrival products ko Products section se manage kar sakte ho.
        </p>

        <button
            class="primary-btn"
            onclick="ownerProducts()"
        >
            View Products
        </button>

        <button
            onclick="addProduct()"
        >
            ➕ Add New Arrival
        </button>
        `
    );
}


// ============================================
// ND'S COINS
// ============================================

function ndsCoins() {

    showOwnerContent(
        "🪙 ND's Coins",
        `
        <p>
            ₹200 eligible purchase = 8 ND's Coins.
        </p>

        <p>
            ₹400 = 16 coins
        </p>

        <p>
            ₹600 = 24 coins
        </p>
        `
    );
}


// ============================================
// STORE SETTINGS
// ============================================

function storeSettings() {

    showOwnerContent(
        "⚙️ Store Settings",
        `
        <input
            id="storeName"
            placeholder="Store Name"
            value="Kit Kit Fashion"
        >

        <input
            id="storeHelpline"
            placeholder="Helpline Number"
        >

        <input
            id="storeLocation"
            placeholder="Store Location"
        >

        <button
            class="primary-btn"
            onclick="saveStoreSettings()"
        >
            Save Settings
        </button>

        <p id="storeSettingsMessage"></p>
        `
    );
}


function saveStoreSettings() {

    const name =
        document.getElementById(
            "storeName"
        ).value.trim();

    const helpline =
        document.getElementById(
            "storeHelpline"
        ).value.trim();

    const location =
        document.getElementById(
            "storeLocation"
        ).value.trim();

    localStorage.setItem(
        "kitkit_store_settings",
        JSON.stringify({
            name,
            helpline,
            location
        })
    );

    document.getElementById(
        "storeSettingsMessage"
    ).textContent =
        "✅ Store settings saved.";
}


// ============================================
// SALES
// ============================================

async function sales() {

    showOwnerContent(
        "📊 Sales",
        `
        <p>Sales data load ho raha hai...</p>

        <div id="salesData"></div>
        `
    );

    loadSales();
}


async function loadSales() {

    const box =
        document.getElementById(
            "salesData"
        );

    if (!box) return;

    try {

        const response =
            await fetch(
                `${API_URL}/api/sales`
            );

        if (!response.ok) {

            throw new Error(
                "Sales load failed"
            );
        }

        const data =
            await response.json();

        box.innerHTML = `

            <div class="cart-item">

                <h3>
                    📦 Total Orders
                </h3>

                <p>
                    ${data.total_orders || 0}
                </p>

            </div>

            <div class="cart-item">

                <h3>
                    💰 Total Sales
                </h3>

                <p>
                    ₹${data.total_sales || 0}
                </p>

            </div>

        `;

    } catch (error) {

        console.error(error);

        box.innerHTML =
            "<p>Sales data load nahi hua.</p>";
    }
}


// ============================================
// NOTIFICATIONS
// ============================================

function notifications() {

    showOwnerContent(
        "🔔 Notifications",
        `
        <textarea
            id="notificationMessage"
            placeholder="Notification message"
        ></textarea>

        <button
            class="primary-btn"
            onclick="saveNotification()"
        >
            Save Notification
        </button>

        <p id="notificationStatus"></p>
        `
    );
}


function saveNotification() {

    const message =
        document.getElementById(
            "notificationMessage"
        ).value.trim();

    if (!message) {

        alert(
            "Notification message likho."
        );

        return;
    }

    localStorage.setItem(
        "kitkit_notification",
        message
    );

    document.getElementById(
        "notificationStatus"
    ).textContent =
        "✅ Notification saved.";
}


// ============================================
// OWNER CONTENT
// ============================================

function showOwnerContent(title, content) {

    const box =
        document.getElementById(
            "ownerContent"
        );

    if (!box) return;

    box.innerHTML = `

        <div class="dashboard-card">

            <h2>
                ${title}
            </h2>

            ${content}

        </div>

    `;

    box.scrollIntoView({
        behavior: "smooth"
    });
}


// ============================================
// CUSTOMER SETTINGS
// ============================================

function helpDesk() {

    alert(
        "Kit Kit Fashion Helpline: 9530450140"
    );
}


async function complaint() {

    const message =
        prompt(
            "Complaint / Feedback likho:"
        );

    if (!message) return;

    try {

        const response =
            await fetch(
                `${API_URL}/api/complaints`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({

                        customer_name:
                            "Website Customer",

                        mobile: "",

                        message: message

                    })
                }
            );

        const data =
            await response.json();

        if (!response.ok) {

            throw new Error(
                data.message ||
                "Complaint failed"
            );
        }

        alert(
            "✅ Complaint successfully submit ho gayi."
        );

    } catch (error) {

        console.error(error);

        alert(
            "❌ Complaint submit nahi hui."
        );
    }
}


async function myOrders() {

    alert(
        "Customer order history system next step me connect hoga."
    );
}


async function storeLocation() {

    const saved =
        localStorage.getItem(
            "kitkit_store_settings"
        );

    if (saved) {

        const settings =
            JSON.parse(saved);

        alert(
            "📍 Store Location: " +
            (settings.location || "Not set")
        );

    } else {

        alert(
            "📍 Store location abhi set nahi hai."
        );
    }
}


function aboutUs() {

    alert(
        "Kit Kit Fashion — Clothing Store"
    );
}


function privacy() {

    alert(
        "Privacy Policy and Terms of Service."
    );
}


// ============================================
// SCROLL
// ============================================

function scrollToProducts() {

    const productsBox =
        document.getElementById(
            "products"
        );

    if (!productsBox) return;

    productsBox.scrollIntoView({
        behavior: "smooth"
    });
}


// ============================================
// START
// ============================================

updateCartCount();

showHome();
