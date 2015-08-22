import extend from 'extend'
import rump from 'rump'

const dropConsoleKey = 'drop_console',
      dropDebuggerKey = 'drop_debugger',
      {configs} = rump

rebuild()

export function rebuild() {
  const glob = '*.js'
  configs.main.globs = extend(true, {build: {
    scripts: glob,
    tests: `**/${glob.replace(/^\*\./, '*_test.')}`,
  }}, configs.main.globs)
  configs.main.paths = extend(true, {
    source: {scripts: 'scripts'},
    destination: {scripts: 'scripts'},
  }, configs.main.paths)
  configs.main.scripts = extend(true, {
    minify: configs.main.environment === 'production',
    sourceMap: configs.main.environment === 'development',
    plugins: [],
    transforms: [],
  }, configs.main.scripts)
  configs.main.scripts.browserify = extend(true, {
    standalone: configs.main.scripts.library,
    debug: configs.main.scripts.sourceMap,
  }, configs.main.scripts.browserify)
  configs.main.scripts.uglifyjs = extend(true, {
    output: {comments: false},
    compress: {[dropConsoleKey]: true, [dropDebuggerKey]: true},
  }, configs.main.scripts.uglifyjs)
}
