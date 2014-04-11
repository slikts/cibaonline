'use strict';

(function() {
  var proto = Timer.prototype = {
    ms: function ms() {
      return Date.now() - this._init;
    },
    sec: function sec(ms) {
      ms = ms || this.ms();

      return Math.round(this.ms() / 1000);
    },
    toString: function() {
      var t = this.ms();

      if (t > 1000) {
        t = this.sec(t) + 's';
      } else {
        t += 'ms';
      }

      return t;
    }
  };

  function Timer() {
    var obj = Object.create(proto);

    obj._init = Date.now();

    return obj;
  }

  module.exports.Timer = Timer;
})();