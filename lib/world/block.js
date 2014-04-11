'use strict';

var Obj = require('./obj')();

var proto = Block.prototype = Object.create(Obj.prototype);

var sep = '_';

proto.toString = function() {
  return 'Block' + sep + this.x + sep + this.y + sep + this.z;
};

function Block(config) {
  return Object.create(proto).init(config);
}

module.exports = function() {
  return Block;
};