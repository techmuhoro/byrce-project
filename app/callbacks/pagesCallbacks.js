/**
 * Main callbacks file for pages
 * 
 * 
 */
//Dependencies
const axios = require('axios');
const helpers = require('../utils/helpers');
const Product = require('../Models/Product');

//container for all callbacks
const callbacks = {};

//Callback for the homePage
callbacks.homePage = async function(req, res){
    let products = await axios.get('http://localhost:5000/api/products');
    res.render('index', {
        data: products.data.data,
    });
};

//Callback to upload a product
callbacks.uploadProduct = function(req, res){
    res.render('upload' );
};

// Register page
callbacks.registerPage = function(req, res){
    res.render('register');
};

// Cart page
callbacks.cartPage = function(req, res){
    res.render('cart');
};

// Single product page
callbacks.singleProductPage = async function(req, res){
    const id = req.params.id;
    const product = await Product.findById(id);

    res.render('singleProduct', {
        product: product,
    });
};



//export the container
module.exports = callbacks;