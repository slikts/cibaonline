'use strict';

require('es5-ext/object/assign/implement');

var bunyan = require('bunyan');

var Queue = require('./queue')();

var defaults = require('../config')();

var proto = World.prototype = {
  init: function(config) {
    config = this.config = Object.assign(defaults, config || {});

    this.objs = {};

    this.logger = bunyan.createLogger({
      level: config.logLevel,
      name: config.name
    });

    this.queue = Queue(config);

    return this;
  }
};

Object.assign(proto, require('./mixins/emitter'));
Object.assign(proto, require('./mixins/manager'));

function World(config) {
  return Object.create(proto).init(config);
}

module.exports = function() {
  return World;
};