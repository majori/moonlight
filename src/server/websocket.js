var logger = require('../logger');

module.exports = function(io) {
    io.on('connection', (socket) => {
        logger.info('Client connected, id: ' + socket.id);
    });
};
