'use strict';

var levelup = require('levelup');
var db = levelup('/test', {
  db: require('memdown')
});

var World = require('./lib/world')();

var world = World({
  db: db
});

world.restore(world.run);