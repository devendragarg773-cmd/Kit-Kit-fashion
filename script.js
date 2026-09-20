// ===============================
// KIT KIT FASHION - SCRIPT.JS
// ===============================

// बाद में यहाँ अपना Render Backend URL डालेंगे
const API_URL = "";

let products = [];
let selectedProduct = null;
let editingProductId = null;


// ===============================
// BASIC HELPERS
// ===============================

function $(id) {
  return document.getElementById(id);
}

function show(id) {
  $(id)?.classList.remove("hidden");
}

function hide(id) {
  $(id)?.classList.add("hidden");
}

function closeAll() {
  document.querySelectorAll(".modal").forEach(modal => {
    modal.classList.add("hidden");
  });
}

async function api(path, options = {}) {

  if (!API_URL) {
    throw new Error(
      "Backend अभी connect नहीं है। पहले Backend setup करना होगा।"
    );
  }

  const response = await fetch(API_URL + path, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {})
    }
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || "Server error");
  }

  return data;
}


// ===============================
// PAGE CONTROL
// ===============================

function hidePages() {

  [
    "homePage",
    "productPage",
    "cartPage",
    "settingsPage",
    "ownerPage"
  ].forEach(id => hide(id));
}


function showHome() {

  closeAll();
  hidePages();
  show("homePage");

  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
}


function showCart() {

  closeAll();
  hidePages();
  show("cartPage");

  renderCart();
}


function showSettings() {

  closeAll();
  hidePages();
  show("settingsPage");
}


function scrollToProducts() {

  showHome();

  setTimeout(() => {
    $("productsSection")?.scrollIntoView({
      behavior: "smooth"
    });
  }, 100);
}


// ===============================
// LOAD PRODUCTS
// ===============================

async function loadProducts() {

  $("loading").classList.remove("hidden");
  $("noProducts").classList.add("hidden");

  try {

    const data = await api("/api/products");

    products = Array.isArray(data)
      ? data
      : (data.products || []);

    renderProducts();

  } catch (error) {

    console.error(error);

    products = [];

    $("products").innerHTML = `
      <div class="empty">
        <h3>Products load नहीं हो पाए</h3>
        <p>Backend connect होने के बाद products यहाँ दिखाई देंगे.</p>
      </div>
    `;

  } finally {

    $("loading").classList.add("hidden");
  }
}


// ===============================
// PRODUCT CARDS
// ===============================

function renderProducts(list = products) {

  const container = $("products");

  if (!container) return;

  if (!list.length) {

    container.innerHTML = "";

    $("noProducts").classList.remove("hidden");

    return;
  }

  $("noProducts").classList.add("hidden");

  container.innerHTML = list.map(product => {

    const image =
      product.image ||
      product.image_url ||
      "https://via.placeholder.com/500x500?text=Product";

    return `
      <div class="product-card">

        <img
          class="product-image"
          src="${escapeHTML(image)}"
          alt="${escapeHTML(product.name || "Product")}"
          onerror="this.src='https://via.placeholder.com/500x500?text=Product'"
        >

        <div class="product-info">

          <h3>
            ${escapeHTML(product.name || "Product")}
          </h3>

          <div>

            <span class="price">
              ₹${Number(product.price || 0)}
            </span>

            ${
              product.mrp
                ? `<span class="mrp">₹${Number(product.mrp)}</span>`
                : ""
            }

          </div>

          <div class="product-buttons">

            <button onclick="openProduct(${Number(product.id)})">
              View Product
            </button>

            <button onclick="addToCart(${Number(product.id)})">
              Add To Cart
            </button>

            <button onclick="buyNow(${Number(product.id)})">
              Buy Now
            </button>

          </div>

        </div>

      </div>
    `;

  }).join("");
}


// ===============================
// PRODUCT DETAIL
// ===============================

function openProduct(id) {

  const product = products.find(
    p => Number(p.id) === Number(id)
  );

  if (!product) {
    alert("Product नहीं मिला");
    return;
  }

  selectedProduct = product;

  hidePages();
  show("productPage");

  const image =
    product.image ||
    product.image_url ||
    "https://via.placeholder.com/600x600?text=Product";

  $("productDetails").innerHTML = `

    <div class="detail-card">

      <img
        src="${escapeHTML(image)}"
        alt="${escapeHTML(product.name || "Product")}"
      >

      <div class="detail-info">

        <h1>
          ${escapeHTML(product.name || "Product")}
        </h1>

        <p>
          ${escapeHTML(product.description || "No description available.")}
        </p>

        <p>
          Category:
          ${escapeHTML(product.category || "Fashion")}
        </p>

        <div class="detail-price">
          ₹${Number(product.price || 0)}

          ${
            product.mrp
              ? `<span class="mrp">₹${Number(product.mrp)}</span>`
              : ""
          }
        </div>

        <button
          class="primary-btn"
          onclick="addToCart(${Number(product.id)})"
        >
          🛒 Add To Cart
        </button>

        <button
          class="primary-btn"
          onclick="buyNow(${Number(product.id)})"
        >
          Buy Now
        </button>

      </div>

    </div>
  `;


  const related = products
    .filter(p => Number(p.id) !== Number(id))
    .slice(0, 4);

  $("relatedProducts").innerHTML = related.map(p => {

    const img =
      p.image ||
      p.image_url ||
      "https://via.placeholder.com/500x500?text=Product";

    return `
      <div class="product-card">

        <img
          class="product-image"
          src="${escapeHTML(img)}"
        >

        <div class="product-info">

          <h3>${escapeHTML(p.name || "Product")}</h3>

          <div class="price">
            ₹${Number(p.price || 0)}
          </div>

          <div class="product-buttons">

            <button onclick="openProduct(${Number(p.id)})">
              View Product
            </button>

          </div>

        </div>

      </div>
    `;

  }).join("");
}


// ===============================
// CART
// ===============================

function getCart() {

  try {

    return JSON.parse(
      localStorage.getItem("kitkit_cart") || "[]"
    );

  } catch {

    return [];
  }
}


function saveCart(cart) {

  localStorage.setItem(
    "kitkit_cart",
    JSON.stringify(cart)
  );
}


function addToCart(id) {

  const product = products.find(
    p => Number(p.id) === Number(id)
  );

  if (!product) {
    alert("Product नहीं मिला");
    return;
  }

  const cart = getCart();

  const existing = cart.find(
    item => Number(item.id) === Number(id)
  );

  if (existing) {

    existing.quantity =
      Number(existing.quantity || 1) + 1;

  } else {

    cart.push({
      ...product,
      quantity: 1
    });
  }

  saveCart(cart);

  alert("Product cart में add हो गया ✅");
}


function removeFromCart(id) {

  let cart = getCart();

  cart = cart.filter(
    item => Number(item.id) !== Number(id)
  );

  saveCart(cart);

  renderCart();
}


function changeQuantity(id, change) {

  const cart = getCart();

  const item = cart.find(
    p => Number(p.id) === Number(id)
  );

  if (!item) return;

  item.quantity =
    Number(item.quantity || 1) + change;

  if (item.quantity <= 0) {

    const newCart = cart.filter(
      p => Number(p.id) !== Number(id)
    );

    saveCart(newCart);

  } else {

    saveCart(cart);
  }

  renderCart();
}


function renderCart() {

  const cart = getCart();

  const container = $("cartItems");

  if (!container) return;

  if (!cart.length) {

    container.innerHTML = "";

    show("cartEmpty");
    hide("cartSummary");

    return;
  }

  hide("cartEmpty");
  show("cartSummary");

  let total = 0;

  container.innerHTML = cart.map(item => {

    const quantity =
      Number(item.quantity || 1);

    total +=
      Number(item.price || 0) * quantity;

    const image =
      item.image ||
      item.image_url ||
      "https://via.placeholder.com/100x100?text=Product";

    return `

      <div class="cart-item">

        <img src="${escapeHTML(image)}">

        <div>

          <h3>
            ${escapeHTML(item.name || "Product")}
          </h3>

          <p>
            ₹${Number(item.price || 0)}
          </p>

          <div>

            <button onclick="changeQuantity(${Number(item.id)}, -1)">
              −
            </button>

            <strong>
              ${quantity}
            </strong>

            <button onclick="changeQuantity(${Number(item.id)}, 1)">
              +
            </button>

          </div>

          <button onclick="removeFromCart(${Number(item.id)})">
            Remove
          </button>

        </div>

      </div>

    `;

  }).join("");

  $("cartTotal").textContent =
    total.toFixed(0);
}


// ===============================
// BUY NOW
// ===============================

function buyNow(id) {

  const product = products.find(
    p => Number(p.id) === Number(id)
  );

  if (!product) {
    alert("Product नहीं मिला");
    return;
  }

  const cart = [{
    ...product,
    quantity: 1
  }];

  saveCart(cart);

  customerLogin();
}


// ===============================
// CUSTOMER LOGIN
// ===============================

function customerLogin() {

  show("loginModal");
}


async function loginCustomer() {

  const name =
    $("customerName").value.trim();

  const mobile =
    $("customerMobile").value.trim();

  if (!name || mobile.length !== 10) {

    alert("सही नाम और 10 digit mobile number डालें");

    return;
  }

  try {

    const data = await api(
      "/api/customer/login",
      {
        method: "POST",

        body: JSON.stringify({
          name,
          mobile
        })
      }
    );

    localStorage.setItem(
      "customer",
      JSON.stringify(data.customer || {
        name,
        mobile
      })
    );

    closeAll();

    alert("Login successful ✅");

    checkout();

  } catch (error) {

    alert(error.message);
  }
}


// ===============================
// CHECKOUT
// ===============================

async function checkout() {

  const customer =
    JSON.parse(
      localStorage.getItem("customer") || "null"
    );

  if (!customer) {

    show("loginModal");

    return;
  }

  const cart = getCart();

  if (!cart.length) {

    alert("Cart खाली है");

    return;
  }

  const items = cart.map(item => ({
    product_id: item.id,
    quantity: item.quantity,
    price: item.price
  }));

  try {

    await api(
      "/api/orders",
      {
        method: "POST",

        body: JSON.stringify({
          customer,
          items
        })
      }
    );

    localStorage.removeItem("kitkit_cart");

    alert(
      "Order successfully placed ✅"
    );

    showHome();

  } catch (error) {

    alert(error.message);
  }
}


// ===============================
// OWNER LOGIN
// ===============================

function openOwnerLogin() {

  show("ownerLoginModal");
}


async function sendOwnerOTP() {

  const mobile =
    $("ownerMobile").value.trim();

  if (mobile.length !== 10) {

    alert("10 digit owner mobile number डालें");

    return;
  }

  try {

    const data = await api(
      "/api/owner/send-otp",
      {
        method: "POST",

        body: JSON.stringify({
          mobile
        })
      }
    );

    show("otpArea");

    alert(
      data.message || "OTP भेज दिया गया"
    );

  } catch (error) {

    alert(error.message);
  }
}


async function verifyOwnerOTP() {

  const mobile =
    $("ownerMobile").value.trim();

  const otp =
    $("ownerOTP").value.trim();

  if (!otp) {

    alert("OTP डालें");

    return;
  }

  try {

    const data = await api(
      "/api/owner/verify-otp",
      {
        method: "POST",

        body: JSON.stringify({
          mobile,
          otp
        })
      }
    );

    localStorage.setItem(
      "ownerToken",
      data.token || "owner_logged_in"
    );

    closeAll();

    openOwnerDashboard();

  } catch (error) {

    alert(error.message);
  }
}


// ===============================
// OWNER DASHBOARD
// ===============================

function openOwnerDashboard() {

  hidePages();
  show("ownerPage");

  loadOwnerProducts();
}


function ownerLogout() {

  localStorage.removeItem("ownerToken");

  showHome();
}


async function loadOwnerProducts() {

  await loadProducts();
}


// ===============================
// ADD PRODUCT
// ===============================

function openAddProduct() {

  editingProductId = null;

  $("productForm").reset();

  $("imagePreview").innerHTML =
    "<span>Product photo preview</span>";

  show("addProductModal");
}


$("productImage")?.addEventListener(
  "change",
  function () {

    const file = this.files[0];

    if (!file) return;

    const reader =
      new FileReader();

    reader.onload = function(e) {

      $("imagePreview").innerHTML = `
        <img src="${e.target.result}">
      `;
    };

    reader.readAsDataURL(file);
  }
);


// ===============================
// SAVE PRODUCT
// ===============================

$("productForm")?.addEventListener(
  "submit",
  async function(event) {

    event.preventDefault();

    const name =
      $("productName").value.trim();

    const price =
      Number($("productPrice").value);

    const mrp =
      Number($("productMRP").value || 0);

    const category =
      $("productCategory").value;

    const description =
      $("productDescription").value.trim();

    const imageFile =
      $("productImage").files[0];

    if (!name || !price) {

      alert("Product name और price डालें");

      return;
    }

    try {

      let imageUrl = "";

      // पहले image online upload होगी
      if (imageFile) {

        const formData =
          new FormData();

        formData.append(
          "image",
          imageFile
        );

        const uploadResponse =
          await fetch(
            API_URL + "/api/upload-image",
            {
              method: "POST",
              body: formData
            }
          );

        const uploadData =
          await uploadResponse.json();

        if (!uploadResponse.ok) {

          throw new Error(
            uploadData.message ||
            "Image upload failed"
          );
        }

        imageUrl =
          uploadData.url ||
          uploadData.imageUrl;
      }


      const productData = {
        name,
        price,
        mrp,
        category,
        description,
        image: imageUrl
      };


      if (editingProductId) {

        await api(
          "/api/products/" +
          editingProductId,
          {
            method: "PUT",
            body: JSON.stringify(productData)
          }
        );

        alert(
          "Product updated successfully ✅"
        );

      } else {

        await api(
          "/api/products",
          {
            method: "POST",
            body: JSON.stringify(productData)
          }
        );

        alert(
          "Product online database में save हो गया ✅"
        );
      }


      closeAll();

      await loadProducts();

      openOwnerDashboard();

    } catch (error) {

      console.error(error);

      alert(error.message);
    }

  }
);


// ===============================
// MANAGE PRODUCTS
// ===============================

async function manageProducts() {

  try {

    const data =
      await api("/api/products");

    products =
      Array.isArray(data)
        ? data
        : (data.products || []);

    $("ownerContent").innerHTML = `

      <div class="settings-card">

        <h2>Manage Products</h2>

        ${
          products.length
            ? products.map(product => `

              <div class="cart-item">

                <img
                  src="${escapeHTML(
                    product.image ||
                    "https://via.placeholder.com/100"
                  )}"
                >

                <div>

                  <h3>
                    ${escapeHTML(product.name)}
                  </h3>

                  <p>
                    ₹${Number(product.price || 0)}
                  </p>

                  <button
                    onclick="editProduct(${Number(product.id)})"
                  >
                    ✏️ Edit
                  </button>

                  <button
                    onclick="deleteProduct(${Number(product.id)})"
                  >
                    🗑️ Delete
                  </button>

                </div>

              </div>

            `).join("")
            : "<p>No products found.</p>"
        }

      </div>

    `;

  } catch (error) {

    alert(error.message);
  }
}


// ===============================
// EDIT PRODUCT
// ===============================

function editProduct(id) {

  const product =
    products.find(
      p => Number(p.id) === Number(id)
    );

  if (!product) return;

  editingProductId = id;

  $("productName").value =
    product.name || "";

  $("productPrice").value =
    product.price || "";

  $("productMRP").value =
    product.mrp || "";

  $("productCategory").value =
    product.category || "Other";

  $("productDescription").value =
    product.description || "";

  $("imagePreview").innerHTML = product.image
    ? `<img src="${escapeHTML(product.image)}">`
    : "<span>Current image</span>";

  show("addProductModal");
}


// ===============================
// DELETE PRODUCT
// ===============================

async function deleteProduct(id) {

  if (!confirm(
    "क्या आप यह product delete करना चाहते हैं?"
  )) {
    return;
  }

  try {

    await api(
      "/api/products/" + id,
      {
        method: "DELETE"
      }
    );

    alert("Product deleted ✅");

    await loadProducts();

    manageProducts();

  } catch (error) {

    alert(error.message);
  }
}


// ===============================
// ORDERS
// ===============================

async function showOrders() {

  try {

    const data =
      await api("/api/orders");

    const orders =
      Array.isArray(data)
        ? data
        : (data.orders || []);

    $("ownerContent").innerHTML = `

      <div class="settings-card">

        <h2>📦 Orders</h2>

        ${
          orders.length
            ? orders.map(order => `

              <div class="cart-item">

                <div>

                  <h3>
                    Order #${order.id}
                  </h3>

                  <p>
                    Status:
                    ${escapeHTML(order.status || "Pending")}
                  </p>

                  <p>
                    Total:
                    ₹${Number(order.total || 0)}
                  </p>

                </div>

              </div>

            `).join("")
            : "<p>No orders yet.</p>"
        }

      </div>

    `;

  } catch (error) {

    alert(error.message);
  }
}


// ===============================
// COMPLAINTS
// ===============================

async function showComplaints() {

  try {

    const data =
      await api("/api/complaints");

    const complaints =
      Array.isArray(data)
        ? data
        : (data.complaints || []);

    $("ownerContent").innerHTML = `

      <div class="settings-card">

        <h2>📝 Complaints</h2>

        ${
          complaints.length
            ? complaints.map(c => `

              <div class="cart-item">

                <div>

                  <h3>
                    ${escapeHTML(c.name || "Customer")}
                  </h3>

                  <p>
                    ${escapeHTML(c.message |
