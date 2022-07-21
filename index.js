//Dependencies
const server = require('./app/server');

var app = {};

app.init = function(){
    //start the server
    server();
}

app.init();