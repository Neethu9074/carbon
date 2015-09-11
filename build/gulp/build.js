/*eslint-env node*/
/*eslint-disable no-var, strict, vars-on-top */

'use strict';

var path = require('path');
var gulp = require('gulp');
var nodemon = require('nodemon');
var size = require('gulp-size');
var gutil = require('gulp-util');
var webpack = require('webpack');
var runSequence = require('run-sequence');
var minifyCss = require('gulp-minify-css');
var execSync = require('child_process').execSync;

var webpackConfig = require('../../webpack.config.js');
var buildUtil = require('./util');
var paths = require('./paths');

gulp.task('build', function(cb) {
  runSequence(
    'clean',
    'ensureTargetDirStructureExists',
    ['copyFavicon', 'writeBuildInfo', 'copyServerSources', 'translateThemeConfigs'],
    'webpack:build',
    'minifyCss',
    'printFileStatistics',
    cb
  );
});


gulp.task('copyServerSources', function() {
  return gulp.src(paths.allServerSourcesSelector).pipe(gulp.dest(paths.targetDir));
});



gulp.task('minifyCss', function() {
  return gulp.src(paths.generatedCssFileSelector)
    .pipe(minifyCss())
    .pipe(gulp.dest(paths.bundleDir));
});


gulp.task('printFileStatistics', function() {
  return gulp.src([paths.generatedCssFileSelector, paths.javascriptEntryPointFile])
    .pipe(size({
      showFiles: true,
      gzip: true
    }));
});


gulp.task('webpack:build', function(callback) {
  // modify some webpack config options
  var config = Object.create(webpackConfig);

  // Report the first error as a hard error instead of tolerating it.
  config.bail = true;

  config.plugins = config.plugins.concat(
    new webpack.DefinePlugin({
      'process.env': {
        // This has effect on the react lib size
        'NODE_ENV': JSON.stringify('production')
      }
    }),
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.UglifyJsPlugin({
      comments: /\/DONOTKEEPANYCOMMENTS/
    }),
    new webpack.BannerPlugin(buildUtil.getBanner())
  );

  buildForTheme('day', function() {
    buildForTheme('night', function() {
      callback();
    });
  });

  function buildForTheme(themeName, cb) {
    buildUtil.setActiveTheme(themeName);
    webpack(config, function(err, stats) {
      if (err) {
        throw new gutil.PluginError('webpack:build', err);
      }

      gutil.log('[webpack:build]', stats.toString({
        colors: true
      }));

      const generatedCssFile = path.join(paths.bundleDir, 'index.css');
      const renamedThemeFile = path.join(paths.bundleDir, 'theme-' + themeName + '.css');
      execSync('mv ' + generatedCssFile + ' ' + renamedThemeFile);
      cb();
    });
  }
});


gulp.task('startDevBackendServer', function() {
  nodemon({
    script: path.join(paths.targetDir, 'index.js'),
    execMap: {
      js: path.join(paths.rootDir, 'node_modules', '.bin', 'babel-node')
    },
    watch: [
      paths.targetDir
    ]
  });
});
