/*eslint-env node*/
/*eslint-disable no-var, strict*/

'use strict';

var fs = require('fs');
var childProcess = require('child_process');
var path = require('path');
var del = require('del');
var filter = require('gulp-filter');
var gulp = require('gulp');
var gutil = require('gulp-util');
var rename = require('gulp-rename');
var Promise = require('bluebird');
var rev = require('gulp-rev');
var revReplace = require('gulp-rev-replace');
var minifyCss = require('gulp-minify-css');
var shell = require('shelljs');
var size = require('gulp-size');
var util = require('util');
var webpack = require('webpack');
var WebpackDevServer = require('webpack-dev-server');
var fs = require('fs');
var buildTheme = require('instana-ui-theme/build/translateTheme');

var webpackConfig = require('./webpack.config.js');

var htmlFile = 'index.html';


gulp.task('removeTemporaryBuildArtifacts', ['performCacheBustingOptimizations'], function() {
  del.sync([
    'target/bundle/index.js',
    'target/bundle/theme-day.css',
    'target/bundle/theme-night.css'
  ]);
});


gulp.task('performCacheBustingOptimizations', ['webpack:build'], function() {
  var assetFilter = filter(['**/*.js', '**/*.css']);
  var cssFilter = filter('**/*.css');
  var htmlFilter = filter('**/*.html');

  return gulp.src(['target/bundle/index.js', 'target/bundle/theme-*.css', 'in-client/' + htmlFile])
    .pipe(cssFilter)
    .pipe(minifyCss())
    .pipe(cssFilter.restore())
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


gulp.task('build', [
  'webpack:build',
  'performCacheBustingOptimizations',
  'removeTemporaryBuildArtifacts',
  'copyfavicon',
  'copyconfig',
  'writeThemeIndex',
  'writeBuildInfo'
]);


gulp.task('translateThemeConfigs', function() {
  buildTheme('day', path.resolve('./in-themes'), 'target/bundle');
  buildTheme('night', path.resolve('./in-themes'), 'target/bundle');
});


gulp.task('writeThemeIndex', ['removeTemporaryBuildArtifacts'], function() {
  const themeIndex = fs.readdirSync('target/bundle')
    .reduce(function(themes, fileName) {
      const match = fileName.match(/theme-(\w+)-[^\.]+\.css/);
      if (match) {
        themes[match[1]] = fileName;
      }
      return themes;
    }, {});

  fs.writeFileSync('target/themes.json', JSON.stringify(themeIndex));
});


gulp.task('webpack:build', ['translateThemeConfigs'], function(callback) {
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

  buildForTheme('day', function() {
    buildForTheme('night', function() {
      callback();
    });
  });

  function buildForTheme(themeName, cb) {
    setActiveTheme(themeName);
    webpack(config, function(err, stats) {
      if(err) {
        throw new gutil.PluginError('webpack:build', err);
      }
      gutil.log('[webpack:build]', stats.toString({
        colors: true
      }));
      childProcess.execSync('mv target/bundle/index.css target/bundle/theme-' + themeName + '.css');
      cb();
    });
  }
});


function setActiveTheme(themeName) {
  childProcess.execSync('rm -f in-themes/active.json');
  childProcess.execSync('rm -f in-themes/active.less');
  childProcess.execSync('ln -s ../target/bundle/' + themeName + '/config.json in-themes/active.json');
  childProcess.execSync('ln -s ../target/bundle/' + themeName + '/config.less in-themes/active.less');
}


function getBanner() {
  var year = new Date().getFullYear();

  return util.format(
    'instana ui-client v%s | (c) %s instana Inc. | commit %s',
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
  'copyconfig',
  'writeBuildInfo',
  'dev-watches',
  'webpack:dev'
]);


gulp.task('dev-watches', function() {
  gulp.watch('in-client/' + htmlFile, ['copyhtml']);
});


gulp.task('copyhtml', function() {
  gulp.src('in-client/' + htmlFile)
    .pipe(rename({
      basename: 'index',
      extname: '.html'
    }))
    .pipe(gulp.dest('target/'));
});


gulp.task('copyfavicon', function() {
  gulp.src('in-client/favicon.png').pipe(gulp.dest('target/'));
});


gulp.task('copyconfig', function() {
  gulp.src('in-client/config.json').pipe(gulp.dest('target/'));
});


gulp.task('writeBuildInfo', function() {
  var data = {
    revision: getRevision(),
    version: getVersion(),
    date: new Date().toISOString(),
    containerTag: process.env.INSTANA_CONTAINER_TAG || 'unknown'
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
