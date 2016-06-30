'use strict'

var express = require('express');
var app     = express();
var server  = require('http').createServer(app);
var io      = require('socket.io')(server);

var cfg     = require('../config');
var logger  = require('../logger');
var socket  = require('./websocket');
var routes  = require('./routes');
var dmx     = require('./backend/build/Release/dmx_addon.node');

app.use(express.static(cfg.publicPath + '/views'));
app.use('/assets', express.static(cfg.publicPath + '/assets'));

// Configure routes
routes(app);

app.listen(cfg.httpPort, cfg.httpAddress, () => {
    logger.info('Server listening on http://'+cfg.httpAddress+':'+cfg.httpPort);
});

// Map websocket events
socket(io);

server.listen(cfg.ioPort, cfg.httpAddress, () => {
    logger.info('Socket.IO listening on port '+cfg.ioPort);
});

process.on('SIGINT', () => {
    process.exit(0);
});

