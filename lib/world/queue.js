'use strict';

module.exports = function(config) {
  var running;

  var proto = Queue.prototype = {
    init: function(config) {
      this.events = [];

      this.interval = config.queueInterval;

      return this;
    },
    process: function(done) {
      var n = this.events.length;

      if (!n) {
        return done();
      }

      var events = this.events.slice(0);
      var i = 0;

      this.events = [];

      function next() {
        events[i](function() {
          i += 1;
          if (i === n) {
            done();
          } else {
            next();
          }
        });
      }

      next();
    },
    push: function(event) {
      this.events.push(event);
    },
    run: function() {
      running = true;
      this.cycle();
    },
    stop: function() {
      running = false;
    },
    cycle: function() {
      if (!running) {
        return;
      }

      this.process(function() {
        // XXX use process.hrtime() to adjust for drift etc.
        setTimeout(this.cycle, config.interval);
      });
    }
  };

  function Queue(config) {
    return Object.create(proto).init(config);
  }

  return Queue;
};