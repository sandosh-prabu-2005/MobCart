document.getElementById('search-icon').addEventListener('click', function () {
    const searchInput = document.getElementById('search-input');
    const searchIcon = document.getElementById('search-icon');
    searchInput.classList.toggle('show');
    searchIcon.classList.toggle('small');
});

// Array to store cart items
let cart = [];

// Function to add an item to the cart
function addToCart(productName, productPrice, productImage) {
    // Check if the product is already in the cart
    const existingItem = cart.find(item => item.name === productName);
    if (existingItem) {
        existingItem.quantity += 1; // Increase quantity if already in cart
    } else {
        // Add a new product to the cart
        cart.push({ name: productName, price: productPrice, quantity: 1, image: productImage });
    }

    // Update cart UI
    renderCart();
    updateCartNotification();
}

// Function to render the cart table
function renderCart() {
    const cartTable = document.getElementById('cartTable');
    cartTable.innerHTML = ''; // Clear the current cart table

    // Check if cart is empty
    if (cart.length === 0) {
        cartTable.innerHTML = '<p>Your cart is empty!</p>';
        return;
    }

    // Create a table structure
    const table = document.createElement('table');
    table.className = 'cart-table';

    // Add table headers
    const headers = `<tr>
        <th>Product Image</th>
        <th>Product Name</th>
        <th>Price</th>
        <th>Quantity</th>
        <th>Total</th>
    </tr>`;
    table.innerHTML = headers;

    // Add rows for each item in the cart
    cart.forEach(item => {
        const row = `<tr>
            <td><img src="${item.image}" alt="${item.name}" class="cart-product-img"></td>
            <td>${item.name}</td>
            <td>Rs. ${item.price}</td>
            <td>${item.quantity}</td>
            <td>Rs. ${item.price * item.quantity}</td>
        </tr>`;
        table.innerHTML += row;
    });

    // Append the table to the cartTable div
    cartTable.appendChild(table);
}

// Attach event listeners to all "Shop Now!" buttons
document.querySelectorAll('.pr-btn').forEach((button, index) => {
    button.addEventListener('click', () => {
        // Get the product details
        const product = button.closest('.products');
        const productName = product.querySelector('.prname').textContent;
        const productPrice = parseInt(product.querySelector('.price').textContent.replace('Rs. ', ''), 10);
        const productImage = product.querySelector('.productImage').src;

        // Add the product to the cart
        addToCart(productName, productPrice, productImage);
    });
});

function updateCartNotification() {
    const cartNotify = document.querySelector('.cartNotify');
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    cartNotify.textContent = totalItems; // Update the cart icon with the total items
}
// Function to render the cart table
function renderCart() {
    const cartTable = document.getElementById('cartTable');
    cartTable.innerHTML = ''; // Clear the current cart table

    // Check if cart is empty
    if (cart.length === 0) {
        cartTable.innerHTML = '<p>Your cart is empty!</p>';
        return;
    }

    // Create a table structure
    const table = document.createElement('table');
    table.className = 'cart-table';

    // Add table headers
    const headers = `<tr>
        <th>Product Image</th>
        <th>Product Name</th>
        <th>Price</th>
        <th>Quantity</th>
        <th>Total</th>
    </tr>`;
    table.innerHTML = headers;

    // Add rows for each item in the cart
    cart.forEach((item, index) => {
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
            <td>Rs. ${item.price * item.quantity}</td>
        `;

        table.appendChild(row);
    });

    // Append the table to the cartTable div
    cartTable.appendChild(table);

    // Add event listeners to the increase and decrease buttons
    document.querySelectorAll('.quantity-btn.increase').forEach(button => {
        button.addEventListener('click', () => {
            const index = parseInt(button.getAttribute('data-index'), 10);
            cart[index].quantity += 1; // Increase quantity
            renderCart();
            updateCartNotification();
        });
    });

    document.querySelectorAll('.quantity-btn.decrease').forEach(button => {
        button.addEventListener('click', () => {
            const index = parseInt(button.getAttribute('data-index'), 10);
            if (cart[index].quantity > 1) {
                cart[index].quantity -= 1; // Decrease quantity
            } else {
                cart.splice(index, 1); // Remove item if quantity reaches 0
            }
            renderCart();
            updateCartNotification();
        });
    });
}

// Function to update the cart notification
function updateCartNotification() {
    const cartNotify = document.querySelector('.cartNotify');
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    cartNotify.textContent = totalItems; // Update the cart icon with the total items
}
document.addEventListener('DOMContentLoaded', function () {
    // Get the cart icon and cart table
    const cartIcon = document.querySelector('.cartIcon'); // Ensure '.cartIcon' matches the class in your HTML
    const cartTable = document.getElementById('cartTable');

    if (cartIcon && cartTable) {
        // Toggle cart table visibility
        cartIcon.addEventListener('click', function () {
            cartTable.classList.toggle('visible');
        });

        // Add CSS for visibility
        const style = document.createElement('style');
        style.innerHTML = `
            #cartTable {
                display: none;
            }
            #cartTable.visible {
                display: block;
            }
        `;
        document.head.appendChild(style);
    } else {
        console.error('Cart icon or cart table not found.');
    }
});
