'use strict'
process.env.NODE_ENV = 'test';

var chai    = require('chai');
var _       = require('lodash');

var expect = chai.expect;

const TEST_HEAD = require('./test_head.json');

describe('ENTTEC DMX-USB-PRO', () => {
    describe('serial port parser', () => {

        it('should parse incoming MIDI message', () => {

        });

        it('should parse incoming DMX message', () => {

        });
    })
});

describe('DMX', () => {
    describe('patcher', () => {

        it('should patch a head', () => {

        });

        it('should unpatch a head', () => {

        });

        it('should not patch head if channel is already in use', () => {

        });


    });
});
