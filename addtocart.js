let cart = [];

// Search functionality
const searchInput = document.getElementById('search-input');
if (searchInput) {
    searchInput.addEventListener('keyup', function () {
        const searchQuery = this.value.toLowerCase();
        const productContainers = document.querySelectorAll('.products');

        productContainers.forEach(product => {
            const productName = product.querySelector('.prname')?.textContent.toLowerCase();
            if (productName && productName.includes(searchQuery)) {
                product.style.display = '';
            } else {
                product.style.display = 'none';
            }
        });
    });
}

// Cart Toggle
function toggleCart() {
    const cart = document.getElementById("cart");
    cart.classList.toggle("openCart");
}

// Brand Filter
const brandFilter = document.getElementById('brand-filter');
if (brandFilter) {
    brandFilter.addEventListener('change', function () {
        const selectedBrand = this.value.toLowerCase();
        const productContainers = document.querySelectorAll('.products');

        productContainers.forEach(product => {
            const productName = product.querySelector('.prname')?.textContent.toLowerCase();
            if (selectedBrand === 'all' || productName.includes(selectedBrand)) {
                product.style.display = '';
            } else {
                product.style.display = 'none';
            }
        });
    });
}

// Cart Icon Toggle
document.addEventListener('DOMContentLoaded', function () {
    const cartIcon = document.querySelector('.cartIcon');
    const cartTable = document.getElementById('cartTable');
    const cartTrashIcon = document.querySelector('.cart-trash-icon');

    if (cartIcon && cartTable) {
        cartIcon.addEventListener('click', function () {
            cartTable.classList.toggle('visible');
        });

        if (cartTrashIcon) {
            cartTrashIcon.addEventListener('click', function () {
                cart = [];
                renderCart();
                updateCartNotification();
            });
        }

        const style = document.createElement('style');
        style.innerHTML = `
            #cartTable {
                display: none;
            }
            #cartTable.visible {
                display: block;
            }
            .cart-footer {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 10px;
                border-top: 1px solid #ccc;
            }
            .cart-footer .total-amount {
                font-size: 18px;
                font-weight: bold;
            }
            .place-order-btn {
                background-color: #4CAF50;
                color: white;
                border: none;
                padding: 10px 20px;
                font-size: 16px;
                cursor: pointer;
                border-radius: 5px;
            }
            .place-order-btn:hover {
                background-color: #45a049;
            }
            .cart-footer .icon {
                margin-right: 5px;
            }
        `;
        document.head.appendChild(style);
    } else {
        console.error('Cart icon or cart table not found.');
    }
});

// Add to Cart
function addToCart(productName, productPrice, productImage) {
    const existingItem = cart.find(item => item.name === productName);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ name: productName, price: productPrice, quantity: 1, image: productImage });
    }

    renderCart();
    updateCartNotification();
}

// Render Cart
function renderCart() {
    const cartTable = document.getElementById('cartTable');
    if (!cartTable) return;

    cartTable.innerHTML = '';

    if (cart.length === 0) {
        cartTable.innerHTML = '<p>Your cart is empty!</p>';
        return;
    }

    const table = document.createElement('table');
    table.className = 'cart-table';

    const headers = `<tr>
        <th>Product Image</th>
        <th>Product Name</th>
        <th>Price</th>
        <th>Quantity</th>
        <th>Total</th>
        <th>Remove</th>
    </tr>`;
    table.innerHTML = headers;

    let totalAmount = 0;

    cart.forEach((item, index) => {
        const itemTotal = item.price * item.quantity;
        totalAmount += itemTotal;

        const row = document.createElement('tr');
        row.innerHTML = `
            <td><img src="${item.image}" alt="${item.name}" class="cart-product-img"></td>
            <td>${item.name}</td>
            <td>Rs. ${item.price}</td>
            <td>
                <button class="quantity-btn decrease" data-index="${index}">−</button>
                <span class="quantity-value">${item.quantity}</span>
                <button class="quantity-btn increase" data-index="${index}">+</button>
            </td>
            <td>Rs. ${itemTotal}</td>
            <td><button class="remove-btn" data-index="${index}">Remove</button></td>
        `;
        table.appendChild(row);
    });

    cartTable.appendChild(table);

    const footer = document.createElement('div');
    footer.className = 'cart-footer';
    footer.innerHTML = `
        <span class="total-amount"><i class="icon">💰</i>Total: Rs. ${totalAmount}</span>
        <button class="place-order-btn"><i class="icon">🛒</i>Place Order</button>
    `;
    cartTable.appendChild(footer);

    attachEventListeners();
}

// Attach Event Listeners
function attachEventListeners() {
    // Increase quantity
    document.querySelectorAll('.quantity-btn.increase').forEach(button => {
        button.addEventListener('click', () => {
            const index = parseInt(button.getAttribute('data-index'), 10);
            cart[index].quantity += 1;
            renderCart();
            updateCartNotification();
        });
    });

    // Decrease quantity
    document.querySelectorAll('.quantity-btn.decrease').forEach(button => {
        button.addEventListener('click', () => {
            const index = parseInt(button.getAttribute('data-index'), 10);
            if (cart[index].quantity > 1) {
                cart[index].quantity -= 1;
            } else {
                cart.splice(index, 1);
            }
            renderCart();
            updateCartNotification();
        });
    });

    // Remove item
    document.querySelectorAll('.remove-btn').forEach(button => {
        button.addEventListener('click', () => {
            const index = parseInt(button.getAttribute('data-index'), 10);
            cart.splice(index, 1);
            renderCart();
            updateCartNotification();
        });
    });

    // Place order
    document.querySelector('.place-order-btn')?.addEventListener('click', generateBill);
}

// Update Cart Notification
function updateCartNotification() {
    const cartNotify = document.querySelector('.cartNotify');
    if (cartNotify) {
        const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
        cartNotify.textContent = totalItems; 
    }
}

// Add Product Button to Cart
document.querySelectorAll('.pr-btn').forEach((button) => {
    button.addEventListener('click', () => {
        const product = button.closest('.products');
        if (!product) {
            console.error('Product container not found.');
            return;
        }

        const productName = product.querySelector('.prname')?.textContent;
        const productPriceText = product.querySelector('.price')?.textContent;
        const productImage = product.querySelector('.productImage')?.src;

        if (!productName || !productPriceText || !productImage) {
            console.error('Product details are missing or incomplete.');
            console.log({ productName, productPriceText, productImage });
            return;
        }

        const productPrice = parseInt(productPriceText.replace('Rs. ', ''), 10);
        if (isNaN(productPrice)) {
            console.error('Product price is not a valid number.');
            console.log({ productPriceText });
            return;
        }

        console.log(`Adding to cart: ${productName}, Rs. ${productPrice}`);
        addToCart(productName, productPrice, productImage);
    });
});

// Generate Bill
function generateBill() {
    if (cart.length === 0) {
        alert('Your cart is empty!');
        return;
    }

    // Open a new window
    const billWindow = window.open('', '_blank', 'width=800,height=600');
    if (!billWindow) {
        alert('Unable to open the bill. Please disable pop-up blockers and try again.');
        return;
    }

    const totalAmount = cart.reduce((total, item) => total + item.price * item.quantity, 0);

    // Generate Bill HTML
    const billHTML = `
    <html>
    <head>
        <title>Order Estimate</title>
        <style>
            body {
                font-family: 'Arial', sans-serif;
                margin: 20px;
                background-color: #f7f7f7;
            }
            h1 {
                text-align: center;
                color: #4CAF50;
                font-size: 36px;
                margin-bottom: 30px;
            }
            .header {
                text-align: center;
                margin-bottom: 40px;
            }
            .header img {
                max-width: 200px;
                height: auto;
                margin-bottom: 20px;
            }
            table {
                width: 100%;
                border-collapse: collapse;
                margin: 20px 0;
                background-color: #ffffff;
                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                border-radius: 10px;
                overflow: hidden;
            }
            th, td {
                border: 1px solid #ddd;
                padding: 12px 15px;
                text-align: left;
            }
            th {
                background-color: #4CAF50;
                color: white;
                font-size: 16px;
            }
            td {
                font-size: 14px;
                color: #555;
            }
            td img {
                width: 60px;
                height: 60px;
                object-fit: cover;
                border-radius: 8px;
            }
            .total {
                text-align: right;
                font-weight: bold;
                font-size: 22px;
                margin-top: 30px;
                color: #4CAF50;
            }
            .footer {
                text-align: center;
                margin-top: 40px;
                font-size: 14px;
                color: #888;
            }
            .footer a {
                color: #4CAF50;
                text-decoration: none;
                font-weight: bold;
            }
        </style>
    </head>
    <body>
        <div class="header">
            <img src="images/logo.jpeg" alt="Company Logo"> <!-- Replace with actual logo -->
            <h1>Order Estimate</h1>
        </div>

        <table>
            <tr>
                <th>Product Image</th>
                <th>Product Name</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Total</th>
            </tr>
            ${cart
                .map(
                    (item) => `
                <tr>
                    <td><img src="${item.image}" alt="${item.name}"></td>
                    <td>${item.name}</td>
                    <td>Rs. ${item.price}</td>
                    <td>${item.quantity}</td>
                    <td>Rs. ${item.price * item.quantity}</td>
                </tr>`
                )
                .join('')}
        </table>

        <div class="total">Grand Total: Rs. ${totalAmount}</div>

        <div class="footer">
            <p>Thank you for shopping with us!</p>
            <p>For any inquiries, contact us at <a href="mailto:ravimurugan41sa@gmail.com">ravimurugan41sa@gmail.com</a></p>
        </div>
    </body>
    </html>
`;

    billWindow.document.open();
    billWindow.document.write(billHTML);
    billWindow.document.close();

    cart = [];
    renderCart();
    updateCartNotification();
}
