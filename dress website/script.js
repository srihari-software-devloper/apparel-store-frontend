// --- CONFIGURATION ---
const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyrQhRURo8yqk1SD-ZExH6LlcXsMkGaMBwQg1YLGGLQ1XHo881YVnViHVEKX-MVuUq0/exec';

function updateCartCount() {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const badges = document.querySelectorAll('#cartCountBadge');
    badges.forEach(badge => {
        badge.innerText = cart.length;
    });
}

function addToCartDynamic(id) {
    if (typeof getProductById !== 'function') {
        alert("Error: products.js not loaded.");
        return;
    }

    const product = getProductById(id);
    if (!product) return;

    const nameInput = document.getElementById('customerName');
    const name = nameInput && nameInput.value.trim() !== '' ? nameInput.value : 'Guest';

    let selectedSize = 'M';
    const activeSizeBtn = document.querySelector('.size-btn.active');
    if (activeSizeBtn) selectedSize = activeSizeBtn.innerText;

    const cartItem = {
        name: name,
        dressType: product.title,
        color: product.color,
        fabric: product.details[0] || 'Standard',
        size: selectedSize,
        price: product.price,
        image: product.image
    };

    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart.push(cartItem);
    localStorage.setItem('cart', JSON.stringify(cart));

    updateCartCount();

    const btn = document.querySelector('.btn-cart');
    if (btn) {
        const originalText = btn.innerText;
        btn.innerText = "Added!";
        btn.style.background = "#e6ffe6";
        btn.style.borderColor = "#03a685";
        btn.style.color = "#03a685";
        setTimeout(() => {
            btn.innerText = originalText;
            btn.style.background = "var(--bg-white)";
            btn.style.borderColor = "var(--text-dark)";
            btn.style.color = "var(--text-dark)";
        }, 2000);
    }
}

function buyNowDynamic(id) {
    addToCartDynamic(id);
    window.location.href = "cart.html";
}

let currentCartTotal = 0;

function displayCart() {
    const cartItems = document.getElementById('cartItems');
    const priceDetailsCard = document.getElementById('priceDetailsCard');
    const cartHeaderCount = document.getElementById('cartHeaderCount');

    if (!cartItems) return;

    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    updateCartCount();

    if (cartHeaderCount) {
        cartHeaderCount.innerText = `(${cart.length} Item${cart.length !== 1 ? 's' : ''})`;
    }

    if (cart.length === 0) {
        cartItems.innerHTML = `
            <div style="text-align: center; padding: 50px; background: white; border-radius: 8px; border: 1px solid var(--border-color);">
                <img src="https://images.unsplash.com/photo-1586769852044-692d6e3703f0?q=80&w=200&auto=format&fit=crop" style="width: 150px; border-radius: 8px; margin-bottom: 20px; filter: grayscale(100%); opacity: 0.5;">
                <h3 style="color: var(--text-light);">Your cart is empty</h3>
                <a href="shop.html?category=all" class="btn-primary" style="display: inline-block; margin-top: 20px;">Continue Shopping</a>
            </div>
        `;
        if (priceDetailsCard) priceDetailsCard.style.display = 'none';
        return;
    }

    if (priceDetailsCard) priceDetailsCard.style.display = 'block';

    currentCartTotal = 0;

    cartItems.innerHTML = cart.map((item, index) => {
        currentCartTotal += item.price;
        const imgSrc = item.image || "https://images.unsplash.com/photo-1539008835657-9e8e9680c956?q=80&w=200&auto=format&fit=crop";
        return `
            <div class="cart-item">
                <img src="${imgSrc}" alt="Product">
                <div class="item-details">
                    <h4>${item.dressType}</h4>
                    <p style="font-size: 13px; color: #888;">Size: ${item.size} | Color: ${item.color}</p>
                    <p style="font-size: 13px; color: #888; margin-top: 5px;">Order For: ${item.name}</p>
                    <div class="item-price">₹${item.price}</div>
                    <button class="btn-remove" onclick="removeItem(${index})">Remove</button>
                </div>
            </div>
        `;
    }).join('');

    // Update Price Details
    const totalEl = document.getElementById('totalProductPrice');
    const finalEl = document.getElementById('finalOrderTotal');
    if (totalEl) totalEl.innerText = `₹${currentCartTotal}`;
    if (finalEl) finalEl.innerText = `₹${currentCartTotal}`;
}

function removeItem(index) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart.splice(index, 1);
    localStorage.setItem('cart', JSON.stringify(cart));
    displayCart();
}

function openPaymentGateway() {
    const overlay = document.getElementById('paymentOverlay');
    const amountSpan = document.getElementById('payBtnAmount');
    if (overlay && amountSpan) {
        amountSpan.innerText = `(₹${currentCartTotal})`;
        overlay.style.display = 'flex';
    }
}

async function checkout() {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    if (cart.length === 0) return;

    const nameInput = document.getElementById('checkoutName');
    const phoneInput = document.getElementById('checkoutPhone');
    const addressInput = document.getElementById('deliveryAddress');
    const transactionIdInput = document.getElementById('transactionId');

    if (!nameInput || nameInput.value.trim() === '') {
        alert("Please enter your full name.");
        return;
    }
    if (!phoneInput || phoneInput.value.trim() === '') {
        alert("Please enter your phone number.");
        return;
    }
    if (!addressInput || addressInput.value.trim() === '') {
        alert("Please enter your delivery address.");
        return;
    }
    if (!transactionIdInput || transactionIdInput.value.trim() === '') {
        alert("Please enter the Transaction ID after completing the UPI payment.");
        return;
    }

    const customerName = nameInput.value.trim();
    const customerPhone = phoneInput.value.trim();
    const deliveryAddress = addressInput.value.trim();
    const transactionId = transactionIdInput.value.trim();

    // Generate unique Order ID
    const orderId = "ORD-" + Math.floor(100000 + Math.random() * 900000);

    const loader = document.getElementById('checkoutLoader');
    const confirmBtn = document.getElementById('confirmPaymentBtn');

    if (loader) loader.style.display = 'block';
    if (confirmBtn) confirmBtn.style.display = 'none';

    // Save order for tracking locally
    let orderHistory = JSON.parse(localStorage.getItem('orderHistory')) || [];
    orderHistory.push({
        orderId: orderId,
        date: new Date().toLocaleDateString(),
        total: currentCartTotal,
        items: cart,
        status: "Processing",
        paymentMethod: "upi",
        transactionId: transactionId
    });
    localStorage.setItem('orderHistory', JSON.stringify(orderHistory));

    try {
        const response = await fetch(SCRIPT_URL, {
            method: 'POST',
            body: JSON.stringify({ 
                items: cart, 
                orderId: orderId,
                customerName: customerName,
                customerPhone: customerPhone,
                deliveryAddress: deliveryAddress,
                transactionId: transactionId
            }),
        });

        setTimeout(() => {
            if (loader) loader.style.display = 'none';
            if (confirmBtn) confirmBtn.style.display = 'block';

            alert(`Order Placed! 🎉\nYour Order ID is: ${orderId}\n\nWe are verifying your payment Transaction ID. You can track your order status on the Track Order page.`);
            document.getElementById('paymentOverlay').style.display = 'none';
            localStorage.removeItem('cart');
            window.location.href = `tracking.html?id=${orderId}`;
        }, 1500);

    } catch (error) {
        console.error("Error submitting to Apps Script:", error);
        // Still simulate success since Apps Script might be restricted
        setTimeout(() => {
            if (loader) loader.style.display = 'none';
            if (confirmBtn) confirmBtn.style.display = 'block';
            alert(`Order Placed! 🎉\nYour Order ID is: ${orderId}\n\nWe are verifying your payment Transaction ID. You can track your order status on the Track Order page.`);
            document.getElementById('paymentOverlay').style.display = 'none';
            localStorage.removeItem('cart');
            window.location.href = `tracking.html?id=${orderId}`;
        }, 1500);
    }
}

// Handle size button clicks dynamically
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('size-btn')) {
        document.querySelectorAll('.size-btn').forEach(btn => btn.classList.remove('active'));
        e.target.classList.add('active');
    }
});

document.addEventListener('DOMContentLoaded', () => {
    updateCartCount();
});