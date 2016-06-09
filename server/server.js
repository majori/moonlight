'use strict'

var express = require('express');
var app     = express();
var server  = require('http').createServer(app);
var io      = require('socket.io')(server);

var cfg     = require('../config');
var enttec  = require('./enttec');

app.listen(cfg.httpPort, () => {
    console.log('Server listening on port ' + cfg.httpPort);
});

enttec.init()
.then(() => {
    console.log('Enttec connected succesfully');
})
.catch((err) => {
    console.log(err);
});

