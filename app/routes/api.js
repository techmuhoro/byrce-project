

//File dependencies
const express = require('express');
const callbacks = require('../callbacks/apiCallbacks');
var router = express.Router();


router.get('/ping', function(req, res){
    res.json({'msg': 'App is working'});
});
router.all('/:resource', callbacks.api);



module.exports = router;