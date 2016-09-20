/* eslint-env node */
/* eslint-disable no-var, strict, vars-on-top */

'use strict';

var fs = require('fs');
var gulp = require('gulp');
var path = require('path');
var runSequence = require('run-sequence');
var inquirer = require('inquirer');
var webpack = require('webpack');
var gutil = require('gulp-util');
var execSync = require('child_process').execSync;

var webpackConfig = require('../../webpack.config.js');
var paths = require('./paths');
var buildUtil = require('./util');

// will be populated with data using the askForDevOptions task
var devModeOptions;


gulp.task('prepareTestExecution', cb => {
  runSequence(
    'ensureTargetDirStructureExists',
    'translateThemeConfigs',
    'setActiveThemeForTestExecution',
    cb
  );
});


gulp.task('dev', cb => {
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


gulp.task('askForDevOptions', cb => {
  var questions = [
    {
      type: 'list',
      name: 'target',
      message: 'Which target would you like to run against?',
      choices: [
        {
          name: 'Test',
          value: {
            uiBackendUrl: 'https://test-instana.instana.io/api/data/',
            groundskeeperUrl: 'https://internal-groundskeeper-instana.instana.io',
            tenant: 'instana',
            tenantUnit: 'test',
            groundskeeperDomain: 'internal-groundskeeper-instana.instana.io'
          }
        },
        {
          name: 'Local',
          value: {
            uiBackendUrl: 'http://localhost:8082/',
            groundskeeperUrl: 'http://localhost:8280',
            withoutAuthPrefix: true,
            tenant: 'instana',
            tenantUnit: 'test',
            groundskeeperDomain: 'internal-groundskeeper-instana.instana.io'
          }
        },
        {
          name: 'Custom TU Coordinates',
          value: {}
        }
      ]
    },
    {
      type: 'list',
      name: 'environment',
      message: 'Environment?',
      choices: [
        {
          name: 'saas',
          value: {
            groundskeeperUrl: 'https://instana.io',
            groundskeeperDomain: 'instana.io'
          }
        },
        {
          name: 'staging',
          value: {
            groundskeeperUrl: 'https://staging-groundskeeper-instana.instana.io',
            groundskeeperDomain: 'staging-groundskeeper-instana.instana.io'
          }
        },
        {
          name: 'demo',
          value: {
            groundskeeperUrl: 'https://demo-groundskeeper-instana.instana.io',
            groundskeeperDomain: 'demo-groundskeeper-instana.instana.io'
          }
        },
        {
          name: 'internal',
          value: {
            groundskeeperUrl: 'https://internal-groundskeeper-instana.instana.io',
            groundskeeperDomain: 'internal-groundskeeper-instana.instana.io'
          }
        }
      ],
      when(answers) {
        return answers.target.groundskeeperUrl == null;
      }
    },
    {
      type: 'input',
      name: 'tenant',
      message: 'Tenant?',
      when(answers) {
        return answers.target.tenant == null;
      }
    },
    {
      type: 'input',
      name: 'tenantUnit',
      message: 'Tenant Unit?',
      when(answers) {
        return answers.target.tenantUnit == null;
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
    },
    {
      type: 'confirm',
      name: 'withMonitoring',
      message: 'Run with Instana Node.js sensor?',
      default: false
    },
    {
      type: 'confirm',
      name: 'withDashboard',
      message: 'Use dashboard in dev mode?',
      default: true
    }
  ];

  inquirer.prompt(questions, (selectedOptions) => {
    if (selectedOptions.withMonitoring) {
      require('instana-nodejs-sensor')({
        tracing: {
          enabled: true
        }
      });
    }

    // no premade target selected, we need to build it up!
    if (selectedOptions.target.groundskeeperUrl == null) {
      selectedOptions.target = {
        uiBackendUrl: `https://${selectedOptions.tenantUnit}-${selectedOptions.tenant}.instana.io/api/data/`,
        groundskeeperUrl: selectedOptions.environment.groundskeeperUrl,
        tenant: selectedOptions.tenant,
        tenantUnit: selectedOptions.tenantUnit,
        groundskeeperDomain: selectedOptions.environment.groundskeeperDomain
      };
    }
    devModeOptions = selectedOptions;
    cb();
  });
});


gulp.task('writeDevConfigFile', () => {
  buildUtil.writeDevModeConfig(
    devModeOptions.uiMode === 'saas' ? 'production' : 'demo',
    devModeOptions.target
  );
});


gulp.task('copyDevIndexHtml', () => {
  return gulp.src(paths.devIndexHtmlSrc)
    .pipe(gulp.dest(paths.assetDir));
});


gulp.task('setActiveThemeForTestExecution', () => {
  buildUtil.setActiveTheme('night');
});


gulp.task('setActiveThemeForDevMode', () => {
  buildUtil.setActiveTheme(devModeOptions.activeTheme);

  var activeThemeConfig = path.join(paths.assetDir, 'activeTheme.json');
  execSync('ln -s "' + paths.activeThemeJsonFile + '" "' + activeThemeConfig + '"');
  fs.writeFileSync(
    path.join(paths.assetDir, 'activeTheme.name'),
    devModeOptions.activeTheme
  );
});


gulp.task('enableDevWatches', () => {
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


gulp.task('startDevProxy', function startDevProxy() {
  var envConfig = devModeOptions.target;
  var uiBackendUrl = envConfig.uiBackendUrl;
  var groundskeeperUrl = envConfig.groundskeeperUrl;

  var gkApiPrefix = '';
  if (!envConfig.withoutAuthPrefix) {
    gkApiPrefix = '/auth';
  }

  var config = {
    serverName: 'local-instana.instana.io',
    port: 4000,
    root: paths.assetDir,
    ssi: true,
    tls: true,
    proxy: {
      '/': 'http://127.0.0.1:3000',
      '/auth/signIn': groundskeeperUrl + gkApiPrefix + '/signIn',
      '/auth/signOut': groundskeeperUrl + gkApiPrefix + '/signOut',
      '/auth/users/current': groundskeeperUrl + gkApiPrefix + '/users/current',
      '/auth/users/tenants': groundskeeperUrl + gkApiPrefix + '/users/tenants',
      '/ump': groundskeeperUrl + '/ump',
      '/uiTracker/': 'http://127.0.0.1:8484/',
      '/assets/': groundskeeperUrl + '/assets/',
      '/notifications/': 'https://instana.github.io/ui-notifications/content/'
    },

    websocketProxy: {
      '/api/data/': uiBackendUrl
    }
  };

  buildUtil.startProxrox(config);
});

gulp.task('openDevUrlInBrowser', () => {
  buildUtil.openBrowser('https://local-instana.instana.io:4000');
});


gulp.task('webpack:dev', () => {
  // modify some webpack config options
  var config = Object.create(webpackConfig);
  config.devtool = 'eval';
  config.debug = true;

  var express = require('express');

  var app = express();
  var compiler = webpack(config);

  if (devModeOptions.withDashboard) {
    var Dashboard = require('webpack-dashboard');
    var DashboardPlugin = require('webpack-dashboard/plugin');
    var dashboard = new Dashboard();
    compiler.apply(new DashboardPlugin(dashboard.setData));
  }

  app.use(require('webpack-dev-middleware')(compiler, {
    publicPath: '/bundle',
    contentBase: 'target/assets/',
    inline: true,
    noInfo: true,
    quiet: true,
    watchOptions: {
      ignored: /node_modules/
    },
    stats: {
      colors: true
    }
  }));

  app.listen(3000, (err) => {
    if (err) {
      throw new gutil.PluginError('webpack-dev-server', err);
    }
    gutil.log('[webpack:dev]', 'http://localhost:3000/');
  });

  // return a Promise so that Gulp knows that this task is going to
  // continue to run asynchronously
  return new Promise(() => {});
});
