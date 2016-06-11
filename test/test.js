'use strict'
var chai    = require('chai');
var enttec  = require('../src/server/enttec');

var expect = chai.expect;

const CODES = enttec.codes;

describe('ENTTEC DMX-USB-PRO', () => {
    describe('serial port parser', () => {
        it('should parse incoming MIDI message', () => {
            var pkt = Buffer([
                CODES.START_OF_MSG,
                CODES.RECV_MIDI_PKT,
                0x01,
                0x00,
                0x04,
                CODES.END_OF_MSG
            ]);
            let result = enttec.parser(pkt);
            expect(result).to.have.property('type', 'midi');
            expect(result).to.have.property('note', 4);
        });
        it('should parse incoming DMX message', () => {
            var pkt = Buffer([
                CODES.START_OF_MSG,
                CODES.RECV_DMX_PKT,
                0x01,
                0x00,
                0x0a,
                CODES.END_OF_MSG
            ]);
            let result = enttec.parser(pkt);
            expect(result).to.have.property('type', 'dmx');
            expect(result).to.have.property('data');
        });
    })
});
