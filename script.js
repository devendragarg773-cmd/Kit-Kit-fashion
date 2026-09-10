// ============================================
// BACKEND URL
// ============================================

// Replit par backend run hone ke baad
// yahan apna actual backend URL lagana hai.

const API_URL = "https://kit-kit-fashion-0kci.onrender.com";


/* ===========================================
   PRODUCTS
=========================================== */

let products = [
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


/* ===========================================
   CART
=========================================== */

let cart =
    JSON.parse(
        localStorage.getItem(
            "kitkit_cart"
        ) || "[]"
    );


function saveCart() {

    localStorage.setItem(
        "kitkit_cart",
        JSON.stringify(cart)
    );

    updateCartCount();
}


function updateCartCount() {

    const count =
        cart.reduce(
            (total, item) =>
                total + item.quantity,
            0
        );

    document.getElementById(
        "cartCount"
    ).textContent = count;
}


/* ===========================================
   PAGE NAVIGATION
=========================================== */

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


/* ===========================================
   PRODUCTS
=========================================== */

async function loadProducts() {

    // Backend connected hone ke baad
    // database ke products yahan se aayenge.

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
            throw new Error(
                "Products load failed"
            );
        }

        const backendProducts =
            await response.json();

        if (
            Array.isArray(
                backendProducts
            ) &&
            backendProducts.length
        ) {

            products =
                backendProducts;
        }

    } catch (error) {

        console.error(error);

    }

    renderProducts();
}


function renderProducts() {

    const box =
        document.getElementById(
            "products"
        );

    box.innerHTML = products
        .map(product => `

            <article
                class="product-card"
            >

                <img
                    src="${product.image || ""}"
                    alt="${product.name}"
                >

                <h3>
                    ${product.name}
                </h3>

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
                    onclick="addToCart('${product.id}')"
                >
                    Add To Cart
                </button>

            </article>

        `)
        .join("");
}


/* ===========================================
   PRODUCT PAGE
=========================================== */

function openProduct(id) {

    const product =
        products.find(
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

            <h1>
                ${product.name}
            </h1>

            <p>
                ★ ${product.rating || 0}
            </p>

            <p class="price">
                ₹${product.price}
                <del class="muted">
                    ₹${product.mrp}
                </del>
            </p>

            <p>
                ${product.description || ""}
            </p>

            <p>
                Size:
                S / M / L / XL
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


    const related =
        products
            .filter(
                item =>
                    item.id !== product.id
            )
            .slice(0, 4);


    document
        .getElementById(
            "relatedProducts"
        )
        .innerHTML = related
        .map(item => `

            <article
                class="product-card"
                onclick="openProduct('${item.id}')"
            >

                <img
                    src="${item.image || ""}"
                    alt="${item.name}"
                >

                <h3>
                    ${item.name}
                </h3>

                <p class="price">
                    ₹${item.price}
                </p>

            </article>

        `)
        .join("");

    window.scrollTo(0, 0);
}


function buyNow(id) {

    addToCart(id);

    showCart();
}


/* ===========================================
   CART
=========================================== */

function addToCart(id) {

    const product =
        products.find(
            item => item.id === id
        );

    if (!product) return;


    const existing =
        cart.find(
            item =>
                item.productId === id
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

    alert(
        "Product cart me add ho gaya."
    );
}


function removeFromCart(id) {

    cart =
        cart.filter(
            item =>
                item.productId !== id
        );

    saveCart();

    renderCart();
}


function renderCart() {

    const box =
        document.getElementById(
            "cartItems"
        );

    if (!cart.length) {

        box.innerHTML =
            "<p class='muted'>Your cart is empty.</p>";

        document.getElementById(
            "cartTotal"
        ).textContent = "";

        return;
    }


    let total = 0;


    box.innerHTML =
        cart.map(item => {

            const product =
                products.find(
                    p =>
                        p.id ===
                        item.productId
                );

            if (!product) return "";


            total +=
                product.price *
                item.quantity;


            return `

                <div class="cart-item">

                    <h3>
                        ${product.name}
                    </h3>

                    <p>
                        ₹${product.price}
                        ×
                        ${item.quantity}
                    </p>

                    <button
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


/* ===========================================
   CHECKOUT
=========================================== */

async function checkout() {

    if (!cart.length) {

        alert(
            "Cart empty hai."
        );

        return;
    }


    alert(
        "Checkout ke liye customer login/OTP required hoga."
    );

    // Real order API yahan connect hogi.
}


/* ===========================================
   OWNER ACCESS
=========================================== */

function ownerAccess() {

    const mobile =
        prompt(
            "Registered owner mobile number:"
        );

    if (!mobile) return;


    const otp =
        prompt(
            "OTP enter karo:"
        );


    // DEMO ONLY
    // Real production OTP backend se verify hoga.

    if (otp === "123456") {

        showOwner();

    } else {

        alert(
            "Wrong OTP."
        );
    }
}


/* ===========================================
   SETTINGS
=========================================== */

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
        "Complaint submit ho gayi (backend connection ke baad database me save hogi)."
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

    document
        .getElementById("products")
        .scrollIntoView({
            behavior: "smooth"
        });
}


/* ===========================================
   START
=========================================== */

updateCartCount();

showHome();
