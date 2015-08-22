import browserify from 'browserify'
import unpathify from 'bundle-collapser/plugin'
import convert from 'convert-source-map'
import gulp, {dest, tasks} from 'gulp'
import uglify from 'gulp-uglify'
import rump from 'rump'
import through from 'through2'
import buffer from 'vinyl-buffer'
import source from 'vinyl-source-stream'
import watchify from 'watchify'
import unreachify from 'unreachable-branch-transform'
import {merge} from 'event-stream'
import {find} from 'globule'
import {noop} from 'gulp-util'
import {join, relative, resolve, sep} from 'path'

const name = ::rump.taskName,
      protocol = process.platform === 'win32' ? 'file:///' : 'file://',
      task = ::gulp.task,
      {configs} = rump

task(name('build:scripts'), build)
tasks[name('build')].dep.push(name('build:scripts'))
tasks[name('watch')].dep.push(name('build:scripts'))

function build() {
  const sourcePath = join(configs.main.paths.source.root,
                          configs.main.paths.source.scripts),
        source = join(sourcePath, configs.main.globs.build.scripts),
        files = find([source].concat(configs.main.globs.global))
  return merge(...files.map(browserifier))
}

function browserifier(filename) {
  const sourcePath = join(configs.main.paths.source.root,
                          configs.main.paths.source.scripts),
        destination = join(configs.main.paths.destination.root,
                           configs.main.paths.destination.scripts),
        {minify, sourceMap} = configs.main.scripts
  let bundler,
      options = rump.configs.browserify

  if(configs.watch) {
    options = {...options, cache: {}, packageCache: {}, fullPaths: configs.watch}
  }

  bundler = browserify(resolve(filename), options)

  if(rump.configs.watch) {
    bundler = watchify(bundler)
    bundler.on('update', rebundle)
  }

  configs.main.scripts.transforms.forEach(x => bundler.transform(x))
  configs.main.scripts.plugins.forEach(x => bundler.plugin(x))

  if(rump.configs.main.scripts.minify) {
    bundler.plugin(unpathify)
    bundler.transform(unreachify)
  }

  return rebundle()

  function rebundle() {
    return bundler
      .bundle()
      .pipe(source(relative(sourcePath, filename)))
      .pipe(buffer())
      .pipe((minify ? uglify : noop)())
      .pipe((sourceMap ? through.obj : noop)(sourceMapRewriter))
      .pipe(dest(destination))
  }
}

function rewriteUrl(url) {
  return `${protocol}${resolve(url).split(sep).join('/')}`
}

function sourceMapRewriter(file, enc, callback) {
  if(file.isNull()) {
    return callback(null, file)
  }
  let content = file.contents.toString()
  const sourceMap = convert.fromSource(content),
        sources = sourceMap.getProperty('sources')
  sourceMap.setProperty('sources', sources.map(rewriteUrl))
  content = `${convert.removeComments(content)}\n${sourceMap.toComment()}`
  file.contents = new Buffer(content)
  callback(null, file)
}
