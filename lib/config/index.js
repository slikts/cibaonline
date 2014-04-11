'use strict';

module.exports = function() {
  var config = require('./defaults');
  var env = process.env.ENV || 'dev';

  try {
    Object.assign(config, require('./' + env));
  } catch (err) {}

  return config;
};