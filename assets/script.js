const CART_STORAGE_KEY = 'y4kCartItems';
const products = {
    product1: {
        name: "Fallen Angel Top",
        category: "Top",
        description: "This top is a corset type top shaped as angel wings connected by chains",
        color: "Iridescent/Multicolor",
        sizes: "S, M, L, XL",
        price: "₱ 2000",
        image: "assets/images/y3kshirt1.jpeg"
    },
    product2: {
        name: "Cyber Web Top",
        category: "Top",
        description: "This top has a black base interconnected with silvery metallic design, creating a villainous aesthetic",
        color: "Black/Silver",
        sizes: "S, M, L, XL",
        price: "₱ 3000",
        image: "assets/images/y3kshirt2.jpeg"
    },
    product3: {
        name: "Holographic Pants",
        category: "Pants",
        description: "This pant is a multicolor cargo pants with blue accents",
        color: "Iridescent/Multicolor",
        sizes: "S, M, L, XL",
        price: "₱ 550",
        image: "assets/images/y3kpants1.jpeg"
    },
    product4: {
        name: "Chain Ribbon Pants",
        category: "Pants",
        description: "This pant is a mixture between cute and edgy, it has a black base with accents of chains and ribbons",
        color: "Black/Silver",
        sizes: "S, M, L, XL",
        price: "₱ 700",
        image: "assets/images/y3kpants2.jpeg"
    },
    product5: {
        name: "Metallic Sunglasses",
        category: "Accessories",
        description: "These sunglasses have a metallic finish that gives a futuristic aura",
        color: "Silver",
        sizes: "One size (adjustable)",
        price: "₱ 1000",
        image: "assets/images/y3kacc1.jpeg"
    },
    product6: {
        name: "Spine Choker",
        category: "Accessories",
        description: "This choker drapes over your back like your debt",
        color: "Black/Silver",
        sizes: "One size (adjustable)",
        price: "₱ 1500",
        image: "assets/images/y3kacc2.jpeg"
    }
};

function getProductId() {
    return new URLSearchParams(window.location.search).get('id');
}

function getCartItems() {
    const stored = localStorage.getItem(CART_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
}

function saveCartItems(items) {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
}

function addToCart(productId) {
    const cartItems = getCartItems();
    if (!cartItems.includes(productId)) {
        cartItems.push(productId);
        saveCartItems(cartItems);
        alert(products[productId].name + ' has been added to your cart.');
    } else {
        alert(products[productId].name + ' is already in your cart.');
    }
}

function renderProduct(productId) {
    const product = products[productId];
    const container = document.getElementById('product-page');

    if (!product) {
        container.innerHTML = `
            <div>
                <h2>Product not found.</h2>
                <p>Please return to the listing and select an item again.</p>
                <a href="product_listing.html">Back to Listing</a>
            </div>
        `;
        return;
    }

    container.innerHTML = `
    <div class="product-details">
        <div>
            <img src="${product.image}" alt="${product.name}">
        </div>
        <div class="product-info">
            <div>${product.category}</div>
            <h2>${product.name}</h2>
            <p>${product.price}</p>
            <p><strong>Description:</strong> ${product.description}</p>
            <p><strong>Color:</strong> ${product.color}</p>
            <p><strong>Sizes:</strong> ${product.sizes}</p>

            <div class="product-actions">
                <button id="add-cart">Add to Cart</button>
                <a href="checkout.html?id=${productId}" class="checkout-btn">Checkout</a>
            </div>
        </div>
    </div>
`;

    document.getElementById('add-cart').addEventListener('click', function() {
        addToCart(productId);
    });
}

function renderCart() {
    const container = document.getElementById('cart-page');
    if (!container) {
        return;
    }

    const cartItems = getCartItems();
    if (!cartItems.length) {
        container.innerHTML = `
            <div>
                <h2>Your cart is empty.</h2>
                <p><a href="product_listing.html">Browse products</a></p>
            </div>
        `;
        return;
    }

    const rows = cartItems.map(function(productId) {
        const product = products[productId];
        if (!product) {
            return `
                <li>Unknown product (ID: ${productId})</li>
            `;
        }

        return `
            <li>
                <a href="product.html?id=${productId}">${product.name}</a>
                <span> - ${product.price}</span>
            </li>
        `;
    }).join('');

    container.innerHTML = `
        <div>
            <h2>Your Cart</h2>
            <ul>
                ${rows}
            </ul>
            <p>Total items: ${cartItems.length}</p>
        </div>
    `;
}

function renderCheckout(productId) {
    const container = document.getElementById('checkout-page');
    if (!container) {
        return;
    }

    const cartItems = getCartItems();
    const product = productId ? products[productId] : null;

    let summary = '';

    if (product) {
        summary = `
            <p>Selected product: ${product.name}</p>
            <p>Total amount: ${product.price}</p>
        `;
    } else if (cartItems.length > 0) {
        const cartSummary = cartItems.map(function(id) {
            const item = products[id];
            if (!item) return '';
            return `<li>${item.name} - ${item.price}</li>`;
        }).join('');

        summary = `
            <p>Items in your cart:</p>
            <ul>
                ${cartSummary}
            </ul>
        `;
    } else {
        summary = '<p>No product selected. You can still choose a payment method.</p>';
    }

    container.innerHTML = `
        <div>
            <h2>Checkout Details</h2>
            ${summary}
            <p>Select a payment option:</p>
            <label><input type="radio" name="payment-method" value="cod" checked> Cash on Delivery</label>
            <label><input type="radio" name="payment-method" value="card"> Card / E-Wallet</label>
            <div id="card-details" hidden>
                <p>Enter your payment details below:</p>
                <label>
                    Payment provider:
                    <select id="payment-provider">
                        <option value="PayPal">PayPal</option>
                        <option value="GCash">GCash</option>
                        <option value="BDO">BDO</option>
                        <option value="Other">Other</option>
                    </select>
                </label>
                <label>
                    Account name:
                    <input id="account-name" type="text" placeholder="Account name">
                </label>
                <label>
                    Account number / ID:
                    <input id="account-number" type="text" placeholder="Account number or wallet ID">
                </label>
                <label>
                    Card expiration / details:
                    <input id="account-expiration" type="text" placeholder="MM/YY or expiry info">
                </label>
            </div>
            <button id="verify-payment">Verify Payment</button>
            <div id="checkout-message"></div>
        </div>
    `;

    const paymentRadios = Array.from(container.querySelectorAll('input[name="payment-method"]'));
    const cardDetails = container.querySelector('#card-details');
    const verifyButton = container.querySelector('#verify-payment');
    const message = container.querySelector('#checkout-message');

    function updateCardDetailsVisibility() {
        const selectedMethod = container.querySelector('input[name="payment-method"]:checked').value;
        cardDetails.hidden = selectedMethod !== 'card';
        message.textContent = '';
    }

    function validateCardFields() {
        const accountName = container.querySelector('#account-name').value.trim();
        const accountNumber = container.querySelector('#account-number').value.trim();
        const expiration = container.querySelector('#account-expiration').value.trim();

        if (!accountName || !accountNumber || !expiration) {
            return 'Please fill out all payment fields for card or digital wallet checkout.';
        }

        return '';
    }

    paymentRadios.forEach(function(radio) {
        radio.addEventListener('change', updateCardDetailsVisibility);
    });

    verifyButton.addEventListener('click', function() {
        const selectedMethod = container.querySelector('input[name="payment-method"]:checked').value;
        if (selectedMethod === 'card') {
            const validationError = validateCardFields();
            if (validationError) {
                message.textContent = validationError;
                return;
            }
        }

        message.textContent = 'Checkout verified successfully. Thank you for your order.';
    });
}

document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('product-page')) {
        renderProduct(getProductId());
    }
    if (document.getElementById('cart-page')) {
        renderCart();
    }
    if (document.getElementById('checkout-page')) {
        renderCheckout(getProductId());
    }
});