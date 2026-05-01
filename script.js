// تسجيل عميل جديد
function registerCustomer(event) {
  event.preventDefault();
  let name = document.getElementById("regName").value;
  let phone = document.getElementById("regPhone").value;
  let email = document.getElementById("regEmail").value;
  let password = document.getElementById("regPassword").value;

  localStorage.setItem("user", JSON.stringify({name, phone, email, password}));
  alert("تم التسجيل بنجاح!");
  window.location.href = "login.html";
}

// تسجيل دخول
function loginCustomer(event) {
  event.preventDefault();
  let email = document.getElementById("loginEmail").value;
  let password = document.getElementById("loginPassword").value;
  let user = JSON.parse(localStorage.getItem("user"));

  if(user && user.email === email && user.password === password) {
    localStorage.setItem("loggedIn", "true");
    alert("تم تسجيل الدخول بنجاح!");
    window.location.href = "index.html";
  } else {
    alert("بيانات الدخول غير صحيحة");
  }
}

// تسجيل خروج
function logoutCustomer() {
  localStorage.removeItem("loggedIn");
  alert("تم تسجيل الخروج");
  window.location.href = "index.html";
}

// تعديل الروابط في الهيدر حسب حالة الدخول
function updateAuthLinks() {
  let authLinks = document.getElementById("auth-links");
  if(authLinks) {
    if(localStorage.getItem("loggedIn")) {
      authLinks.innerHTML = `<a href="#" onclick="logoutCustomer()">تسجيل خروج</a>`;
    } else {
      authLinks.innerHTML = `<a href="register.html">تسجيل</a> <a href="login.html">تسجيل دخول</a>`;
    }
  }
}
updateAuthLinks();

// منع إضافة للسلة لو مش مسجل
function checkLoginBeforeAdd(name, price) {
  if(!localStorage.getItem("loggedIn")) {
    alert("يجب تسجيل الدخول أولاً لإضافة منتجات للسلة");
    window.location.href = "login.html";
  } else {
    addToCart(name, price);
  }
}

// إضافة للسلة
function addToCart(name, price) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  let existing = cart.find(item => item.name === name);
  if(existing) {
    existing.quantity += 1;
  } else {
    cart.push({name, price, quantity: 1});
  }
  localStorage.setItem("cart", JSON.stringify(cart));
  alert("تمت إضافة المنتج للسلة");
}

// عرض السلة
function showCart() {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  let tbody = document.getElementById("cart-body");
  let total = 0;
  tbody.innerHTML = "";
  cart.forEach((item, index) => {
    let row = `<tr>
      <td>${item.name}</td>
      <td>${item.price} درهم</td>
      <td>${item.quantity}</td>
      <td>${item.price * item.quantity} درهم</td>
      <td><button onclick="removeFromCart(${index})">إزالة</button></td>
    </tr>`;
    tbody.innerHTML += row;
    total += item.price * item.quantity;
  });
  document.getElementById("cart-total").innerText = "الإجمالي: " + total + " درهم";
}

// إزالة منتج من السلة
function removeFromCart(index) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  cart.splice(index, 1);
  localStorage.setItem("cart", JSON.stringify(cart));
  showCart();
}

// توليد رقم أوردر
function generateOrderID() {
  return "ORD-" + Math.floor(Math.random() * 1000000);
}

// إرسال الطلب عبر واتساب مع التحقق من تسجيل الدخول
function checkoutWhatsApp() {
  if(!localStorage.getItem("loggedIn")) {
    alert("يجب تسجيل الدخول أولاً لإتمام الطلب");
    window.location.href = "login.html";
    return;
  }
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  if(cart.length === 0) {
    alert("السلة فارغة");
    return;
  }
  let orderID = generateOrderID();
  let user = JSON.parse(localStorage.getItem("user"));
  let message = `طلب جديد رقم ${orderID}\nالعميل: ${user.name}\nالهاتف: ${user.phone}\nالبريد: ${user.email}\n`;
  cart.forEach(item => {
    message += `${item.name} - الكمية: ${item.quantity} - الإجمالي: ${item.price * item.quantity} درهم\n`;
  });
  let total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  message += `الإجمالي الكلي: ${total} درهم`;

  // حفظ الطلب في LocalStorage
  let orders = JSON.parse(localStorage.getItem("orders")) || [];
  orders.push({id: orderID, name: user.name, phone: user.phone, email: user.email, items: cart.map(i => i.name).join(", "), total});
  localStorage.setItem("orders", JSON.stringify(orders));

  // فتح واتساب
  let url = "https://wa.me/201234567890?text=" + encodeURIComponent(message);
  window.open(url, "_blank");
}

// تحميل الطلبات في لوحة التحكم
function loadOrders() {
  let orders = JSON.parse(localStorage.getItem("orders")) || [];
  let tbody = document.getElementById("orders-body");
  if(tbody) {
    tbody.innerHTML = "";
    orders.forEach(order => {
      let row = `<tr>
        <td>${order.id}</td>
        <td>${order.name}</td>
        <td>${order.phone}</td>
        <td>${order.email}</td>
        <td>${order.items}</td>
        <td>${order.total} درهم</td>
      </tr>`;
      tbody.innerHTML += row;
    });
  }
}

// تحميل المنتجات في لوحة التحكم
function loadProducts() {
  let products = JSON.parse(localStorage.getItem("products")) || [];
  let tbody = document.getElementById("products-body");
  if(tbody) {
    tbody.innerHTML = "";
    products.forEach(prod => {
      let row = `<tr>
        <td>${prod.name}</td>
        <td>${prod.price} درهم</td>
        <td>${prod.quantity}</td>
      </tr>`;
      tbody.innerHTML += row;
    });
  }
}

// إضافة منتج جديد بدون مسح القديم
function addProductFromControl(name, price, quantity, image) {
  let products = JSON.parse(localStorage.getItem("products")) || [];
  let newProduct = {name, price, quantity, image};
  products.push(newProduct);
  localStorage.setItem("products", JSON.stringify(products));
  alert("تم إضافة المنتج بنجاح!");
  loadProducts();
}