'use strict';
var debug = require('debug');
var express = require('express');
var path = require('path');
var cookieSession = require('cookie-session');

const dotenv = require('dotenv');
dotenv.config();

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');


var passport = require('passport');
app.use(cookieSession({
    name: 'session',
    keys: [process.env.SECRET_KEY],
    maxAge: parseInt(process.env.SESSION_TIME_IN_SECOND, 10) * 1000
}));

app.use(function (req, res, next) {
    res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    res.header('Expires', '-1');
    res.header('Pragma', 'no-cache');
    next();
});

app.use('/', require('./routes/main-routes'));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found lol');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.send('<div>' + err.message + '</div>');
    });
}

app.set('port', process.env.PORT || 3000);

var server = app.listen(app.get('port'), function() {
    debug('Express server listening on port ' + server.address().port);
});
