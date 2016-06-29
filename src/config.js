'use strict'
var path = require('path');

var cfg = {};

cfg.env = process.env.NODE_ENV || 'development';

cfg.rootPath = path.resolve(__dirname, '..');
cfg.publicPath = cfg.rootPath + '/public';

cfg.httpPort = process.env.MOONLIGHT_HTTP_PORT || 4000;
cfg.httpAddress = process.env.MOONLIGHT_HTTP_ADDRESS || 'localhost';

cfg.ioPort = process.env.MOONLIGHT_IO_PORT || 4001;

cfg.enttecAPIKey = process.env.MOONLIGHT_ENTTEC_APIKEY;

module.exports = cfg;
