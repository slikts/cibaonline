'use strict';

require('es5-ext/object/assign/implement');

var bunyan = require('bunyan');
var io = require('socket.io');

var Timer = require('../util/timer')();
var Block = require('./block')();
var Queue = require('../queue')();
var User = require('./user')();

var defaults = require('../config')();

var proto = World.prototype = {
  height: 2,
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
          User(socket, self);
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
  },
  restore: function(fn) {
    // XXX
    return this.generate().save(fn);
  },
  snapshot: function() {

    return this;
  },
  generate: function() {
    this.logger.info({
      size: this.config.size.toExponential()
    }, 'generating world');

    var t = Timer();
    var height = this.config.height;
    var count = 0;
    var block;

    for (var x = 0, n = this.config.size; x < n; x++) {
      for (var y = 0; y < n; y++) {
        for (var z = 0; z < height; z++) {
          count += 1;
          block = Block({
            x: x,
            y: y,
            z: z,
            color: '00a'
          });
          this.objs[String(block)] = block;
        }
      }
    }
    this.logger.info({
      count: count.toExponential(),
      elapsed: String(t)
    }, 'generated blocks');

    return this;
  },
  save: function(fn) {

    var self = this;
    var t = Timer();
    var objs = this.objs;
    var obj;
    var batch = this.db.batch();
    var count = 0;

    for (var key in objs) {
      obj = objs[key];
      batch.put(String(obj), obj);
      count += 1;
    }

    batch.write(function() {
      self.logger.info({
        count: count.toExponential(),
        elapsed: String(t)
      }, 'saved objs');
      fn();
    });
  }
};

function World(config) {
  return Object.create(proto).init(config);
}

module.exports = function() {
  return World;
};