'use strict'
var logger = require('../logger');
var cfg    = require('../config');

// TODO: Create better unpatched head handling
var unpatched_heads = [
    require('./heads/adj_megatripar.json'),
    require('./heads/generic_channel.json'),
    require('./heads/generic_led.json'),
    require('./heads/martin_pro_518.json'),
    require('./heads/stairville_ledpar56.json')
];

module.exports = function(sio, dmx) {
    sio.on('connection', (socket) => {

        // Dev options
        if (cfg.env === 'development') {
            logger.debug('Client connected, id: ' + socket.id);

            socket.on('ping:res', (pingStart) => {
                let pingStop = Date.now();
                logger.debug('Latency: ' + (pingStop - pingStart) + 'ms');
            });
            socket.emit('ping:req', Date.now());

            socket.on('disconnect', () => {
                logger.debug('Client disconnected, id: ' + socket.id);
            });
        }

        socket.on('universe:req', () => {
            logger.debug('Socket: universe:req');
            socket.emit('universe:res', dmx.get_universe());
        });

        socket.on('patch:patched_heads:req', () => {
            logger.debug('Socket: patch:patched_heads:req');
            socket.emit('patch:patched_heads:res', dmx.get_heads());
        });

        socket.on('patch:unpatched_heads:req', () => {
            logger.debug('Socket: patch:unpatched_heads:req');
            socket.emit('patch:unpatched_heads:res', unpatched_heads);
        });
    });
};
