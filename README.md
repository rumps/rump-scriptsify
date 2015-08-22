# Rump Scriptsify
[![NPM](http://img.shields.io/npm/v/rump-scriptsify.svg?style=flat-square)](https://www.npmjs.org/package/rump-scriptsify)
![License](http://img.shields.io/npm/l/rump-scriptsify.svg?style=flat-square)
[![Issues](https://img.shields.io/github/issues/rumps/issues.svg?style=flat-square)](https://github.com/rumps/issues/issues)


## Status

### Master
[![Dependencies](http://img.shields.io/david/rumps/scriptsify.svg?style=flat-square)](https://david-dm.org/rumps/scriptsify)
[![Dev Dependencies](http://img.shields.io/david/dev/rumps/scriptsify.svg?style=flat-square)](https://david-dm.org/rumps/scriptsify#info=devDependencies)
<br>
[![Travis](http://img.shields.io/travis/rumps/scriptsify.svg?style=flat-square&label=travis)](https://travis-ci.org/rumps/scriptsify)
[![Appveyor](http://img.shields.io/appveyor/ci/jupl/rump-scriptsify.svg?style=flat-square&label=appveyor)](https://ci.appveyor.com/project/jupl/rump-scriptsify)
[![Codecov](http://img.shields.io/codecov/c/github/rumps/scriptsify.svg?style=flat-square&label=codecov)](https://codecov.io/github/rumps/scriptsify?view=all)

### Develop
[![Dependencies](http://img.shields.io/david/rumps/scriptsify/develop.svg?style=flat-square)](https://david-dm.org/rumps/scriptsify/develop)
[![Dev Dependencies](http://img.shields.io/david/dev/rumps/scriptsify/develop.svg?style=flat-square)](https://david-dm.org/rumps/scriptsify/develop#info=devDependencies)
<br>
[![Travis](http://img.shields.io/travis/rumps/scriptsify/develop.svg?style=flat-square&label=travis)](https://travis-ci.org/rumps/scriptsify)
[![Appveyor](http://img.shields.io/appveyor/ci/jupl/rump-scriptsify/develop.svg?style=flat-square&label=appveyor)](https://ci.appveyor.com/project/jupl/rump-scriptsify)
[![Codecov](http://img.shields.io/codecov/c/github/rumps/scriptsify/develop.svg?style=flat-square&label=codecov)](https://codecov.io/github/rumps/scriptsify?branch=develop&view=all)


## About
Rump Scriptsify is a Rump module for handling and building scripts with
[Browserify](https://browserify.org/)/Watchify, offering a lot of flexibility
and configuration to author your scripts. For more information, visit the
[core repository](https://github.com/rumps/core).


## API
The following is appended to the core Rump API:

### `rump.addGulpTasks(options)`
This module adds the following tasks:

- `build:scripts` will process and build scripts with Browserify. For more
information on source and destination paths see `rump.configure()` below. This
task is also added to the `build` task for single builds as well as the `watch`
task for continuous builds.
- `info:scripts` will display information on what this specific module does,
specifically the source and destination paths as well as what files would get
processed. This task is also added to the `info` task.

### `rump.configure(options)`
Redefine options for Rump and Rump modules to follow. In addition to what
options Rump and other Rump modules offer, the following options are
available alongside default values:

#### `options.paths.source.scripts` (`'scripts'`)
This is the directory where scripts to be processed are contained. This path is
relative to the root source path. (If the default root and scripts path is
used, then the path would be `src/scripts`)

#### `options.paths.destination.scripts` (`'scripts'`)
This is the directory where processed scripts are copied to. This path is
relative to the root destination path. (If the default root and scripts path is
used, then the path would be `dist/scripts`)

#### `options.globs.build.scripts` (`'*.js'`)
This specifies which scripts to process.

#### `options.scripts.minify` (`options.environment === 'production'`)
This specifies whether to minify and uglify generated JS. (minified if `true`)
By default JS is minified only if the environment is set to production. (visit
the main Rump repository for more information on environment)

#### `options.scripts.sourceMap` (`options.environment === 'development'`)
This specifies whether to include inline source maps to generated JS. (source
maps included if `true`) By default source maps are included only if the
environment is set to development. (visit the main Rump repository for more
information on environment)

#### `options.scripts.browserify`
This specifies any options you want to override/set up when intializing a
Browserify bundle.

#### `options.scripts.transforms` (`[]`)
This specifies a list of transforms that will be applied to Browserify bundles.

#### `options.scripts.plugins` (`[]`)
This specifies a list of plugins that will be applied to Browserify bundles.

#### `options.scripts.uglifyjs`
This specifies options that are sent to UglifyJS through Webpack when
minifying. The default options set are:

```js
{
  output: {
    comments: false
  },
  compress: {
    drop_console: true,
    drop_debugger: true
  }
}
```

### `rump.configs.browserify`, `rump.configs.uglifyjs`
This contains the generated options that are passed to Browserify and UglifyJS,
respectively, in the Gulp task. This is a good way to see what options are
generated based on defaults and overrides.


## Plugins/Transforms
The following plugins/transforms are used by default for builds:
- [`bundle-collapser`](https://github.com/substack/bundle-collapser) is used
in non-watch production builds to reduce the size of builds.
- [`unreachable-branch-transform`](https://github.com/zertosh/unreachable-branch-transform)
is used in production builds to remove dead code.
