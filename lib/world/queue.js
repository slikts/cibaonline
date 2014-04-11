'use strict';

var proto = Queue.prototype = {
  init: function() {
    this.events = [];

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
  }
};

function Queue() {
  return Object.create(proto).init();
}

module.exports = function() {
  return Queue;
};