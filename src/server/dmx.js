'use strict'
var _       = require('lodash');

var enttec  = require('./enttec');
var heads   = require('./heads');

var dmx = {};

dmx.availableHeads = function() {
    var keys = [];
    _.forEach(Object.keys(heads), (head) => {
        keys.push(_.replace(head, '_', ' '));
    });
    return keys;
}

enttec.init()
.then(() => {
    console.log('Enttec connected succesfully');
    enttec.close();
})
.catch((err) => {
    console.log(err);
});

dmx.availableHeads();

module.exports = dmx;
