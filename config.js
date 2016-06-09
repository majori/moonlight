'use strict'

const APP_NAME = 'light_controller';

var cfg = {};

cfg.httpPort = process.env[APP_NAME.toUpperCase() + '_HTTP_PORT'] || 5000;

cfg.enttecPath = process.env[APP_NAME.toUpperCase() + '_ENTTEC_PATH'] || '/dev/ttyUSB0';

module.exports = cfg;