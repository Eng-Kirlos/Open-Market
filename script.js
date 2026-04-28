// تحميل السلة من LocalStorage أو إنشاء واحدة جديدة
let cart = JSON.parse(localStorage.getItem("cart")) || [];

// بيانات العميل + رقم الأوردر
let customer = JSON.parse(localStorage.getItem("customer")) || { name: "", phone: "", email: "", orderID: "" };

// إضافة منتج للسلة
function addToCart(name, price) {
  let existingItem = cart.find(item => item.name === name);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({ name: name, price: price, quantity: 1 });
  }

  saveCart();
  alert("تمت إضافة " + name + " إلى السلة");
}

// حفظ السلة في LocalStorage
function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

// تحميل السلة من LocalStorage
function loadCart() {
  let stored = localStorage.getItem("cart");
  if (stored) {
    cart = JSON.parse(stored);
  }
}

// حفظ بيانات العميل مع رقم الأوردر
function saveCustomer(name, phone, email) {
  let orderID = generateOrderID();
  customer = { name, phone, email, orderID };
  localStorage.setItem("customer", JSON.stringify(customer));
  alert("تم حفظ بيانات العميل\nرقم الأوردر الخاص بك: " + orderID);
}

// عرض السلة في صفحة cart.html
function renderCart() {
  loadCart();
  let cartBody = document.getElementById("cart-body");
  let totalElement = document.getElementById("cart-total");
  let orderElement = document.getElementById("order-id");
  if (!cartBody) return; // لو مش في صفحة cart.html

  cartBody.innerHTML = "";
  let total = 0;

  cart.forEach((item, index) => {
    const itemTotal = item.price * item.quantity;
    total += itemTotal;

    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${item.name}</td>
      <td>${item.price} درهم</td>
      <td>
        <button onclick="decreaseQuantity(${index})">-</button>
        ${item.quantity}
        <button onclick="increaseQuantity(${index})">+</button>
      </td>
      <td>${itemTotal} درهم</td>
      <td><button onclick="removeItem(${index})">❌</button></td>
    `;
    cartBody.appendChild(row);
  });

  totalElement.innerText = "الإجمالي: " + total + " درهم";
  if (orderElement && customer.orderID) {
    orderElement.innerText = "رقم الأوردر: " + customer.orderID;
  }
}

// زيادة الكمية
function increaseQuantity(index) {
  cart[index].quantity += 1;
  saveCart();
  renderCart();
}

// تقليل الكمية
function decreaseQuantity(index) {
  if (cart[index].quantity > 1) {
    cart[index].quantity -= 1;
  } else {
    cart.splice(index, 1);
  }
  saveCart();
  renderCart();
}

// حذف منتج من السلة بالكامل
function removeItem(i) {
  cart.splice(i, 1);
  saveCart();
  renderCart();
}

// توليد رقم أوردر عشوائي
function generateOrderID() {
  return "ORD-" + Math.floor(100000 + Math.random() * 900000);
}

// إتمام عملية الشراء عبر واتساب
function checkoutWhatsApp() {
  loadCart();
  if (cart.length === 0) {
    alert("السلة فارغة!");
    return;
  }

  // الحصول على التاريخ والوقت الحالي
  let now = new Date();
  let dateTime = now.toLocaleString("ar-EG");

  // رقم الأوردر من بيانات العميل
  let orderID = customer.orderID || generateOrderID();

  let message = "📦 طلب جديد من موقع KM Integrated Services\n";
  message += "🆔 رقم الأوردر: " + orderID + "\n";
  message += "🕒 التاريخ والوقت: " + dateTime + "\n\n";

  cart.forEach(item => {
    message += `${item.name} - الكمية: ${item.quantity} - السعر: ${item.price} درهم\n`;
  });

  let total = cart.reduce((sum, i) => sum + (i.price * i.quantity), 0);
  message += "\nالإجمالي: " + total + " درهم\n\n";

  // بيانات العميل
  message += "👤 بيانات العميل:\n";
  message += "الاسم: " + (customer.name || "غير محدد") + "\n";
  message += "الهاتف: " + (customer.phone || "غير محدد") + "\n";
  message += "البريد: " + (customer.email || "غير محدد") + "\n";

  // رقمك على واتساب (غيره برقمك الحقيقي مع كود الدولة)
  let phone = "971504149420"; 
  let url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
  window.open(url, "_blank");

  // رسالة تأكيد للعميل برقم الأوردر
  alert("✅ تم إرسال الطلب بنجاح!\nرقم الأوردر الخاص بك: " + orderID);

  // تفريغ السلة بعد الإرسال
  cart = [];
  saveCart();
  renderCart();
}

// التحقق من كلمة المرور للوحة التحكم
function checkPassword() {
  let pass = document.getElementById("settingsPassword").value;
  if (pass === "P@ssw0rd@Wax") {
    window.location.href = "control.html";
  } else {
    alert("كلمة المرور غير صحيحة");
  }
}

// تشغيل عرض السلة لو الصفحة هي cart.html
renderCart();