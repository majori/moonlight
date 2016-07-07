'use strict'
process.env.NODE_ENV = 'test';

var chai    = require('chai');
var _       = require('lodash');

var utils   = require('../src/server/utils');

var expect = chai.expect;
var assert = chai.assert;

const TEST_HEAD = require('./test_head.json');

describe('utils', () => {
    describe('hashCode()', () => {
        it('should be pure function', () => {
            var hashString = 'TestStringWith Spaces';
            var otherHashString = 'This_One_Has_Numbers1243425';
            expect(utils.hashCode(hashString)).to.equal(-211579516);
            expect(utils.hashCode(otherHashString)).to.equal(1338999116);
        });
    });
});

describe('ENTTEC DMX-USB-PRO', () => {
    describe('serial port parser', () => {

        it('should parse incoming MIDI message', () => {
            assert();
        });

        it('should parse incoming DMX message', () => {
            assert();
        });
    });
});

describe('DMX', () => {
    describe('patcher', () => {

        it('should patch a head', () => {
            assert();
        });

        it('should unpatch a head', () => {
            assert();
        });

        it('should not patch head if channel is already in use', () => {
            assert();
        });


    });
});
