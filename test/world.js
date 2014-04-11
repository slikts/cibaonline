'use strict';

var levelup = require('levelup');
var memdown = require('memdown');

require('chai').should();

var World = require('../lib/world')();

describe('World', function() {
  var db;

  beforeEach(function() {
    db = levelup('/test', {
      db: memdown
    });
  });

  describe('constructor', function() {
    it('should merge config', function() {
      var name = 'Foo';
      var world = World({
        logLevel: 'fatal',
        name: name,
        db: db,
        ioPort: 0
      });

      world.config.name.should.equal(name);
      world.config.db.should.equal(db);
    });
  });

  describe('generate method', function() {

    it('should generate blocks', function() {
      var world = World({
        logLevel: 'fatal',
        size: 5,
        height: 5,
        db: db
      });

      world.generate();

      Object.keys(world.objs).length.should.be.gt(0);
    });

    // it('', function() {});
  });
});