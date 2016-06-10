'use strict'
var _       = require('lodash');

var enttec  = require('./enttec');
var heads   = require('./heads');
var logger  = require('../logger');

var dmx = {
    ready: false
};

dmx.availableHeads = function() {

}

enttec.init()
.then(() => {
    logger.info('Enttec connected succesfully');
    dmx.ready = true;
    //enttec.dmx.update([255,255,255,0,0,255]);
    //enttec.midi.sendMidi([0x01,0x01,0x01]);
})
.catch((err) => {
    console.log(err);
});

module.exports = dmx;
