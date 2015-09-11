/*eslint-env node*/
/*eslint-disable no-var, strict, vars-on-top */

'use strict';

var gulp = require('gulp');
var path = require('path');
var runSequence = require('run-sequence');
var inquirer = require('inquirer');
var webpack = require('webpack');
var WebpackDevServer = require('webpack-dev-server');
var gutil = require('gulp-util');

var webpackConfig = require('../../webpack.config.js');
var paths = require('./paths');
var buildUtil = require('./util');
var environments = require('./environments');

// will be populated with data using the askForDevOptions task
var devModeOptions;

gulp.task('dev', function(cb) {
  runSequence(
    'askForDevOptions',
    'clean',
    'ensureTargetDirStructureExists',
    [
      'copyFavicon',
      'writeBuildInfo',
      'translateThemeConfigs',
      'setActiveThemeForDevMode',
      'copyDevIndexHtml',
      'writeDevConfigFile',
      'startDevProxy',
      'openDevUrlInBrowser'
    ],
    'enableDevWatches',
    'webpack:dev',
    cb
  );
});


gulp.task('askForDevOptions', function(cb) {
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
      name: 'buildMode',
      message: 'In which mode would you like to compile the source code?',
      choices: [
        'development',
        'production'
      ],
      default: 'development'
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
    },
    {
      type: 'list',
      name: 'activeTheme',
      message: 'Enabled theme',
      choices: [
        'night',
        'day'
      ],
      default: 'night'
    }
  ];

  inquirer.prompt(questions, function(selectedOptions) {
    devModeOptions = selectedOptions;
    cb();
  });
});


gulp.task('writeDevConfigFile', function() {
  buildUtil.writeDevModeConfig(devModeOptions.uiMode === 'saas' ? 'production' : 'demo');
});


gulp.task('copyDevIndexHtml', function() {
  return gulp.src(paths.devIndexHtmlSrc)
    .pipe(gulp.dest(paths.assetDir));
});


gulp.task('setActiveThemeForDevMode', function() {
  buildUtil.setActiveTheme(devModeOptions.activeTheme);
});


gulp.task('enableDevWatches', function() {
  const themeBase = path.join(paths.rootDir, 'in-themes');
  const themeFiles = [
    path.join(themeBase, 'common.js'),
    path.join(themeBase, 'day.js'),
    path.join(themeBase, 'night.js'),
    path.join(paths.rootDir, 'node_modules/instana-ui-theme/dist/**/*')
  ];
  gulp.watch(themeFiles, ['translateThemeConfigs']);

  gulp.watch(paths.devIndexHtmlSrc, ['copyDevIndexHtml']);
  gulp.watch(paths.faviconSrc, ['copyFavicon']);
});


gulp.task('startDevProxy', function() {
  var envConfig = environments[devModeOptions.environment];
  var uiBackendUrl = envConfig.uiBackendUrl;
  var groundskeeperUrl = envConfig.groundskeeperUrl;
  var instagrafanaUrl = 'https://monitoring-instana.instana.io/api/internal';

  var config = {
    serverName: 'local-instana.instana.io',
    port: 4000,
    root: paths.assetDir,
    ssi: true,
    tls: true,
    proxy: {
      '/': 'http://127.0.0.1:3000',
      '/auth/signIn': groundskeeperUrl + '/signIn',
      '/auth/signOut': groundskeeperUrl + '/signOut',
      '/auth/users/current': groundskeeperUrl + '/users/current',
      '/internal/api': instagrafanaUrl + 'api',
      '/uiTracker/': 'http://127.0.0.1:8484/'
    },

    websocketProxy: {
      '/api/data': uiBackendUrl + '/data'
    }
  };

  buildUtil.startProxrox(config);
});


gulp.task('openDevUrlInBrowser', function() {
  buildUtil.openBrowser('https://local-instana.instana.io:4000');
});


gulp.task('webpack:dev', function() {
  // modify some webpack config options
  var config = Object.create(webpackConfig);
  config.devtool = 'eval';
  config.debug = true;

  // Start a webpack-dev-server
  new WebpackDevServer(webpack(config), {
    publicPath: '/bundle',
    contentBase: 'target/assets/',
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
