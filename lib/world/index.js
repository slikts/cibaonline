'use strict';

var _util = require('../util');
var Block = require('./block')();
var Queue = require('../queue')();
var User = require('./user')();

var io = require('socket.io');

var proto = World.prototype = {
  height: 2,
  init: function(config) {
    for (var key in config) {
      this[key] = config[key];
    }
    this.objs = {};
    this.queue = Queue();

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
    console.log('generating size %s world', this.size.toExponential());

    var t = _util.Timer();
    var height = this.height;
    var count = 0;
    var block;

    for (var x = 0, n = this.size; x < n; x++) {
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
    console.log('generated %s blocks in %s', count.toExponential(), t);

    return this;
  },
  save: function(fn) {
    console.log('saving objs');

    var t = _util.Timer();
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
      console.log('saved %s objs in %s', count.toExponential(), t);
      fn();
    });
  }
};

function World(config) {
  var self = Object.create(proto).init(config);
  var running;

  self.run = function() {
    running = true;
    console.log('running world `%s`', self.name);
    cycle();
  };
  self.stop = function() {
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

  var _io = io.listen(3000);
  _io.sockets.on('connection', function(socket) {
    User(socket, self);
  });

  return self;
}

module.exports = function() {
  return World;
};