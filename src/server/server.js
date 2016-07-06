var express = require('express');
var app     = express();
var server  = require('http').createServer(app);
var sio      = require('socket.io')(server);

var cfg     = require('../config');
var logger  = require('../logger');
var socket  = require('./websocket');
var routes  = require('./routes');
var dmx     = require('./backend/build/Release/dmx_addon.node');

var errMsg = dmx.get_error_msg();
if (errMsg) logger.error('DMX driver: ' + errMsg);

app.use(express.static(cfg.publicPath + '/views'));
app.use('/assets', express.static(cfg.publicPath + '/assets'));

// Configure routes
routes(app);

app.listen(cfg.httpPort, cfg.httpAddress, () => {
    logger.info('HTTP-server listening on http://' + cfg.httpAddress + ':' + cfg.httpPort);
});

// Map websocket events
socket(sio, dmx);

server.listen(cfg.ioPort, cfg.httpAddress, () => {
    logger.info('Socket.IO listening on http://' + cfg.httpAddress + ':' + cfg.ioPort);
});

process.on('SIGINT', () => {
    process.exit(0);
});
