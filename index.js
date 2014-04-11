'use strict';

var levelup = require('levelup');
var db = levelup('/test', {
  db: require('memdown')
});

var World = require('./lib/world')();

var world = World({
  size: 10,
  db: db,
  interval: 100,
  name: 'Ciba Online'
});

world.restore(world.run);