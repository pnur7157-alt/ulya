// Product Data
const products = [
    {
        id: 1,
        name: "Hijab Sholat Premium Katun",
        price: 75000,
        image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400",
        category: "Hijab Sholat",
        rating: 4.9
    },
    {
        id: 2,
        name: "Sajadah Travel Lipat",
        price: 125000,
        image: "https://images.unsplash.com/photo-1608254198976-bee170ad4205?w=400",
        category: "Sajadah",
        rating: 4.8
    },
    {
        id: 3,
        name: "Tasbih Kristal 99 Butir",
        price: 45000,
        image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400",
        category: "Tasbih",
        rating: 5.0
    },
    {
        id: 4,
        name: "Hijab Sholat Instan",
        price: 95000,
        image: "https://unsplash.com/id/ilustrasi/xQxNYraWq4w",
        category: "Hijab Sholat",
        rating: 4.7
    },
    {
        id: 5,
        name: "Sajadah Tebal 3 Lapis",
        price: 175000,
        image: "https://images.unsplash.com/photo-1626942245639-d69252f49983?w=400",
        category: "Sajadah",
        rating: 4.9
    },
    {
        id: 6,
        name: "Tasbih Digital LED",
        price: 225000,
        image: "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=400",
        category: "Tasbih",
        rating: 4.6
    }
];

// Shopping Cart
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// DOM Elements
const productsGrid = document.getElementById('productsGrid');
const cartCount = document.getElementById('cartCount');
const cartItems = document.getElementById('cartItems');
const cartTotal = document.getElementById('cartTotal');
const cartModal = document.getElementById('cartModal');

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    renderProducts();
    updateCart();
    initSlider();
    initSmoothScroll();
});

// Render Products
function renderProducts() {
    productsGrid.innerHTML = products.map(product => `
        <div class="product-card" data-id="${product.id}">
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}">
            </div>
            <div class="product-info">
                <div class="product-category">${product.category}</div>
                <h3 class="product-title">${product.name}</h3>
                <div class="product-price">Rp ${formatRupiah(product.price)}</div>
                <div class="product-rating">
                    <div class="stars">${'★'.repeat(Math.floor(product.rating))}${'☆'.repeat(5-Math.floor(product.rating))}</div>
                    <span>(${product.rating})</span>
                </div>
                <button class="add-to-cart" onclick="addToCart(${product.id})">
                    <i class="fas fa-shopping-cart"></i> Tambah ke Keranjang
                </button>
            </div>
        </div>
    `).join('');
}

// Add to Cart
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }
    
    updateCart();
    showNotification('Produk ditambahkan ke keranjang!');
}

// Update Cart
function updateCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
    
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;
    
    renderCartItems();
    
    const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cartTotal.textContent = `Rp ${formatRupiah(totalPrice)}`;
}

// Render Cart Items
function renderCartItems() {
    if (cart.length === 0) {
        cartItems.innerHTML = '<p style="text-align: center; color: #666; padding: 2rem;">Keranjang Anda kosong</p>';
        return;
    }
    
    cartItems.innerHTML = cart.map(item => `
        <div class="cart-item">
            <img src="${item.image}" alt="${item.name}">
            <div class="cart-item-info">
                <h4>${item.name}</h4>
                <p>Rp ${formatRupiah(item.price)}</p>
                <div style="display: flex; align-items: center; gap: 10px;">
                    <button onclick="updateQuantity(${item.id}, -1)">-</button>
                    <span>${item.quantity}</span>
                    <button onclick="updateQuantity(${item.id}, 1)">+</button>
                </div>
            </div>
            <button class="remove-item" onclick="removeFromCart(${item.id})">Hapus</button>
        </div>
    `).join('');
}

// Update Quantity
function updateQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromCart(productId);
        } else {
            updateCart();
        }
    }
}

// Remove from Cart
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCart();
}

// Toggle Cart Modal
function toggleCart() {
    cartModal.style.display = cartModal.style.display === 'block' ? 'none' : 'block';
}

// Checkout
function checkout() {
    if (cart.length === 0) {
        alert('Keranjang Anda kosong!');
        return;
    }
    
    alert('Terima kasih atas pembelian Anda! Pesanan akan diproses dalam 24 jam.');
    cart = [];
    updateCart();
    toggleCart();
}

// Format Rupiah
function formatRupiah(number) {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0
    }).format(number).replace('Rp', 'Rp ');
}

// Hero Slider
function initSlider() {
    const slides = document.querySelectorAll('.slide');
    let currentSlide = 0;
    
    setInterval(() => {
        slides[currentSlide].classList.remove('active');
        currentSlide = (currentSlide + 1) % slides.length;
        slides[currentSlide].classList.add('active');
    }, 4000);
}

// Smooth Scroll
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Notification
function showNotification(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: #28a745;
        color: white;
        padding: 15px 20px;
        border-radius: 10px;
        z-index: 3000;
        animation: slideInRight 0.3s ease;
        box-shadow: 0 10px 30px rgba(40, 167, 69, 0.3);
    `;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Add CSS for notification animation
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
`;
document.head.appendChild(style);

// Close modal when clicking outside
window.onclick = function(event) {
    if (event.target === cartModal) {
        toggleCart();
    }
}