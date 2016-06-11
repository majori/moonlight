'use strict'

var express = require('express');
var app     = express();
var server  = require('http').createServer(app);
var io      = require('socket.io')(server);

var cfg     = require('../config');
var logger  = require('../logger');
var dmx     = require('./dmx');
var enttec  = require('./enttec');

app.use(express.static(cfg.publicPath + '/views'));
app.use('/assets', express.static(cfg.publicPath + '/assets'));

app.listen(cfg.httpPort, () => {
    logger.info('Server listening on port ' + cfg.httpPort);
});

app.get('/', (req, res) => {
    res.sendFile('/views/index.html');
});

process.on('SIGINT', () => {
    enttec.close();
    process.exit(0);
});
