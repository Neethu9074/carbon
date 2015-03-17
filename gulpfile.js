'use strict';

var cache = require('gulp-cached');
var del = require('del');
var eslint = require('gulp-eslint');
var filter = require('gulp-filter');
var gulp = require('gulp');
var gutil = require('gulp-util');
var Promise = require('bluebird');
var rev = require('gulp-rev');
var revReplace = require('gulp-rev-replace');
var shell = require('shelljs');
var size = require('gulp-size');
var util = require('util');
var webpack = require('webpack');
var WebpackDevServer = require('webpack-dev-server');

var webpackConfig = require('./webpack.config.js');

var paths = {
  js: ['gulpfile.js', 'src/javascript/**/*.js']
};


gulp.task('clean', function(cb) {
  del(['./target'], cb);
});


gulp.task('lint', function() {
  return gulp.src(paths.js)
    .pipe(cache('linting'))
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
});


gulp.task('build', ['webpack:build'], function() {
  var assetFilter = filter('**/*.js');
  var htmlFilter = filter('**/*.html');

  return gulp.src(['target/bundle/index.js', 'src/index.html'])
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
  config.plugins = config.plugins.concat(
    new webpack.DefinePlugin({
      'process.env': {
        // This has effect on the react lib size
        'NODE_ENV': JSON.stringify('production')
      }
    }),
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.UglifyJsPlugin(),
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
    'instana visualization v%s | (c) %s instana Inc. | commit %s',
    require('./package.json').version,
    (year === 2014 ? 2014 : '2014 - ' + year),
    shell.exec('git rev-parse HEAD').output.trim()
  );
}


// The development server (the recommended option for development)
gulp.task('dev', ['copyhtml', 'dev-watches', 'webpack:dev']);


gulp.task('dev-watches', function() {
  //gulp.watch(paths.js, ['lint']);
  gulp.watch('src/index.html', ['copyhtml']);
});


gulp.task('copyhtml', function() {
  gulp.src('src/index.html').pipe(gulp.dest('target/'));
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
