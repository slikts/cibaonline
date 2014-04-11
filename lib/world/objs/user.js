'use strict';

var Obj = require('./obj')();

var proto = Object.create(Obj.prototype);

function _ok(fn) {
  if (fn) {
    fn('ok');
  }
}

proto.constructor = User;
proto.init = function(socket, world) {
  var self = this;

  this.socket = socket;
  this.world = world;

  socket.on('hello', function(data, fn) {
    self.activate(data);
    _ok(fn);
  });
};

proto.activate = function(data) {
  var self = this;

  this.name = data.name;
  console.log('User `%s` connected', data.name);

  this.socket
    .on('say', function(msg, fn) {
      self.world.queue.push(function(done) {
        console.log('[%s] %s: %s', Date.now(), self.name, msg);
        done();
      });
      _ok(fn);
    });
};

function User(socket, world) {
  return Object.create(proto).init(socket, world);
}

module.exports = function() {
  return User;
};