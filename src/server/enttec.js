'use strict'

var serialport  = require('serialport');
var Promise     = require('bluebird');
var _           = require('lodash');
var reverse     = require('buffer-reverse');
var Parser      = require('binary-parser').Parser;

var cfg         = require('../config');

var enttec = {
    dmx: {},
    midi: {},
    codes: {
        DMX_STARTCODE       : 0x00,
        START_OF_MSG        : 0x7e,
        END_OF_MSG          : 0xe7,
        SEND_DMX_RQ         : 0x06,
        RECV_DMX_PKT        : 0x05,
        RECV_MIDI_PKT       : 0xe6,
        SEND_MIDI_RQ        : 0xc3,
        SET_PORT_RQ         : 0xec,
        GET_PORT_RQ         : 0xc1,
        SET_API_KEY         : 0x0d,
        ENABLE_DMX_PORT     : 0x01,
        ENABLE_MIDI_PORT    : 0x02
    }
};

var serialParser = new Parser()
.uint8('startOfMsg')
.uint8('command')
.uint8('dataLengthLSB')
.uint8('dataLengthMSB')
.array('data', {
    type: 'uint8',
    length: function() {
        return (this.dataLengthLSB + 8*this.dataLengthMSB);
    }
})
.uint8('endOfMsg');

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

                // Initialize serial port
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

                        // Initialize Enttec controller
                        var initPromises = [];
                        initPromises.push(_setAPIKey());
                        initPromises.push(_initPorts());

                        Promise.all(initPromises)
                        .then(() => {

                            enttec._dev.on('data', (data) => {
                                _processIncomingData(data);
                            });

                            _sendDmxUniverse();
                            resolve();
                        })
                        .catch(reject);
                    }
                });
            }
        })
    });
}

enttec.close = function(cb) {
    if (enttec._dev && enttec._dev.isOpen()) {
        enttec._dev.close(cb);
    }
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

// MIDI-related functions

enttec.midi.sendMidi = function(msg) {
    _sendMIDImessage(new Buffer(msg));
}

// ## Private functions
//

function _sendDmxUniverse() {
    return _writeFTDI(
        enttec.codes.SEND_DMX_RQ,
        Buffer.concat([Buffer([enttec.codes.DMX_STARTCODE]), enttec.dmx.universe])
    );
};

function _sendMIDImessage(msg) {
    return _writeFTDI(
        enttec.codes.SEND_MIDI_RQ,
        Buffer(msg)
    );
};

function _initPorts() {
    return _writeFTDI(
        enttec.codes.SET_PORT_RQ,
        Buffer([enttec.codes.ENABLE_DMX_PORT, enttec.codes.ENABLE_MIDI_PORT])
    );
}

function _setAPIKey() {
    if (!cfg.enttecAPIKey) {
        return Promise.reject('Enttec API-key undefined!');
    } else {
        return _writeFTDI(
            enttec.codes.SET_API_KEY,
            reverse(Buffer(cfg.enttecAPIKey, 'hex'))
        );
    }
}

function _writeFTDI(command, data) {
    return new Promise((resolve,reject) => {
        if(!enttec._dev) {
            return reject('Serial port is undefined!');
        } else if (!enttec._dev.isOpen()) {
            return reject('Serial port is closed!');
        }

        var hdr = Buffer([
            enttec.codes.START_OF_MSG,
            command,
            data.length       & 0xff,
            (data.length >> 8) & 0xff
        ]);

        var msg = Buffer.concat([
            hdr,
            data,
            Buffer([enttec.codes.END_OF_MSG])
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

function _processIncomingData(data) {
    var result = enttec.parser(data);
    switch (result.type) {
        case 'midi':
            // Do something with MIDI messages
        break;

        case 'dmx':
            // Do something with DMX messages
        break;

        default:
            return;
    }
}

enttec.parser = function(buffer) {
    var parsed = serialParser.parse(buffer);
    if (parsed.startOfMsg && parsed.endOfMsg
        && parsed.startOfMsg === enttec.codes.START_OF_MSG
        && parsed.endOfMsg === enttec.codes.END_OF_MSG) {

            switch (parsed.command) {
            case enttec.codes.RECV_MIDI_PKT:

                // TODO: Find out incoming MIDI syntax
                return {
                    type: 'midi',
                    note: parsed.data[0]
                }
            break;

            case enttec.codes.RECV_DMX_PKT:
                return {
                    type: 'dmx',
                    data: parsed.data
                }
            break;

            default:
                return { type: null }
        }
    }

}




module.exports = enttec;
