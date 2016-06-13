'use strict'
process.env.NODE_ENV = 'test';

var chai    = require('chai');
var _       = require('lodash');

var enttec  = require('../src/server/enttec');
var patch   = require('../src/server/patch');
var heads   = require('../src/server/heads');

var expect = chai.expect;

const CODES = enttec.codes;
const TEST_HEAD = require('./test_head.json');
const TEST_HEAD_ID = heads.addHead(TEST_HEAD);

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

describe('DMX', () => {
    describe('patcher', () => {

        it('should patch a head', () => {
            let startChannel = 10;
            let endChannel = 15;
            let mode = 5;
            let patchedHead = patch.patchHead(TEST_HEAD_ID, startChannel, mode);
            expect(patchedHead).not.to.be.null;

            let channelMap = _.clone(patch.reservedChannels);
            for (let i = startChannel; i < endChannel; i++) {
                expect(channelMap[i-1]).to.be.true;
            }
            _.pullAll(channelMap, [true]);
            expect(channelMap).to.have.length(512-TEST_HEAD.modes[mode].length);
        });

        it('should unpatch a head', () => {
            let patchedHead = patch.patchHead(TEST_HEAD_ID, 100, 5);
            let wasUnpatched = patch.unpatchHead(patchedHead.id);
            expect(wasUnpatched).to.be.true;
        });

        it('should not patch head if channel is already in use', () => {
            let patchedHead = patch.patchHead(TEST_HEAD_ID, 13, 5);
            expect(patchedHead).to.be.null;
        });


    });
});
