'use strict';

module.exports = function() {
  var cache = {};

  return {
    emit: function(type, data) {
      Object.keys(cache[type]).forEach(function(key) {
        cache[key].forEach(function(listener) {
          listener(data);
        });
      });
    },
    listen: function(type, fn) {
      var listeners = cache[type];

      if (!listeners) {
        cache[type] = [fn];
      } else if (!~listeners.indexOf(fn)) {
        listeners.push(fn);
      }
    }
  };
};