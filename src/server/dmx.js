'use strict'
var _       = require('lodash');

var enttec  = require('./enttec');
var patch   = require('./patch');
var logger  = require('../logger');

var dmx = {
    outputReady: false
};


enttec.init()
.then(() => {
    logger.info('Enttec connected succesfully');
    dmx.outputReady = true;
    //enttec.dmx.update([255,0,0,0,0,255]);
    //enttec.midi.sendMidi([0x01,0x01,0x01]);
})
.catch((err) => {
    logger.error(err);
});

patch.patchHead(2, 1, 5)
.then(() => {
    patch.patchHead(2, 6, 5)
    .then((head) => {
        patch.addHeadToGroup(head.id);
        logger.debug(patch.groups);
    })
});

module.exports = dmx;
