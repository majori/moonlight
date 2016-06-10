'use strict'

var serialport  = require('serialport');
var Promise     = require('bluebird');
var _           = require('lodash');
var reverse     = require('buffer-reverse');

var cfg         = require('../config');

const   ENTTEC_CODES = {
    DMX_STARTCODE : 0x00,
    START_OF_MSG  : 0x7e,
    END_OF_MSG    : 0xe7,
    SEND_DMX_RQ   : 0x06,
    RECV_DMX_PKT  : 0x05,
    SEND_MIDI_RQ  : 0xc3,
    SET_PORT_RQ   : 0xec,
    GET_PORT_RQ   : 0xc1,
    SET_API_KEY   : 0x0d
};

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
        enttec.devPath = null;

        // Find right serial port
        serialport.list(function (err, ports) {
            ports.forEach(function(port) {
                if (port.manufacturer && port.manufacturer === 'ENTTEC') {
                    enttec.devPath = port.comName;
                }
            });

            if (_.isNull(enttec.devPath)) {
                reject('Enttec serialport not found!');
            } else {
                enttec._dev = new serialport.SerialPort(enttec.devPath, {
                    'baudrate': 250000,
                    'databits': 8,
                    'stopbits': 2,
                    'parity': 'none',
                    'parser': serialport.parsers.raw
                }, true, function(err) {
                    if(err) {
                        reject(err);

                    } else {
                        var initPromises = [];
                        initPromises.push(_setAPIKey());
                        initPromises.push(_initPorts());

                        Promise.all(initPromises)
                        .then(() => {
                            _sendDmxUniverse();
                            resolve();
                        })
                        .catch(reject);
                    }
                });

                // TODO: Process incoming data
                enttec._dev.on('data', (data) => {
                    console.log('Data from serialport: ');
                    console.log(data);
                });
            }
        })
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

// Midi related

enttec.midi.sendMidi = function(msg) {
    _sendMIDImessage(new Buffer(msg));
}

// ## Private functions
//

function _sendDmxUniverse() {
    return _writeFTDI(ENTTEC_CODES.SEND_DMX_RQ, Buffer.concat([Buffer([ENTTEC_CODES.DMX_STARTCODE]), enttec.dmx.universe]));
};

function _sendMIDImessage(msg) {
    return _writeFTDI(ENTTEC_CODES.SEND_MIDI_RQ, Buffer(msg));
};

function _initPorts(portStatus) {
    return _writeFTDI(ENTTEC_CODES.SET_PORT_RQ, Buffer([1,2]));
}

function _setAPIKey() {
    if (!cfg.enttecAPIKey) {
        return Promise.reject('Enttec API-key undefined!');
    } else {
        return _writeFTDI(ENTTEC_CODES.SET_API_KEY, reverse(Buffer(cfg.enttecAPIKey, 'hex')));
    }
}

function _writeFTDI(command, data) {
    return new Promise((resolve,reject) => {
        if(!enttec._dev.isOpen()) {
            return reject();
        }

        var hdr = Buffer([
            ENTTEC_CODES.START_OF_MSG,
            command,
            data.length       & 0xff,
            (data.length >> 8) & 0xff
        ]);

        var msg = Buffer.concat([
            hdr,
            data,
            Buffer([ENTTEC_CODES.END_OF_MSG])
        ]);

        enttec._dev.write(msg, (err, bytesWritten) => {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        });
    })
}

module.exports = enttec;
