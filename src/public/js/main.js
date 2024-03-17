let cartIcon = document.querySelector("#cart-icon");
let cart = document.querySelector(".cart");
let closeCart = document.querySelector("#close-cart");
let cartItems = []; // Added cartItems array

cartIcon.onclick = () =>{
     cart.classList.add("active");
}

closeCart.onclick = () =>{
    cart.classList.remove("active");
}

//Payment 
document.addEventListener('DOMContentLoaded', function() {
    const payNowButton = document.querySelector('.btn-buy');

    payNowButton.addEventListener('click', async function() {
        try {
            const cartItems = getCartItemsFromLocalStorage(); // Implement this function
            const username = 'testuser'; // Replace with actual username logic

            const response = await fetch('/checkout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, cartItems })
            });

            if (response.ok) {
                alert('Items added to product collection successfully');
            } else {
                const errorMessage = await response.json();
                alert(`Error: ${errorMessage.message}`);
            }
        } catch (error) {
            console.error('Error adding items to product collection:', error);
            alert('Error adding items to product collection. Please try again later.');
        }
    });
});

function getCartItemsFromLocalStorage() {
    const cartItemsJSON = localStorage.getItem('cartItem');
    return JSON.parse(cartItemsJSON) || [];
}

//Profile Page
document.addEventListener('DOMContentLoaded', () => {
    fetch('/profile')
        .then(response => response.json())
        .then(data => {
            document.getElementById('username').textContent = data.username;
            document.getElementById('email').textContent = data.email;
        })
        .catch(error => console.error('Error fetching profile data:', error));
});

// Check if cartItem exists in localStorage
if(localStorage.getItem('cartItem')) {
    // Clear cartItem
    localStorage.removeItem('cartItem');
}

// Function to add an item to cart
function addToCart(productId) {
    // Your code to add the product to cartItem

    // Save cartItem to localStorage
    localStorage.setItem('cartItem', JSON.stringify(cartItem));
}

// Function to get cart items
function getCartItems() {
    return JSON.parse(localStorage.getItem('cartItem')) || [];
}


if(document.readyState == 'loading'){
    document.addEventListener('DOMContentLoaded' , ready);
}
else{
    ready();     //call the function when page is loaded
}

function ready(){
    //Remove Item from cart
    var removeCartButton = document.getElementsByClassName('cart-remove');
    for(var i = 0 ; i < removeCartButton.length ; i ++)
    {
        var button = removeCartButton[i];
        button.addEventListener("click" , removeCartItem);
    }

    //Quantity Change
    var quantityInputs = document.getElementsByClassName("cart-quantity");
    for(var i = 0 ; i < quantityInputs.length ; i++)
    {
        var input = quantityInputs[i];
        input.addEventListener("change", quantityChanged);
    }

    //Add to cart
    var addCart = document.getElementsByClassName("add-cart"); 
    for(var i = 0 ; i < addCart.length ; i++)
    {
        var button = addCart[i];
        button.addEventListener("click", addCartClicked);
    }

    cartItems = [];
}

//Remove Cart Item
function removeCartItem(event)
{
    var buttonClicked = event.target;
    var cartBox = buttonClicked.parentElement;
    var title = cartBox.querySelector('.cart-product-title').innerText;

    // Remove the item from the cartItems array
    cartItems = cartItems.filter(item => item.title.trim().toLowerCase() !== title.trim().toLowerCase());

    cartBox.remove();
    updatetotal();
}

//Quantity Change
function quantityChanged(event)
{
    var input = event.target;
    if (isNaN(input.value) || input.value <= 0) {
        input.value = 1;
    }

    var cartBox = input.parentElement.parentElement;
    var title = cartBox.querySelector('.cart-product-title').innerText;
    for (var i = 0; i < cartItems.length; i++) {
        if (cartItems[i].title.trim().toLowerCase() === title.trim().toLowerCase()) {
            cartItems[i].quantity = parseInt(input.value);
            break;
        }
    }

    updatetotal();
}

//Add Cart Fuction
function addCartClicked(event)
{
    var button = event.target;
    var shopProducts = button.parentElement;
    var title = shopProducts.getElementsByClassName('porduct-title')[0].innerText;
    var price = shopProducts.getElementsByClassName('price')[0].innerText;
    var productImg = shopProducts.getElementsByClassName('product img')[0].src;
    addProdcutToCart(title,price,productImg);
    updatetotal();
}

function addProdcutToCart(title,price,productImg)
{
    for(var i = 0 ; i < cartItems.length ; i++)
    {
        if (cartItems[i].title.trim().toLowerCase() === title.trim().toLowerCase()) 
        {
            alert('You have already added this item to cart');
            return;
        }
    }
    
    var cartShopBox = document.createElement('div');
    cartShopBox.classList.add('cart-box');
    var cartItemsElement = document.getElementsByClassName('cart-content')[0];
    
    var cartBoxContent = `
    <img src="${productImg}" alt="" class="cart-img" />
    <div class="details-box">
        <div class="cart-product-title">${title}</div>
        <div class="cart-price">${price}</div>
        <input 
            type="number" 
            name="" 
            id="" 
            value="1" 
            class="cart-quantity"
        />
    </div>
    <i class="bx bx-trash-alt cart-remove"></i>`;
    
    cartShopBox.innerHTML = cartBoxContent;
    cartItemsElement.append(cartShopBox);
    
    cartShopBox
        .getElementsByClassName('cart-remove')[0]
        .addEventListener('click' , removeCartItem);
    
    cartShopBox
        .getElementsByClassName('cart-quantity')[0]
        .addEventListener('change' , quantityChanged);

    // Add the item to the cartItems array
    var item = {
        title: title,
        price: price,
        img: productImg,
        quantity: 1
    };
    cartItems.push(item);
    console.log(cartItems);

    updatetotal();


}

// Update Total
function updatetotal() {
    var total = 0;
    for (var i = 0; i < cartItems.length; i++) {
        var price = parseFloat(cartItems[i].price.replace("$", ""));
        var quantity = cartItems[i].quantity;
        total += price * quantity;
    }

    total = Math.round(total * 100) / 100;
    document.getElementsByClassName("total-price")[0].innerText = '$' + total;
}