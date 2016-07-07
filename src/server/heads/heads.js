var utils = require('../utils');

// TODO: Create better unpatched head handling
var unpatchedHeads = [
    require('./adj_megatripar.json'),
    require('./generic_channel.json'),
    require('./generic_led.json'),
    require('./martin_pro_518.json'),
    require('./stairville_ledpar56.json')
];

// Make unique IDs for each head
unpatchedHeads.forEach((head) => {
    var hashString = (head.manufacturer) ? head.model + head.manufacturer : head.model;
    head.id = utils.hashCode(hashString);
});

module.exports = unpatchedHeads;
