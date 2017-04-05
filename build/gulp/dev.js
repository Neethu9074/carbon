/* eslint-env node */
/* eslint-disable strict, no-console */

'use strict';

const chalk = require('chalk');
const fs = require('fs');
const gulp = require('gulp');
const path = require('path');
const runSequence = require('run-sequence');
const inquirer = require('inquirer');
const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const gutil = require('gulp-util');
const execSync = require('child_process').execSync;
const clearConsole = require('react-dev-utils/clearConsole');
const formatWebpackMessages = require('react-dev-utils/formatWebpackMessages');

const webpackConfig = require('../../webpack.config.js');
const paths = require('./paths');
const buildUtil = require('./util');

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
            uiBackendUrl: 'https://test-instana.instana.io',
            groundskeeperUrl: 'https://internal-groundskeeper-instana.instana.io',
            tenant: 'instana',
            tenantUnit: 'test',
            butlerDomain: 'internal-groundskeeper-instana.instana.io'
          }
        },
        {
          name: 'Local',
          value: {
            uiBackendUrl: 'http://localhost:8080',
            websocketEndpoint: 'http://localhost:8082/',
            groundskeeperUrl: 'http://localhost:8480',
            withoutAuthPrefix: true,
            local: true,
            tenant: 'instana',
            tenantUnit: 'test',
            butlerDomain: 'internal-groundskeeper-instana.instana.io'
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
            butlerDomain: 'instana.io'
          }
        },
        {
          name: 'staging',
          value: {
            groundskeeperUrl: 'https://staging-groundskeeper-instana.instana.io',
            butlerDomain: 'staging-groundskeeper-instana.instana.io'
          }
        },
        {
          name: 'demo',
          value: {
            groundskeeperUrl: 'https://demo-groundskeeper-instana.instana.io',
            butlerDomain: 'demo-groundskeeper-instana.instana.io'
          }
        },
        {
          name: 'internal',
          value: {
            groundskeeperUrl: 'https://internal-groundskeeper-instana.instana.io',
            butlerDomain: 'internal-groundskeeper-instana.instana.io'
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
    }
  ];

  inquirer.prompt(questions, (selectedOptions) => {
    // no premade target selected, we need to build it up!
    if (selectedOptions.target.groundskeeperUrl == null) {
      selectedOptions.target = {
        uiBackendUrl: `https://${selectedOptions.tenantUnit}-${selectedOptions.tenant}.instana.io`,
        groundskeeperUrl: selectedOptions.environment.groundskeeperUrl,
        tenant: selectedOptions.tenant,
        tenantUnit: selectedOptions.tenantUnit,
        butlerDomain: selectedOptions.environment.butlerDomain
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
    path.join(themeBase, 'night.js')
  ];
  gulp.watch(themeFiles, ['translateThemeConfigs']);

  gulp.watch(paths.devIndexHtmlSrc, ['copyDevIndexHtml']);
  gulp.watch(paths.faviconSrc, ['copyFavicon']);
});


gulp.task('startDevProxy', function startDevProxy() {
  const envConfig = devModeOptions.target;
  const uiBackendUrl = envConfig.uiBackendUrl;
  const groundskeeperUrl = envConfig.groundskeeperUrl;
  let websocketEndpoint = envConfig.websocketEndpoint || uiBackendUrl;

  let gkApiPrefix = '';
  if (!envConfig.withoutAuthPrefix) {
    gkApiPrefix = '/auth';
  }

  const proxy = {
    '/': 'http://127.0.0.1:3000',
    '/api/': `${uiBackendUrl}/api/`,
    '/auth/signIn': groundskeeperUrl + gkApiPrefix + '/signIn',
    '/auth/signOut': groundskeeperUrl + gkApiPrefix + '/signOut',
    '/auth/users/current': groundskeeperUrl + gkApiPrefix + '/users/current',
    '/auth/users/tenants': groundskeeperUrl + gkApiPrefix + '/users/tenants',
    '/ump': groundskeeperUrl + '/ump',
    '/uiTracker/': 'http://127.0.0.1:8484/',
    '/assets/': groundskeeperUrl + '/assets/',
    '/notifications/': 'https://instana.github.io/ui-notifications/content/'
  };

  if (envConfig.local) {
    proxy['/api/checkUserAccessPermitted'] = `${uiBackendUrl}/checkUserAccessPermitted`;
  }

  const config = {
    serverName: 'local-instana.instana.io',
    port: 4000,
    root: paths.assetDir,
    ssi: true,
    tls: true,
    proxy,

    websocketProxy: {
      '/api/data/': websocketEndpoint
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

  // Start a webpack-dev-server
  new WebpackDevServer(createWebpackCompiler(config), {
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
  })
  .listen(3000, 'localhost', (err) => {
    if (err) {
      throw new gutil.PluginError('webpack-dev-server', err);
    }
    gutil.log('[webpack:dev]', 'http://localhost:3000/');
  });

  // return a Promise so that Gulp knows that this task is going to
  // continue to run asynchronously
  return new Promise(() => {});
});

function createWebpackCompiler(config, onReadyCallback) {
  // "Compiler" is a low-level interface to Webpack.
  // It lets us listen to some events and provide our own custom messages.
  let compiler;
  try {
    compiler = webpack(config);
  } catch (err) {
    console.log(chalk.red('Failed to compile.'));
    console.log();
    console.log(err.message || err);
    console.log();
    process.exit(1);
  }

  // "invalid" event fires when you have changed a file, and Webpack is
  // recompiling a bundle. WebpackDevServer takes care to pause serving the
  // bundle, so if you refresh, it'll wait instead of serving the old one.
  // "invalid" is short for "bundle invalidated", it doesn't imply any errors.
  compiler.plugin('invalid', () => {
    if (process.stdout.isTTY) {
      clearConsole();
    }
    console.log('Compiling...');
  });

  let isFirstCompile = true;

  // "done" event fires when Webpack has finished recompiling the bundle.
  // Whether or not you have warnings or errors, you will get this event.
  compiler.plugin('done', stats => {
    if (process.stdout.isTTY) {
      clearConsole();
    }

    // We have switched off the default Webpack output in WebpackDevServer
    // options so we are going to "massage" the warnings and errors and present
    // them in a readable focused way.
    const messages = formatWebpackMessages(stats.toJson({}, true));
    const isSuccessful = !messages.errors.length && !messages.warnings.length;
    const showInstructions = isSuccessful && (process.stdout.isTTY || isFirstCompile);

    if (isSuccessful) {
      console.log(chalk.green('Compiled successfully!'));
    }

    if (typeof onReadyCallback === 'function') {
      onReadyCallback(showInstructions);
    }
    isFirstCompile = false;

    // If errors exist, only show errors.
    if (messages.errors.length) {
      console.log(chalk.red('Failed to compile.'));
      console.log();
      messages.errors.forEach(message => {
        console.log(message);
        console.log();
      });
      return;
    }

    // Show warnings if no errors were found.
    if (messages.warnings.length) {
      console.log(chalk.yellow('Compiled with warnings.'));
      console.log();
      messages.warnings.forEach(message => {
        console.log(message);
        console.log();
      });
      // Teach some ESLint tricks.
      console.log('You may use special comments to disable some warnings.');
      console.log(
        'Use ' +
          chalk.yellow('// eslint-disable-next-line') +
          ' to ignore the next line.'
      );
      console.log(
        'Use ' +
          chalk.yellow('/* eslint-disable */') +
          ' to ignore all warnings in a file.'
      );
    }
  });

  return compiler;
};
