'use strict'
var _ = require('lodash');

const HEADS_FOLDER = __dirname + '/heads';

var available_heads = [
    require(HEADS_FOLDER + '/generic_channel.json'),
    require(HEADS_FOLDER + '/generic_led.json'),
    require(HEADS_FOLDER + '/adj_megatripar.json'),
    require(HEADS_FOLDER + '/stairville_ledpar56.json'),
    require(HEADS_FOLDER + '/martin_pro_518.json'),
];
var last_id = 0;

var heads = {};


heads.allAvailableHeads = function() {
    return _.map(available_heads, (head) => {
        return {
            id: head.id,
            name: (head.manufacturer) ?
                head.manufacturer + ' ' + head.model :
                head.model
        };
    });
};

heads.findHeadById = function(id) {
    return _.find(available_heads, (o) => {
        return o.id === id;
    });
};

heads.addHead = function(head) {
    ++last_id;
    head.id = last_id;
    available_heads.push(head);
    return last_id;
}

// Give unique id to each head
function _initHeads() {
    var i = 0;
    _.forEach(available_heads, (head) => {
        head.id = i;
        last_id = i;
        i++;
    });
}

_initHeads();

module.exports = heads;
