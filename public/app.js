/**
 * Frontend logic
 * 
 */


const app = {};

//app.config
app.config = {
    authorizationToken: false,
    api: 'http://localhost:5000/api',
}

app.uploadProduct = function(e){
    e.preventDefault();
    const form = e.target;
    const files = form.elements.files.files;
    console.log(files);
    console.log(form.elements.name.value);
    const formData = new FormData();
    formData.append('name', form.elements.name.value);
    formData.append('price', form.elements.price.value);
    formData.append('cancelledPrice', form.elements.cancelled_price.value);
    formData.append('category', form.elements.category.value);
    formData.append('label', form.elements.label.value);
    formData.append('features', form.elements.features.value);
    formData.append('description', form.elements.description.value);
    
    for(let i = 0; i < files.length; i++){
        formData.append('files', form.elements.files.files[i]);
    }
    
    
    axios({
        method: 'POST',
        url: 'http://localhost:5000/api/products',
        data: formData,
        headers: {
            'Content-type': 'multipart/form-data',
        }
    })
    
}


app.dataUploading = function(){
    //check if the form exist on the page
    if(document.getElementById('uploadForm')){
        //Add the submit event listener
        document.getElementById('uploadForm').addEventListener('submit', app.uploadProduct);
    }
}

/**
 * Cart logic start here
 * 
 */
app.cartLogic = function(){
    //Sync cat data on dom
    app._cart.syncDom();
    //Check the button exist
    if(document.querySelectorAll('.product-card .card-btn')){
        //Select all the btns
        const allBtns = document.querySelectorAll('.product-card .card-btn');
        //Bind all buttons to an event
        for(let btn of allBtns){
            btn.addEventListener('click', app._cart.addToCart);
        };
    }
    // Check if it is the cart page
    if(document.querySelector('.cart-page')){
        // If it the cart page call a function that processses the cart page
        app._cart.appendCartItems();
        // Removing items from cart incremeting items qty etc.
        // app._cart.cartPageLogic();
    }
};

//Conatiner for cart methods
app._cart = {};

//Add product to the cart after being clicked
app._cart.addToCart = function(e){
    //Get the product id, price, name, image
    const id = e.target.dataset.id;
    const price = e.target.dataset.price;
    const image = e.target.dataset.image;
    const name = e.target.dataset.name;
    //Get the lastest version of the cart
    const cart = app._cart.get();
    //Check if the product is present
    if(!cart.hasOwnProperty(id)){
        cart[id] = {
            price,
            name,
            image,
            qty: 1
        };
        app._cart.showNoficationMessage();
        e.target.classList.add('disabled');
    }
    //set back the cart
    app._cart.set(cart);
}

//Get the latest cart
app._cart.get = function(){
    let cart = localStorage.getItem('cart');
    if(cart !== null){
        try {
            cart = JSON.parse(cart);
        }catch(e){
            console.log(e);
            cart = {};
        }
    }else{
        cart = {};
    }

    return cart;
};

//set the cart
app._cart.set = function(obj){
    obj = typeof obj === 'object' && obj !== null ? obj : false;

    if(obj){
        let cartString = JSON.stringify(obj);
        localStorage.setItem('cart', cartString)
    }

    app._cart.syncDom();
};
app._cart.syncDom = function(){

    // sycn header values
    const cart = app._cart.get();
    (function(){
    
        const cartTotalItems = document.querySelector('.header-cart .sync-items');
        const cartTotalPrice = document.querySelector('.header-cart .sync-total');
        let totalItems = 0;
        let totalPrice = 0;
    
        for(let key in cart) {
            totalItems += 1;
            totalPrice += Number(cart[key].price) * Number(cart[key].qty);
        }
        cartTotalItems.innerHTML = totalItems;
        cartTotalPrice.innerHTML = totalPrice;
    })();

    //Disable all the disabled buttons
    if(document.querySelectorAll('.product-card .card-btn')) {
        (function(){        
            const cardBtns = document.querySelectorAll('.product-card .card-btn');
            for(let btn of cardBtns) {
                const productId = btn.dataset.id;
                for(let key in cart) {
                    if(productId === key){
                        btn.classList.add('disabled');
                    }
                }
            }
        })();
    }
    if(document.querySelector('.cart-page')){
        // sync subtotals
        (function(){
            const cart = app._cart.get();
            const allSubTotals = document.querySelectorAll('.cart-page .item .sub-total');
            for(let key in cart){
                let subTotal = Number(cart[key].price * Number(cart[key].qty));
                for(let sub of allSubTotals){
                    if(sub.dataset.id == key){
                        sub.innerHTML = subTotal;
                    }
                }
            }
        })();
    
            //sync grand total
        (function(){
            const subtotal = document.querySelector('.cart-page .checkout .subtotal-p');
            const grand_total = document.querySelector('.cart-page .checkout .grandtotal-p');
            let grandTotal = 0;
            const cart = app._cart.get();
            for(let key in cart){
                let subtotal = Number(cart[key].price) * Number(cart[key].qty);
                grandTotal += subtotal;
            }
            subtotal.innerHTML = grandTotal;
            grand_total.innerHTML = grandTotal;
        })();
    }
}

// Function that appends all the items to the cart page
app._cart.appendCartItems = function(){
    // The the cart from the local storage
    const cart = app._cart.get();
    let cartItems = '';
    for(let key in cart){
        cartItems += `
                <div class="item">
                    <div class="image">
                        <div>
                            <p id="${key}" class="close" data-id="${key}">
                               X
                            </p>
                            <img width="50px" src="/images/5bdee7b9bb309aec9b8a049ff2140ea4.png" alt="">
                        </div>
                    </div>
                    <div class="name">
                        <p>${cart[key].name}</p>
                    </div>
                    <div class="unit-price">
                        <p>${cart[key].price}</p>
                    </div>
                    <div class="qty">
                        <div>
                            <button class="decrease" data-id="${key}"> - </button>
                            <input value="${cart[key].qty}" type="text" data-id="${key}" class="quantity" name="price" autocomplete="off">
                            <button data-id="${key}" class="increase"> + </button>                            
                        </div>
                    </div>
                    <div data-id="${key}" class="sub-total">2000</div>
                </div>
        `;
    }

    // Append the cart items to the parent div
    const itemsParentDiv = document.querySelector('.cart-page .cart-body .items-body');
    if(cartItems.length > 0){
        itemsParentDiv.innerHTML = cartItems;
    }else{
        itemsParentDiv.innerHTML = ""; 
    }

    //add event Listener to the new items
    const closeBtns = document.querySelectorAll('.cart-page .cart-body .item .close');
    for(let btn of closeBtns){
        btn.addEventListener('click', app._cart.removeItemFromCart);
    }

    // select all increase and decrease buttons
    const increaseBtns = document.querySelectorAll('.cart-page .item .increase');
    const decreaseBtns = document.querySelectorAll('.cart-page .item .decrease');

    for(let increaseBtn of increaseBtns){
        increaseBtn.addEventListener('click', app._cart.increaseItem);            
    }
    for(let decreaseBtn of decreaseBtns){
        decreaseBtn.addEventListener('click', app._cart.decreaseItem);
    }

    app._cart.syncDom();
}


app._cart.increaseItem = function(e){
    const btn = e.target;
    const productId = btn.dataset.id;
    const cart = app._cart.get();

    const inputs = document.querySelectorAll('.cart-page .item .quantity');
    for(let input of inputs){
        if(input.dataset.id == productId){
            const previousValue = Number(input.value);
            input.value = previousValue + 1;
            cart[productId].qty = previousValue + 1
        }
    }
    app._cart.set(cart);
    app._cart.syncDom();
};

app._cart.decreaseItem = function(e){
    const btn = e.target;
    const productId = btn.dataset.id;
    const cart = app._cart.get();

    const inputs = document.querySelectorAll('.cart-page .item .quantity');
    for(let input of inputs){
        if(input.dataset.id == productId){
            const previousValue = Number(input.value);
            if(previousValue < 2){
                input.value = 1;
                cart[productId].qty = 1;
            }else{
                input.value = previousValue - 1;
                cart[productId].qty = previousValue - 1;            }
        }
    }
    app._cart.set(cart);
    app._cart.syncDom();
};


app._cart.removeItemFromCart = function(e){
    let productId = e.target.dataset.id;
    const cart = app._cart.get();
    delete cart[productId];
    app._cart.set(cart);
    // Reappend the cart items;
    app._cart.appendCartItems();
};


//Show notification after cart is added to the cart for first time
app._cart.showNoficationMessage = function(){
    const notification = document.querySelector('.body .notification');
    notification.classList.add('show');
    
    setTimeout(function(){
        notification.className = 'notification';
    }, 1000);
};


//Cart logic end


// Login
app.login = function(){
    if(document.getElementById('login-form')){
        document.getElementById('login-form').addEventListener('submit', app.handleLoginEvent);
    }
};
app.handleLoginEvent = async function(e){
    e.preventDefault();
    const form = e.target;
    const email = form.elements.email.value;
    const password = form.elements.password.value;
    const body = {
        "email": email,
        "password": password
    };
    const bodyString = JSON.stringify(body);
    

    try{
        app._login.setFeedBack(true, true, false);
        // const res = await axios({
        //     method: 'post',
        //     url: app.config.api + '/users',
        //     body: {
        //         email: email,
        //         password: password
        //     },
        //     headers: {
        //         'Content-Type': 'application/json',
        //     }           
        // });
        
        const res = await fetch( app.config.api + '/users', {
            method: 'post',
            body: bodyString,
            headers: {
                'Content-Type': 'application/json',
            }
        });
        app._login.setFeedBack(false, false, false);
        
        if(res.status == 200){
            window.location = 'http://localhost:5000';
        }
        if(res.status == 400){
            const data = await res.json();
            const errors = data.errors;
            if(errors.email.length > 0){
                const emailErrorSpan = document.querySelector('.email-error');
                console.log(emailErrorSpan);
                console.log(errors.email[0]);
                emailErrorSpan.style.display = 'block'
                emailErrorSpan.innerHTML = errors.email[0];
            }
            if(errors.password.length > 0){
                const passwordErrorSpan = document.querySelector('.password-error');
                passwordErrorSpan.style.display = 'block'
                passwordErrorSpan.innerHTML = errors.password[0];
            }
            app._login.setFeedBack(true, false, true);
        } 
    }catch(e){
        console.log(e);
    }


}

//Conatiner for login submethods
app._login = {};
app._login.setFeedBack = function(showFeedback, showProcessing, showError){
    const feedBack = document.querySelector('.login-page .feedback-info');
    const processing = document.querySelector('.login-page .feedback-info .processing');
    const errorDiv = document.querySelector('.login-page .feedback-info .error');

    if(showFeedback) feedBack.classList.add('visible');
    else feedBack.className = 'feedback-info';
    if(showProcessing) {
        processing.className = 'processing';
        errorDiv.className = 'error none';
    }
    if(showError){
        processing.className = 'processing none';
        errorDiv.className = 'error';     
    }
}




// end Login
app.singleProduct = function(){
    if(document.querySelector('.single-product .products-info-container .controls .control')){
        const controls = document.querySelectorAll('.single-product .products-info-container .controls .control');
        for(let control of controls){
            control.addEventListener('click', app._singleProduct.handleClick);
        }
    }
};
app._singleProduct = {};
app._singleProduct.handleClick = function(e){
    //Select the container for the image
    const imgContainer = document.querySelector('.single-product .products-info-container .top .img');
    // grab the image url
    const imageUrl = e.currentTarget.dataset.image;
    const nextImage = `<img src="${imageUrl}" alt="product">`
    const newImage = document.createElement('img');
    newImage.setAttribute('src', imageUrl);
    newImage.setAttribute('alt', 'Product');
    
    imgContainer.innerHTML = nextImage;
}

// UI elements

app.uiElementsLogic = function(){
    //Make the header sticky
    if(document.querySelector('.main-header')){
        app._uiElementsLogic.stickyHeader();
    }
}

app._uiElementsLogic = {};

app._uiElementsLogic.stickyHeader = function(){
    // console.log('mia')
    const header = document.querySelector('.main-header');
    const headerHeigth = header.getBoundingClientRect().height;
    console.log(headerHeigth);
    window.addEventListener('scroll', function(e){
        if(window.pageYOffset > headerHeigth){
            header.classList.add('fixed-header');
        }else {
            if(header.classList.contains('fixed-header')) header.classList.remove('fixed-header');
        }
    })
}

//End of UI elements

app.init = function(){
    //Handle the data uploading
    app.dataUploading();
    //Logic for login form
    app.login(); 
    //Cart logic
    app.cartLogic();
    // Single-product
    app.singleProduct();
    //Make the header sticky after some point
    app.uiElementsLogic();
};

window.onload = function(event){
    app.init();
};