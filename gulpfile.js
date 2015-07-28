/*eslint-env node*/
/*eslint-disable no-var*/

'use strict';

var del = require('del');
var filter = require('gulp-filter');
var gulp = require('gulp');
var gutil = require('gulp-util');
var rename = require('gulp-rename');
var Promise = require('bluebird');
var rev = require('gulp-rev');
var revReplace = require('gulp-rev-replace');
var shell = require('shelljs');
var size = require('gulp-size');
var util = require('util');
var webpack = require('webpack');
var WebpackDevServer = require('webpack-dev-server');
var fs = require('fs');

var webpackConfig = require('./webpack.config.js');

var htmlFile;
if (process.env.TARGET_ENVIRONMENT === 'demo') {
  htmlFile = 'index-demo.html';
} else {
  htmlFile = 'index.html';
}

gulp.task('clean', function(cb) {
  del(['./target'], cb);
});


gulp.task('build', ['webpack:build', 'copyfavicon', 'writeBuildInfo'], function() {
  var assetFilter = filter('**/*.js');
  var htmlFilter = filter('**/*.html');

  return gulp.src(['target/bundle/index.js', 'ui-client/' + htmlFile])
    .pipe(assetFilter)
    .pipe(rev())
    .pipe(gulp.dest('target/bundle'))
    .pipe(assetFilter.restore())
    .pipe(revReplace())
    .pipe(htmlFilter)
    .pipe(gulp.dest('target'))
    .pipe(htmlFilter.restore())
    .pipe(size({
      showFiles: true,
      gzip: true
    }));
});


gulp.task('webpack:build', ['clean'], function(callback) {
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
    new webpack.BannerPlugin(getBanner())
  );

  // run webpack
  webpack(config, function(err, stats) {
    if(err) {
      throw new gutil.PluginError('webpack:build', err);
    }
    gutil.log('[webpack:build]', stats.toString({
      colors: true
    }));
    callback();
  });
});


function getBanner() {
  var year = new Date().getFullYear();

  return util.format(
    'instana ui browser v%s | (c) %s instana Inc. | commit %s',
    getVersion(),
    (year === 2014 ? 2014 : '2014 - ' + year),
    getRevision()
  );
}

function getVersion() {
  return require('./package.json').version;
}

function getRevision() {
  return shell.exec('git rev-parse HEAD').output.trim();
}


// The development server (the recommended option for development)
gulp.task('dev', [
  'copyhtml',
  'copyfavicon',
  'writeBuildInfo',
  'dev-watches',
  'webpack:dev'
]);


gulp.task('dev-watches', function() {
  gulp.watch('ui-client/' + htmlFile, ['copyhtml']);
});


gulp.task('copyhtml', function() {
  gulp.src('ui-client/' + htmlFile)
    .pipe(rename({
      basename: 'index',
      extname: '.html'
    }))
    .pipe(gulp.dest('target/'));
});


gulp.task('copyfavicon', function() {
  gulp.src('ui-client/favicon.png').pipe(gulp.dest('target/'));
});


gulp.task('writeBuildInfo', function() {
  var data = {
    revision: getRevision(),
    version: getVersion(),
    date: new Date().toISOString()
  };

  try {
    fs.mkdirSync('target');
  } catch (e) {
    // ignore when it already exists
  }

  fs.writeFileSync('target/build.json', JSON.stringify(data));
});

gulp.task('webpack:dev', function() {
  // modify some webpack config options
  var config = Object.create(webpackConfig);
  config.devtool = 'eval';
  config.debug = true;

  // Start a webpack-dev-server
  new WebpackDevServer(webpack(config), {
    publicPath: '/bundle',
    contentBase: 'target/',
    inline: true,
    stats: {
      colors: true
    }
  })
  .listen(3000, 'localhost', function(err) {
    if(err) {
      throw new gutil.PluginError('webpack-dev-server', err);
    }
    gutil.log('[webpack:dev]', 'http://localhost:3000/');
  });

  // return a Promise so that Gulp knows that this task is going to
  // continue to run asynchronously
  return new Promise(function(){});
});
