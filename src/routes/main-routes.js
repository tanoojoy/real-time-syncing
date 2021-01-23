var express = require('express');
var MainRouter = express.Router();

var webhook = require('./webhook');
MainRouter.use('/webhook', webhook);

module.exports = MainRouter;