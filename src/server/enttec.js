'use strict'

var serialport  = require('serialport');
var Promise     = require('bluebird');

var cfg         = require('../config');

const    ENTTEC_PRO_DMX_STARTCODE = 0x00
       , ENTTEC_PRO_START_OF_MSG  = 0x7e
       , ENTTEC_PRO_END_OF_MSG    = 0xe7
       , ENTTEC_PRO_SEND_DMX_RQ   = 0x06
       , ENTTEC_PRO_RECV_DMX_PKT  = 0x05
       ;

var enttec = {
    dmx: {},
    midi: {}
};

// ## Public functions
//

enttec.init = function() {
    return new Promise((resolve,reject) => {
        enttec.dmx.universe = new Buffer(512);
        enttec.dmx.universe.fill(0);

        serialport.list(function (err, ports) {
          ports.forEach(function(port) {
            //console.log(port);
          });
        });


        enttec._dev = new serialport.SerialPort(cfg.enttecPath, {
            'baudrate': 250000,
            'databits': 8,
            'stopbits': 2,
            'parity': 'none'
        }, true, function(err) {
            if(!err) {
                _sendDmxUniverse();
                resolve();
            } else {
                reject(err);
            }
        });
    });
}

enttec.close = function(cb) {
    enttec._dev.close(cb);
}

// DMX-related functions

enttec.dmx.update = function(u) {
    for(var c in u) {
        enttec.dmx.universe[c] = u[c];
    }
    _sendDmxUniverse();
}

enttec.dmx.updateAll = function(v) {
    for(var i = 0; i < 512; i++) {
        enttec.dmx.universe[i] = v;
    }
}

enttec.dmx.getChannel = function(c) {
    return enttec.dmx.universe[c];
}

// ## Private functions
//

function _sendDmxUniverse() {
    if(!enttec._dev.isOpen()) {
        return;
    }
    var hdr = Buffer([
        ENTTEC_PRO_START_OF_MSG,
        ENTTEC_PRO_SEND_DMX_RQ,
         (enttec.dmx.universe.length + 1)       & 0xff,
        ((enttec.dmx.universe.length + 1) >> 8) & 0xff,
        ENTTEC_PRO_DMX_STARTCODE
    ]);

    var msg = Buffer.concat([
        hdr,
        enttec.dmx.universe,
        Buffer([ENTTEC_PRO_END_OF_MSG])
    ]);
    enttec._dev.write(msg);
};

module.exports = enttec;
