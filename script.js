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
        "Checkout system backend + customer login ke baad connect hoga."
    );
}


// ============================================
// OWNER LOGIN
// ============================================

function ownerAccess() {

    hideSections();

    document
        .getElementById("ownerLoginSection")
        .classList.remove("hidden");

    document.getElementById(
        "ownerMobile"
    ).value = OWNER_MOBILE;

    document.getElementById(
        "otpBox"
    ).classList.add("hidden");

    document.getElementById(
        "ownerLoginMessage"
    ).textContent = "";

    window.scrollTo(0, 0);
}


async function requestOwnerOTP() {

    const mobile =
        document
            .getElementById("ownerMobile")
            .value.trim();

    if (mobile !== OWNER_MOBILE) {

        document.getElementById(
            "ownerLoginMessage"
        ).textContent =
            "❌ This mobile number is not registered as owner.";

        return;
    }

    try {

        const response =
            await fetch(
                `${API_URL}/api/owner/send-otp`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        mobile: mobile
                    })
                }
            );

        const data =
            await response.json();

        if (!response.ok) {
            throw new Error(
                data.message || "OTP send failed"
            );
        }

        document.getElementById(
            "otpBox"
        ).classList.remove("hidden");

        document.getElementById(
            "ownerLoginMessage"
        ).textContent =
            "✅ OTP send ho gaya. SMS me mila OTP enter karo.";

    } catch (error) {

        console.error(
            "Owner OTP Error:",
            error
        );

        document.getElementById(
            "ownerLoginMessage"
        ).textContent =
            "❌ OTP send nahi ho paya. Backend/MSG91 settings check karo.";
    }
}


async function verifyOwnerOTP() {

    const mobile =
        document
            .getElementById("ownerMobile")
            .value.trim();

    const otp =
        document
            .getElementById("ownerOTP")
            .value.trim();

    if (mobile !== OWNER_MOBILE) {

        alert(
            "Owner mobile number valid nahi hai."
        );

        return;
    }

    if (!otp) {

        alert(
            "OTP enter karo."
        );

        return;
    }

    try {

        const response =
            await fetch(
                `${API_URL}/api/owner/verify-otp`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        mobile: mobile,
                        otp: otp
                    })
                }
            );

        const data =
            await response.json();

        if (!response.ok) {
            throw new Error(
                data.message || "OTP verification failed"
            );
        }

        alert(
            "✅ Owner login successful."
        );

        showOwnerDashboard();

    } catch (error) {

        console.error(
            "OTP Verification Error:",
            error
        );

        alert(
            "❌ OTP verify nahi hua. OTP dobara check karo."
        );
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

    hideSections();

    showSettings();
}


function ownerProducts() {

    showOwnerContent(
        "📦 Products",
        `
        <p>Yahan products manage kiye jayenge.</p>
        <button onclick="addProduct()">➕ Add Product</button>
        `
    );
}


function addProduct() {

    showOwnerContent(
        "➕ Add Product",
        `
        <input id="newProductName" placeholder="Product Name">
        <input id="newProductPrice" type="number" placeholder="Price">
        <input id="newProductMRP" type="number" placeholder="MRP">
        <input id="newProductImage" placeholder="Image URL">
        <textarea id="newProductDescription" placeholder="Description"></textarea>

        <button
            class="primary-btn"
            onclick="saveNewProduct()"
        >
            Save Product
        </button>
        `
    );
}


function saveNewProduct() {

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

    products.push({

        id: Date.now().toString(),

        name,

        price,

        mrp: mrp || price,

        rating: 0,

        image,

        description
    });

    renderProducts();

    alert(
        "Product temporarily add ho gaya. Database me permanently save backend connect hone ke baad hoga."
    );
}


function customerOrders() {

    showOwnerContent(
        "🛒 Customer Orders",
        "<p>Customer orders backend connect hone ke baad yahan dikhenge.</p>"
    );
}


function shipping() {

    showOwnerContent(
        "🚚 Shipping",
        "<p>Shipping status backend connect hone ke baad manage hoga.</p>"
    );
}


function complaintsOwner() {

    showOwnerContent(
        "📝 Complaints",
        "<p>Customer complaints backend database se yahan load hongi.</p>"
    );
}


function customers() {

    showOwnerContent(
        "👥 Customers",
        "<p>Customer information backend login system ke baad yahan dikhegi.</p>"
    );
}


function offers() {

    showOwnerContent(
        "🏷️ Offers",
        `
        <input placeholder="Offer name">
        <input placeholder="Discount">
        <button class="primary-btn">
            Save Offer
        </button>
        `
    );
}


function newArrivals() {

    showOwnerContent(
        "🆕 New Arrivals",
        "<p>New arrival products yahan manage honge.</p>"
    );
}


function ndsCoins() {

    showOwnerContent(
        "🪙 ND's Coins",
        `
        <p>
            ₹200 eligible purchase = 8 ND's Coins.
        </p>
        <p>
            ₹400 = 16 coins, ₹600 = 24 coins.
        </p>
        `
    );
}


function storeSettings() {

    showOwnerContent(
        "⚙️ Store Settings",
        `
        <input placeholder="Store Name">
        <input placeholder="Helpline Number">
        <input placeholder="Store Location">

        <button class="primary-btn">
            Save Settings
        </button>
        `
    );
}


function sales() {

    showOwnerContent(
        "📊 Sales",
        "<p>Sales reports backend/database connect hone ke baad yahan dikhenge.</p>"
    );
}


function notifications() {

    showOwnerContent(
        "🔔 Notifications",
        `
        <textarea placeholder="Notification message"></textarea>

        <button class="primary-btn">
            Send Notification
        </button>
        `
    );
}


function showOwnerContent(title, content) {

    const box =
        document.getElementById("ownerContent");

    if (!box) return;

    box.innerHTML = `

        <div class="dashboard-card">

            <h2>${title}</h2>

            ${content}

        </div>

    `;

    box.scrollIntoView({
        behavior: "smooth"
    });
}


// ============================================
// SETTINGS
// ============================================

function helpDesk() {

    alert(
        "Helpline backend/store settings se connect hogi."
    );
}


async function complaint() {

    const message =
        prompt(
            "Complaint / Feedback likho:"
        );

    if (!message) return;

    alert(
        "Complaint system backend connect hone ke baad database me save hogi."
    );
}


async function myOrders() {

    alert(
        "Customer login ke baad orders yahan load honge."
    );
}


async function storeLocation() {

    alert(
        "Store location backend se load hogi."
    );
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


function scrollToProducts() {

    const productsBox =
        document.getElementById("products");

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
