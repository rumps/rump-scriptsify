'use strict';

var browserify = require('browserify');
var unpathify = require('bundle-collapser/plugin');
var unreachify = require('unreachable-branch-transform');
var convert = require('convert-source-map');
var es = require('event-stream');
var extend = require('extend');
var globule = require('globule');
var gulp = require('gulp');
var uglify = require('gulp-uglify');
var util = require('gulp-util');
var path = require('path');
var rump = require('rump');
var through = require('through2');
var buffer = require('vinyl-buffer');
var source = require('vinyl-source-stream');
var watchify = require('watchify');
var protocol = process.platform === 'win32' ? 'file:///' : 'file://';

gulp.task(rump.taskName('build:scripts'), build);
gulp.tasks[rump.taskName('build')].dep.push(rump.taskName('build:scripts'));
gulp.tasks[rump.taskName('watch')].dep.push(rump.taskName('build:scripts'));

function build() {
  var sourcePath = path.join(rump.configs.main.paths.source.root,
                             rump.configs.main.paths.source.scripts);
  var source = path.join(sourcePath, rump.configs.main.globs.build.scripts);
  var files = globule.find([source].concat(rump.configs.main.globs.global));

  return es.merge.apply(null, files.map(browserifier));
}

function browserifier(filename) {
  var sourcePath = path.join(rump.configs.main.paths.source.root,
                             rump.configs.main.paths.source.scripts);
  var destination = path.join(rump.configs.main.paths.destination.root,
                              rump.configs.main.paths.destination.scripts);
  var minify = rump.configs.main.scripts.minify;
  var options = rump.configs.browserify;
  var sourceMap = rump.configs.main.scripts.sourceMap;

  if(rump.configs.watch) {
    options = extend({}, options, {
      cache: {},
      packageCache: {},
      fullPaths: rump.configs.watch
    });
  }

  var bundler = browserify(path.resolve(filename), options);

  if(rump.configs.watch) {
    bundler = watchify(bundler);
    bundler.on('update', rebundle);
  }

  rump.configs.main.scripts.transforms.forEach(function(transform) {
    bundler.transform(transform);
  });

  rump.configs.main.scripts.plugins.forEach(function(plugin) {
    bundler.plugin(plugin);
  });

  if(rump.configs.main.scripts.minify) {
    bundler.plugin(unpathify);
    bundler.transform(unreachify);
  }

  return rebundle();

  function rebundle() {
    return bundler
      .bundle()
      .pipe(source(path.relative(sourcePath, filename)))
      .pipe(buffer())
      .pipe((minify ? uglify : util.noop)())
      .pipe(sourceMap ? through.obj(sourceMapRewriter) : util.noop())
      .pipe(gulp.dest(destination));
  }
}

function rewriteUrl(url) {
  return protocol + path.resolve(url).split(path.sep).join('/');
}

function sourceMapRewriter(file, enc, callback) {
  if(file.isNull()) {
    return callback(null, file);
  }

  var content = file.contents.toString();
  var sourceMap = convert.fromSource(content);
  var sources = sourceMap.getProperty('sources');
  sourceMap.setProperty('sources', sources.map(rewriteUrl));
  content = convert.removeComments(content) + '\n' + sourceMap.toComment();
  file.contents = new Buffer(content);
  callback(null, file);
}
