const express = require('express');
var router = express.Router();
const axios = require('axios');
const callbacks = require('../callbacks/pagesCallbacks');


router.get('/', callbacks.homePage);
router.get('/upload', callbacks.uploadProduct);
router.get('/register', callbacks.registerPage);
router.get('/cart', callbacks.cartPage);
router.get('/single-product/:id', callbacks.singleProductPage);

module.exports = router;