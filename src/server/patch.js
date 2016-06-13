'use strict'
var _       = require('lodash');
var Promise = require('bluebird');

var heads   = require('./heads');
var logger  = require('../logger');

var patch = {
    rawHeads: heads.allAvailableHeads(),
    patchedHeads: [],
    reservedChannels: (new Array(512)).fill(false),
    groups: []
};
var last_group_id = 0;

patch.patchHead = function(headId, startChannel, mode) {

    // Find full data of the head
    var head = heads.findHeadById(headId);

    if (!head) {
        logger.error('Head not found!');
        return null
    }

    // If head have modes, pick the right channels
    var channels = (mode && head.haveModes) ? head.modes[mode] : head.channels;
    var endChannel = startChannel + channels.length;

    // Check if channel range is valid
    if (startChannel < 1 || startChannel > 512 || endChannel > 512) {
        logger.error('Channel range was invalid!');
        return null;
    }

    var nextPatchedHeadId = patch.patchedHeads.length + 1;
    for (var i = startChannel; i < endChannel; ++i) {

        // If channel is already in use, return reject
        if (patch.reservedChannels[i-1]) {
            logger.error('Channel ' + i + ' already in use!');
            return null;
        }

        // Reserve channel
        patch.reservedChannels[i-1] = true;
    }

    // Append patched head info to local datastructure
    var patchedHead = {
        id: nextPatchedHeadId,
        groupId: null,
        startChannel,
        endChannel,
        info: head,
    };
    patch.patchedHeads.push(patchedHead);

    return patchedHead;
};

patch.unpatchHead = function(id) {
    var index = patch.findPatchedHeadIndexById(id);
    if (index >= 0) {
        var head = patch.patchedHeads[index];
        for (var i = head.startChannel; i < head.endChannel; ++i) {
            patch.reservedChannels[i] = false;
        }
        _.pullAt(patch.patchedHeads, index);
        return true;
    } else {
        return false;
    }
}

patch.findPatchedHeadIndexById = function(id) {
    return _.findIndex(patch.patchedHeads, (head) => {
        return head.id === id;
    });
};

patch.addHeadToGroup = function(headId, groupId) {

    if (groupId) {

        var index = _.findIndex(patch.groups, (group) => {
            return group.groupId === groupId;
        });

        if (index > 0) {
            patch.groups[index].heads.push(headId);
            return;
        }
    }

    // Create new group if groupId is undefined or group couldn't be found
    ++last_group_id;
    patch.groups.push( {id: last_group_id, name: ('Group ' + last_group_id), heads: [headId]} );



};

module.exports = patch;
