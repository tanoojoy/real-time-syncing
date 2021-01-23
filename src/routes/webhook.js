'use strict'
let client = require('../../sdk/client');
let express = require('express');
let webhookRouter = express.Router();

webhookRouter.post('/sso', function(req, res, next){
    console.log(req.body);
    
});

module.exports = webhookRouter;