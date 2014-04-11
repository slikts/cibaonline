'use strict';

require('es5-ext/object/assign/implement');

var bunyan = require('bunyan');
var io = require('socket.io');

var Queue = require('./queue')();
//var User = require('./user')();

var defaults = require('../config')();

var proto = World.prototype = {
  init: function(config) {
    config = this.config = Object.assign(defaults, config);

    var self = this;
    var logger = this.logger = bunyan.createLogger({
      level: config.logLevel,
      name: config.name
    });
    var running;

    this.objs = {};
    this.queue = Queue();

    this.run = function() {
      running = true;
      if (this.config.ioPort) {
        this.io = io.listen(this.ioPort);
        this.io.sockets.on('connection', function(socket) {
          // XXX
          //User(socket, self);
        });
      }
      logger.info({
        name: self.name
      }, 'running world');
      cycle();
    };
    this.stop = function() {
      running = false;
    };

    function cycle() {
      if (!running) {
        return;
      }

      self.queue.process(function() {
        setTimeout(cycle, config.interval);
      });

      // XXX use process.hrtime() to adjust for drift etc.
    }

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