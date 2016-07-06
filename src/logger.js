var winston = require('winston');
var cfg     = require('./config');

// Logging config
var consoleLog = new (winston.transports.Console)({
    name: 'default-console',
    timestamp: _formatTimestamp(),
    level: (cfg.env === 'production') ? 'info' : 'debug',
    colorize: true
});

var fileLog = function(logLocation) {
    return new (winston.transports.File)({
        name: 'default-file',
        filename: __dirname + '/' + logLocation,
        level: 'info',
        timestamp: _formatTimestamp(),
        formatter: function(options) {
            return _formatTimestamp() + '--' +
            options.level.toUpperCase() + '--' +
            (undefined !== options.message ? options.message : '');
        },
        maxsize: 10000000,
        json: false
    });
};

var logOptions = {};
switch (cfg.env) {
    case 'development':
        logOptions.transports = [consoleLog];
        break;

    case 'production':
        logOptions.transports = [consoleLog, fileLog('output.log')];
        break;

    case 'test':
        logOptions.transports = [fileLog('test/test.log')];
        break;

    default:
        break;
}

module.exports = new (winston.Logger)(logOptions);

function _formatTimestamp() {
    var timestamp = new Date();
    return timestamp.getFullYear() + '-'
        + timestamp.getMonth() + '-'
        + timestamp.getDate() + 'T'
        + timestamp.getHours() + ':'
        + timestamp.getMinutes() + ':'
        + timestamp.getSeconds();
}
