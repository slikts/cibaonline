'use strict';

var io = require('socket.io');

var Timer = require('../../util/timer')();
var Block = require('../objs/block')();

module.exports = {
  restore: function(fn) {
    // XXX

    return this.generate().save(fn);
  },
  snapshot: function() {
    // XXX

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
  },
  run: function() {
    var self = this;

    this.logger.info({
      name: this.name
    }, 'running world');

    this.queue.run();

    if (this.config.ioPort) {
      this.io = io.listen(this.ioPort);
      this.io.sockets.on('connection', function(socket) {
        // XXX
        self.logger.debug(socket);
      });
    }
  }
};