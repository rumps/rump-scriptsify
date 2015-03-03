'use strict';

var rump = module.exports = require('rump');
var configs = require('./configs');
var originalAddGulpTasks = rump.addGulpTasks;

// TODO remove on next major core update
rump.addGulpTasks = function(options) {
  originalAddGulpTasks(options);
  require('./gulp');
  return rump;
};

rump.on('update:main', function() {
  configs.rebuild();
  rump.emit('update:scripts');
});

rump.on('gulp:main', function(options) {
  require('./gulp');
  rump.emit('gulp:scripts', options);
});

Object.defineProperty(rump.configs, 'browserify', {
  get: function() {
    return configs.browserify;
  }
});

Object.defineProperty(rump.configs, 'uglifyjs', {
  get: function() {
    return configs.uglifyjs;
  }
});
