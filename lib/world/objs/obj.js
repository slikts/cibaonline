'use strict';

var proto = Obj.prototype = {
  init: function(config) {
    for (var key in config) {
      this[key] = config[key];
    }

    if (!this.hp) {
      this.hp = 100;
    }

    return this;
  }
};

function Obj(config) {
  return Object.create(proto).init(config);
}

module.exports = function() {
  return Obj;
};