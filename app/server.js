/**
 * Server logic
 * 
 */

//Dependencies
require('./Models');
const express = require('express');
const pages = require('./routes/pages');
const apiCallbacks = require('./callbacks/apiCallbacks');
const ejs = require('ejs');
const path = require('path');
const multer = require('multer');
const crypto = require('crypto');

//Global variables
const app = express();
const storage = multer.diskStorage({
    destination: path.join(__dirname, '/../public/images'),
    filename: function(req, file, cb){
        crypto.pseudoRandomBytes(16, function (err, raw) {
            cb(null, raw.toString('hex') + path.extname(file.originalname));
        });
    }
});

const upload = multer({storage: storage});

//middlewares
app.use(express.static(path.join(__dirname, '/../public')));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/../public/views'));
app.use(express.json());
app.use('/', pages);


//Routes
app.all('/api/:resource', upload.array('files'), apiCallbacks.api);

//callbacks

const startServer = function(){
    app.listen(5000, function(){
        console.log('Listening on port 5000');
    })
} 

module.exports = startServer;