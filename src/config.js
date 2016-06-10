'use strict'
var path = require('path');

var cfg = {};

cfg.env = process.env.NODE_ENV || 'development';

cfg.rootPath = path.resolve(__dirname, '..');
cfg.publicPath = cfg.rootPath + '/public';

cfg.httpPort = process.env.MOONLIGHT_HTTP_PORT || 5000,

cfg.enttecPath = process.env.MOONLIGHT_ENTTEC_PATH || '/dev/ttyUSB0';
cfg.enttecAPIKey = process.env.MOONLIHGT_ENTTEC_APIKEY;

module.exports = cfg;
