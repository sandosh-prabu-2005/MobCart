document.getElementById('search-icon')?.addEventListener('click', function () {
    const searchInput = document.getElementById('search-input');
    const searchIcon = document.getElementById('search-icon');
    if (searchInput && searchIcon) {
        searchInput.classList.toggle('show');
        searchIcon.classList.toggle('small');
    }
});
function toggleCart() {
    const cart = document.getElementById("cart");
    cart.classList.toggle("openCart");
}

document.getElementById('search-input')?.addEventListener('keyup', function () {
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

let cart = [];

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

    document.querySelectorAll('.quantity-btn.increase').forEach(button => {
        button.addEventListener('click', () => {
            const index = parseInt(button.getAttribute('data-index'), 10);
            cart[index].quantity += 1;
            renderCart();
            updateCartNotification();
        });
    });

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

    document.querySelectorAll('.remove-btn').forEach(button => {
        button.addEventListener('click', () => {
            const index = parseInt(button.getAttribute('data-index'), 10);
            cart.splice(index, 1);
            renderCart();
            updateCartNotification();
        });
    });

    document.querySelector('.place-order-btn').addEventListener('click', () => {
        alert(`Your order has been placed successfully! Total amount: Rs. ${totalAmount}`);
        cart = [];
        renderCart();
        updateCartNotification();
    });
}

function updateCartNotification() {
    const cartNotify = document.querySelector('.cartNotify');
    if (cartNotify) {
        const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
        cartNotify.textContent = totalItems; 
    }
}
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
