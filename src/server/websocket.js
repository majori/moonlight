'use strict'
var logger = require('../logger');
var cfg    = require('../config');

module.exports = function(io, dmx) {
    io.on('connection', (socket) => {

        // Dev options
        if (cfg.env === 'development') {
            logger.debug('Client connected, id: ' + socket.id);

            socket.on('ping:res', (pingStart) => {
                let pingStop = Date.now();
                logger.debug('Latency: '+(pingStop-pingStart)+'ms');
            });
            socket.emit('ping:req', Date.now());

            socket.on('disconnect', () => {
                logger.debug('Client disconnected, id: ' + socket.id);
            });
        }

        socket.on('universe:req', () => {
            socket.emit('universe:res', dmx.get_universe());
        });

        socket.on('patch:channels:req', () => {
            socket.emit('patch:channels:res', dmx.get_heads());
        })
    });
};
