/* eslint-env node */
/* eslint-disable strict, no-console */

'use strict';

const chalk = require('chalk');
const gulp = require('gulp');
const path = require('path');
const runSequence = require('run-sequence');
const inquirer = require('inquirer');
const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const gutil = require('gulp-util');
const clearConsole = require('react-dev-utils/clearConsole');
const formatWebpackMessages = require('react-dev-utils/formatWebpackMessages');

const webpackConfig = require('../../webpack.config.js');
const paths = require('./paths');
const buildUtil = require('./util');

const hotReload = !!process.env.HOT_RELOAD;

// will be populated with data using the askForDevOptions task
let devModeOptions;

gulp.task('prepareTestExecution', cb => {
  runSequence('ensureTargetDirStructureExists', 'translateTheme', cb);
});

gulp.task('dev', cb => {
  runSequence(
    'askForDevOptions',
    'clean',
    'ensureTargetDirStructureExists',
    [
      'copyFavicon',
      'writeBuildInfo',
      'translateTheme',
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
  var testEnvironment = {
    uiBackendUrl: 'https://test-instana.instana.io',
    butlerUrl: 'https://test-instana.instana.io',
    tenant: 'instana',
    tenantUnit: 'test',
    environment: 'saas',
    butlerDomain: 'test-fullstack-0-us-west-2.instana.io'
  };
  var localBackendEnvironment = {
    uiBackendUrl: 'http://localhost:8080',
    websocketEndpoint: 'http://localhost:8082/',
    butlerUrl: 'http://localhost:8480',
    withoutAuthPrefix: true,
    local: true,
    tenant: 'instana',
    tenantUnit: 'test',
    environment: 'local',
    butlerDomain: 'local-instana.instana.io'
  };

  var target = null;
  if (/^test$/i.test(process.env.TARGET)) {
    target = testEnvironment;
  } else if (/^local$/i.test(process.env.TARGET)) {
    target = localBackendEnvironment;
  }

  var questions = [];
  if (!target) {
    questions.push({
      type: 'list',
      name: 'target',
      message: 'Where would you like to get data from?',
      choices: [
        {
          name: 'Test environment',
          value: testEnvironment
        },
        {
          name: 'Local backend',
          value: localBackendEnvironment
        },
        {
          name: 'From a specific (SAAS) tenant unit',
          value: {}
        }
      ]
    });
  }

  questions = questions.concat([
    {
      type: 'list',
      name: 'environment',
      message: 'Environment?',
      choices: [
        {
          name: 'saas',
          value: {
            butlerDomain: 'instana.io'
          }
        }
      ],
      when(answers) {
        if (target) {
          answers.target = target;
        }
        return answers.target.butlerUrl == null;
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
    }
  ]);

  var buildMode = null;
  if (/^prod$/i.test(process.env.BUILD_MODE)) {
    buildMode = 'production';
  } else if (/^ask$/i.test(process.env.BUILD_MODE)) {
    questions.push({
      type: 'list',
      name: 'buildMode',
      message: 'In which mode would you like to compile the source code (you will almost always want development)?',
      choices: ['development', 'production'],
      default: 'development'
    });
  } else {
    buildMode = 'development';
  }

  inquirer.prompt(questions, selectedOptions => {
    selectedOptions.buildMode = buildMode || selectedOptions.buildMode;
    // no premade target selected, we need to build it up!
    if (selectedOptions.target.butlerUrl == null) {
      selectedOptions.target = {
        uiBackendUrl: `https://${selectedOptions.tenantUnit}-${selectedOptions.tenant}.instana.io`,
        butlerUrl: `https://${selectedOptions.tenantUnit}-${selectedOptions.tenant}.instana.io`,
        tenant: selectedOptions.tenant,
        tenantUnit: selectedOptions.tenantUnit,
        environment: selectedOptions.environment,
        butlerDomain: selectedOptions.environment.butlerDomain,
        buildMode: selectedOptions.buildMode
      };
    }
    devModeOptions = selectedOptions;
    cb();
  });
});

gulp.task('writeDevConfigFile', () => {
  buildUtil.writeDevModeConfig(devModeOptions.target);
});

gulp.task('copyDevIndexHtml', () => {
  return gulp.src(paths.devIndexHtmlSrc).pipe(gulp.dest(paths.assetDir));
});

gulp.task('enableDevWatches', () => {
  gulp.watch(path.join(paths.themeDir, 'theme.js'), ['translateTheme']);
  gulp.watch(paths.devIndexHtmlSrc, ['copyDevIndexHtml']);
  gulp.watch(paths.faviconSrc, ['copyFavicon']);
  gulp.watch(paths.featureFlags, ['writeDevConfigFile']);
});

gulp.task('startDevProxy', function startDevProxy() {
  const envConfig = devModeOptions.target;
  const uiBackendUrl = envConfig.uiBackendUrl;
  const butlerUrl = envConfig.butlerUrl;
  let websocketEndpoint = envConfig.websocketEndpoint || uiBackendUrl;

  let butlerApiPrefix = '';
  if (!envConfig.withoutAuthPrefix) {
    butlerApiPrefix = '/auth';
  }

  const httpProxy = {
    '/': 'http://127.0.0.1:3000',
    '/api/': `${uiBackendUrl}/api/`,
    '/auth/signIn': butlerUrl + butlerApiPrefix + '/signIn',
    '/auth/signOut': butlerUrl + butlerApiPrefix + '/signOut',
    '/auth/users/current': butlerUrl + butlerApiPrefix + '/users/current',
    '/auth/users/tenants': butlerUrl + butlerApiPrefix + '/users/tenants',
    '/ump': butlerUrl + '/ump',
    '/assets/': butlerUrl + '/assets/',
    '/uiTracker/': 'http://127.0.0.1:8484/',
    '/notifications/': 'https://instana.github.io/ui-notifications/content/'
  };

  if (hotReload) {
    // webpack hot reload HTTP URL
    httpProxy['/hot/'] = 'http://127.0.0.1:3000/hot/';
  }

  if (envConfig.local) {
    httpProxy['/api/checkUserAccessPermitted'] = `${uiBackendUrl}/checkUserAccessPermitted`;
  }

  const websocketProxy = {
    // Instana websocket API
    '/api/data/': websocketEndpoint
  };

  if (hotReload) {
    // webpack hot reload websocket URL
    websocketProxy['/sockjs-node/'] = 'http://127.0.0.1:3000/sockjs-node/';
  }

  const config = {
    serverName: 'local-instana.instana.io',
    port: 4000,
    root: paths.assetDir,
    ssi: true,
    tls: true,
    tlsCertificateFile: path.join(__dirname, '..', 'cert', 'server.crt'),
    tlsCertificateKeyFile: path.join(__dirname, '..', 'cert', 'server.key'),
    proxy: httpProxy,
    websocketProxy
  };

  buildUtil.startProxrox(config);
});

gulp.task('openDevUrlInBrowser', () => {
  // set environment variable DONT_OPEN_BROWSER to some non-empty string to
  // avoid having Gulp opening a browser every time you start the build.
  if (!process.env.DONT_OPEN_BROWSER) {
    buildUtil.openBrowser('https://local-instana.instana.io:4000');
  }
});

gulp.task('webpack:dev', () => {
  // modify some webpack config options
  var config = Object.create(webpackConfig);
  config.devtool = 'eval';
  config.plugins.push(
    new webpack.LoaderOptionsPlugin({
      debug: true
    })
  );

  //TODO: Reactivate for dev mode if the problem with OOM has been fixed
  //see https://github.com/webpack/webpack/issues/5089
  if (devModeOptions.buildMode !== 'development') {
    config.plugins.push(new webpack.optimize.ModuleConcatenationPlugin());
  }

  // Start a webpack-dev-server
  new WebpackDevServer(createWebpackCompiler(config), {
    publicPath: '/bundle',
    contentBase: 'target/assets/',
    inline: true,
    noInfo: true,
    quiet: true,
    hot: hotReload,
    watchOptions: {
      ignored: /node_modules/
    },
    stats: {
      colors: true
    }
  }).listen(3000, 'localhost', err => {
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
      console.log('Use ' + chalk.yellow('// eslint-disable-next-line') + ' to ignore the next line.');
      console.log('Use ' + chalk.yellow('/* eslint-disable */') + ' to ignore all warnings in a file.');
    }
  });

  return compiler;
}
