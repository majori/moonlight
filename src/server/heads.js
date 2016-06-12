'use strict'
var _ = require('lodash');

const HEADS_FOLDER = __dirname + '/heads';

var AVAILABLE_HEADS = [
    require(HEADS_FOLDER + '/generic_channel.json'),
    require(HEADS_FOLDER + '/generic_led.json'),
    require(HEADS_FOLDER + '/adj_megatripar.json'),
    require(HEADS_FOLDER + '/stairville_ledpar56.json'),
    require(HEADS_FOLDER + '/martin_pro_518.json'),
];

var heads = {};

heads.availableHeads = function() {
    return _.map(AVAILABLE_HEADS, (head) => {
        return {
            id: head.id,
            name: (head.manufacturer) ?
                head.manufacturer + ' ' + head.model :
                head.model
        };
    });
};

heads.findHeadById = function(id) {
    return _.find(AVAILABLE_HEADS, (o) => {
        return o.id === id;
    });
};

// Give unique id to each head
function _initHeads() {
    var i = 0;
    _.forEach(AVAILABLE_HEADS, (head) => {
        head.id = i;
        i++;
    });
}

_initHeads();

module.exports = heads;
