/* eslint-env node*/
/* eslint-disable no-var, strict, vars-on-top */

'use strict';

var fs = require('fs');
var path = require('path');
var gulp = require('gulp');
var size = require('gulp-size');
var gutil = require('gulp-util');
var webpack = require('webpack');
var inquirer = require('inquirer');
var runSequence = require('run-sequence');
var minifyCss = require('gulp-minify-css');
var execSync = require('child_process').execSync;

var webpackConfig = require('../../webpack.config.js');
var environments = require('./environments');
var buildUtil = require('./util');
var paths = require('./paths');


// will be populated with data using the identifyTryBuildTargetEnvironment task
var tryBuildModeOptions;


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


gulp.task('try-build', function(cb) {
  runSequence(
    'identifyTryBuildTargetEnvironment',
    'build',
    [
      'startTryBuildProxy',
      'openTryBuildUrlInBrowser',
      'writeTryBuildConfigFile',
      'writeTryBuildServerConfigFile'
    ],
    'startTryBuildServer',
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
      execSync('mv "' + generatedCssFile + '" "' + renamedThemeFile + '"');
      cb();
    });
  }
});


gulp.task('identifyTryBuildTargetEnvironment', function(cb) {
  var questions = [
    {
      type: 'list',
      name: 'environment',
      message: 'Which environment would you like to run against?',
      choices: Object.keys(environments).map(function(env) {
        var config = environments[env];
        return env + ' (' + config.user + ' / ' + config.pw + ')';
      }),
      filter: function(env) {
        // extract environment name
        return env.match(/(\w+)/)[1];
      }
    },
    {
      type: 'list',
      name: 'uiMode',
      message: 'Mode of the UI?',
      choices: [
        'saas',
        'demo'
      ],
      default: 'saas'
    }
  ];

  inquirer.prompt(questions, function(selectedOptions) {
    tryBuildModeOptions = selectedOptions;
    cb();
  });
});


gulp.task('writeTryBuildConfigFile', function() {
  buildUtil.writeDevModeConfig(tryBuildModeOptions.uiMode === 'saas' ? 'production' : 'demo');
});


gulp.task('writeTryBuildServerConfigFile', function() {
  var config = {
    baseUrl: 'https://local-instana.instana.io:4000',
    uiBackendBaseUrl: environments[tryBuildModeOptions.environment].uiBackendUrl
  };
  fs.writeFileSync(
    path.join(paths.targetDir, 'serverConfig.json'),
    JSON.stringify(config, 0, 2)
  );
});


gulp.task('startTryBuildServer', function() {
  execSync(
    '"' + path.join(paths.binDir, 'babel-node') +
    '" "' +
    path.join(paths.targetDir, 'index.js') +
    '"',
    {
      stdio: 'inherit'
    }
  );
});


gulp.task('startTryBuildProxy', function() {
  var envConfig = environments[tryBuildModeOptions.environment];
  var uiBackendUrl = envConfig.uiBackendUrl;
  var groundskeeperUrl = envConfig.groundskeeperUrl;
  var instagrafanaUrl = 'https://monitoring-instana.instana.io/api/internal';

  var config = {
    serverName: 'local-instana.instana.io',
    port: 4000,
    root: false,
    ssi: true,
    tls: true,
    proxy: {
      '/': 'http://127.0.0.1:3131',
      '/auth/signIn': groundskeeperUrl + '/auth/signIn',
      '/auth/signOut': groundskeeperUrl + '/auth/signOut',
      '/auth/users/current': groundskeeperUrl + '/auth/users/current',
      '/internal/api': instagrafanaUrl + 'api',
      '/uiTracker/': 'http://127.0.0.1:8484/',
      '/assets/': groundskeeperUrl + '/assets/'
    },

    websocketProxy: {
      '/api/data': uiBackendUrl + '/data'
    }
  };

  buildUtil.startProxrox(config);
});


gulp.task('openTryBuildUrlInBrowser', function() {
  buildUtil.openBrowser('https://local-instana.instana.io:4000');
});
