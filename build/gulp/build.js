/* eslint-env node */
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
var nano = require('gulp-cssnano');
var execSync = require('child_process').execSync;

var webpackConfig = require('../../webpack.config.js');
var environments = require('./environments');
var buildUtil = require('./util');
var paths = require('./paths');


// will be populated with data using the identifyTryBuildTargetEnvironment task
var tryBuildModeOptions;


gulp.task('build', cb => {
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


gulp.task('try-build', cb => {
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


gulp.task('copyServerSources', () => {
  return gulp.src(paths.allServerSourcesSelector).pipe(gulp.dest(paths.targetDir));
});


gulp.task('minifyCss', () => {
  return gulp.src(paths.allCssAssets)
    .pipe(nano({
      zindex: false
    }))
    .pipe(gulp.dest(paths.bundleDir));
});


gulp.task('printFileStatistics', () => {
  return gulp.src([paths.allCssAssets, paths.allJsAssets])
    .pipe(size({
      showFiles: true,
      gzip: true
    }));
});


gulp.task('webpack:build', (callback) => {
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

  // buildForTheme('day', () => {
    buildForTheme('night', () => {
      callback();
    });
  // });

  function buildForTheme(themeName, cb) {
    buildUtil.setActiveTheme(themeName);
    webpack(config, (err, stats) => {
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


gulp.task('identifyTryBuildTargetEnvironment', cb => {
  var questions = [
    {
      type: 'list',
      name: 'environment',
      message: 'Which environment would you like to run against?',
      choices: Object.keys(environments),
      filter: env => {
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

  inquirer.prompt(questions, selectedOptions => {
    tryBuildModeOptions = selectedOptions;
    cb();
  });
});


gulp.task('writeTryBuildConfigFile', () => {
  buildUtil.writeDevModeConfig(
    tryBuildModeOptions.uiMode === 'saas' ? 'production' : 'demo',
    environments[tryBuildModeOptions.environment]
  );
});


gulp.task('writeTryBuildServerConfigFile', () => {
  var config = {
    baseUrl: 'https://local-instana.instana.io:4000',
    uiBackendBaseUrl: 'http://127.0.0.1:8080'
  };
  fs.writeFileSync(
    path.join(paths.targetDir, 'serverConfig.json'),
    JSON.stringify(config, 0, 2)
  );
});


gulp.task('startTryBuildServer', () => {
  execSync(
    'node "' +
    path.join(paths.targetDir, 'index.js') +
    '"',
    {
      stdio: 'inherit'
    }
  );
});


gulp.task('startTryBuildProxy', () => {
  var envConfig = environments[tryBuildModeOptions.environment];
  var uiBackendUrl = envConfig.uiBackendUrl;
  var groundskeeperUrl = envConfig.groundskeeperUrl;

  var gkApiPrefix = '';
  if (!envConfig.withoutAuthPrefix) {
    gkApiPrefix = '/auth';
  }

  var config = {
    serverName: 'local-instana.instana.io',
    port: 4000,
    root: false,
    ssi: true,
    tls: true,
    proxy: {
      '/': 'http://127.0.0.1:3131',
      '/auth/signIn': groundskeeperUrl + gkApiPrefix + '/signIn',
      '/auth/signOut': groundskeeperUrl + gkApiPrefix + '/signOut',
      '/auth/users/current': groundskeeperUrl + gkApiPrefix + '/users/current',
      '/auth/users/tenants': groundskeeperUrl + gkApiPrefix + '/users/tenants',
      '/uiTracker/': 'http://127.0.0.1:8484/',
      '/assets/': groundskeeperUrl + '/assets/',
      '/notifications/': 'https://instana.github.io/ui-notifications/content/'
    },

    websocketProxy: {
      '/api/data': uiBackendUrl
    }
  };

  buildUtil.startProxrox(config);
});


gulp.task('openTryBuildUrlInBrowser', () => {
  buildUtil.openBrowser('https://local-instana.instana.io:4000');
});
