'use strict';

var extend = require('extend');
var rump = require('rump');

exports.rebuild = function() {
  var glob = '*.js';

  rump.configs.main.globs = extend(true, {
    build: {
      scripts: glob,
      tests: '**/' + glob.replace(/^\*\./, '*_test.')
    }
  }, rump.configs.main.globs);

  rump.configs.main.paths = extend(true, {
    source: {
      scripts: 'scripts'
    },
    destination: {
      scripts: 'scripts'
    }
  }, rump.configs.main.paths);

  rump.configs.main.scripts = extend(true, {
    minify: rump.configs.main.environment === 'production',
    sourceMap: rump.configs.main.environment === 'development',
    plugins: [],
    transforms: []
  }, rump.configs.main.scripts);

  exports.browserify = extend(true, {
    standalone: rump.configs.main.scripts.library,
    debug: rump.configs.main.scripts.sourceMap
  }, rump.configs.main.scripts.browserify);

  exports.uglifyjs = extend(true, {
    output: {
      comments: false
    },
    compress: {
      'drop_console': true,
      'drop_debugger': true
    }
  }, rump.configs.main.scripts.uglifyjs);
};

exports.rebuild();
