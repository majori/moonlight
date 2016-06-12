'use strict'
var _       = require('lodash');
var Promise = require('bluebird');

var heads   = require('./heads');

var patch = {
    rawHeads: heads.availableHeads(),
    patchedHeads: [],
    universe: (new Array(512)).fill(null),
    groups: []
};

patch.patchHead = function(headId, startChannel, mode) {

    // Find full data of the head
    var head = heads.findHeadById(headId);

    if (!head) { return Promise.reject('Head not found!') }

    // If head have modes, pick the right channels
    var channels = (mode && head.haveModes) ? head.modes[mode] : head.channels;
    var endChannel = startChannel + channels.length;

    // Check if channel range is valid
    if (startChannel < 1 || startChannel > 512 || endChannel > 512) {
        return Promise.reject('Channel range was invalid!');
    }

    var nextPatchedHeadId = patch.patchedHeads.length + 1;
    var j = 0;
    for (var i = startChannel; i < endChannel; ++i) {

        // If channel is already in use, return reject
        if (!_.isEmpty(patch.universe[i-1])) {
            return Promise.reject('Channel ' + i + ' already in use!')
        }

        // Channel data which will be patched
        var channel = {
            headId: nextPatchedHeadId,
            name: channels[j]
        };

        // Add range info to channel if exists
        if (head.ranges && head.ranges[channels[j]]) {
            channel.ranges = head.ranges[channels[j]]
        }

        // Patch channel
        patch.universe[i-1] = channel;
        ++j;
    }

    // Append patched head info to local datastructure
    var patchedHead = {
        id: nextPatchedHeadId,
        groupId: null,
        name: head.model,
        startChannel,
        endChannel
    };
    patch.patchedHeads.push(patchedHead);

    return Promise.resolve(patchedHead);
};

patch.findPatchedHeadById = function(id) {
    return _.find(patch.patchedHeads, (head) => {
        return head.id === id;
    });
};

patch.addHeadToGroup = function(headId, groupId) {
    var groupId = (groupId) ? groupId : patch.groups.length;

    // Check if group already exists
    var index = _.findIndex(patch.groups, (group) => {
        return group.groupId === groupId;
    });
    if (index > 0) {
        patch.groups[index].heads.push(headId);

    // If not, create new group
    } else {
        patch.groups.push( {groupId, heads: [headId]} );
    }

}

module.exports = patch;
