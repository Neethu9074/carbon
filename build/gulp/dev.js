/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

/* eslint-env node */
/* eslint-disable strict, no-console */

'use strict';

const forkTsCheckerWebpackPlugin = require('react-dev-utils/ForkTsCheckerWebpackPlugin');
const formatWebpackMessages = require('react-dev-utils/formatWebpackMessages');
const typescriptFormatter = require('react-dev-utils/typescriptFormatter');
const clearConsole = require('react-dev-utils/clearConsole');
const WebpackDevServer = require('webpack-dev-server');
const { clone } = require('lodash');
const webpack = require('webpack');
const chalk = require('chalk');
const gulp = require('gulp');
const path = require('path');

const webpackConfig = require('../../webpack.config.js');
const { askQuestions } = require('./devModeQuestions');
const { createI18nFiles } = require('./i18n');
const commonJobs = require('./common');
const buildUtil = require('./util');
const paths = require('./paths');

const hotReload = !!process.env.HOT_RELOAD;

// will be populated with data using the askForDevOptions task
let devModeOptions;

gulp.task('prepareTestExecution', cb => {
  gulp.series(commonJobs.ensureTargetDirStructureExists, commonJobs.translateTheme, createI18nFiles)(cb);
});

gulp.task('dev', cb => {
  const { clean, ensureTargetDirStructureExists, copyFavicon, writeBuildInfo, translateTheme } = commonJobs;
  gulp.series(
    askForDevOptions,
    clean,
    ensureTargetDirStructureExists,
    gulp.parallel(
      createI18nFiles,
      copyFavicon,
      writeBuildInfo,
      translateTheme,
      copyDevIndexHtml,
      copyDevWaitingHtml,
      writeDevConfigFile,
      startDevProxy,
      openDevUrlInBrowser
    ),
    enableDevWatches,
    webpackDev
  )(cb);
});

function askForDevOptions(cb) {
  askQuestions(_devModeOptions => {
    devModeOptions = _devModeOptions;
    cb();
  });
}

function writeDevConfigFile(cb) {
  buildUtil.writeDevModeConfig(devModeOptions.target);
  cb();
}

function copyDevIndexHtml() {
  return gulp.src(paths.devIndexHtmlSrc).pipe(gulp.dest(paths.assetDir));
}

function copyDevWaitingHtml() {
  return gulp.src(paths.devWaitingHtmlSrc).pipe(gulp.dest(paths.assetDir));
}

function enableDevWatches(cb) {
  const { copyFavicon, copyAppleTouchIcon, translateTheme } = commonJobs;

  gulp.watch(path.join(paths.themeDir, 'theme.js'), translateTheme);
  gulp.watch(paths.devIndexHtmlSrc, copyDevIndexHtml);
  gulp.watch(paths.devWaitingHtmlSrc, copyDevWaitingHtml);
  gulp.watch(paths.faviconSrc, copyFavicon);
  gulp.watch(paths.appleTouchIconSrc, copyAppleTouchIcon);
  gulp.watch(paths.featureFlags, writeDevConfigFile);
  gulp.watch(paths.i18nInputFiles, createI18nFiles);
  cb();
}

function startDevProxy(cb) {
  const envConfig = devModeOptions.target;
  const uiBackendUrl = envConfig.uiBackendUrl;
  const butlerUrl = envConfig.butlerUrl;
  const integrationUrl = envConfig.integrationUrl;
  let websocketEndpoint = envConfig.websocketEndpoint || uiBackendUrl;

  const httpProxy = {
    '/': 'http://127.0.0.1:3000',
    '/waiting/': 'http://127.0.0.1:3000/waiting/',
    '/api/': `${uiBackendUrl}/api/`,
    '/auth/': butlerUrl + '/auth/',
    '/assets/': butlerUrl + '/assets/',
    '/secured/': butlerUrl + '/secured/',
    '/tenantSwitcher/': butlerUrl + '/tenantSwitcher/',
    '/notifications/': 'https://instana.github.io/ui-notifications/content/',
    '/registration/slack/': butlerUrl + '/registration/slack',
    '/csrf/token': `${uiBackendUrl}/api/csrf/token`,
    '/integration/': integrationUrl + '/integration/'
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
    websocketProxy,
    proxyReadTimeout: '90s'
  };

  buildUtil.startProxrox(config);
  cb();
}

function openDevUrlInBrowser(cb) {
  // set environment variable DONT_OPEN_BROWSER to some non-empty string to
  // avoid having Gulp opening a browser every time you start the build.
  if (!process.env.DONT_OPEN_BROWSER) {
    buildUtil.openBrowser(getDevUrl());
  }
  cb();
}

function getDevUrl() {
  return `https://local-instana.${devModeOptions.target.baseDomain}:4000`;
}

function webpackDev() {
  // modify some webpack config options
  const config = clone(webpackConfig);
  config.devtool = 'eval';

  // Start a webpack-dev-server
  new WebpackDevServer(createWebpackCompiler(config), {
    publicPath: '/bundle',
    contentBase: 'target/assets/',
    noInfo: true,
    quiet: true,
    lazy: false,
    inline: hotReload,
    hot: hotReload,
    liveReload: hotReload,
    disableHostCheck: hotReload,
    watchOptions: {
      ignored: /node_modules/,
      aggregateTimeout: 300,
      poll: 2000
    },
    stats: {
      colors: true
    }
  }).listen(3000, 'localhost', err => {
    if (err) {
      throw err;
    }
    console.log('[webpack:dev]', 'http://localhost:3000/');
    console.log();
    console.log(chalk.blue('Will now execute first compilation. This can take a few minutes.'));
    console.log(chalk.blue('The terminal output will change once completed.'));
  });

  // return a Promise so that Gulp knows that this task is going to
  // continue to run asynchronously
  return new Promise(() => {});
}

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

  let tsMessagesPromise;
  let tsMessagesResolver;
  compiler.hooks.beforeCompile.tap('beforeCompile', () => {
    tsMessagesPromise = new Promise(resolve => {
      tsMessagesResolver = msgs => resolve(msgs);
    });
  });

  forkTsCheckerWebpackPlugin.getCompilerHooks(compiler).receive.tap('afterTypeScriptCheck', (diagnostics, lints) => {
    const allMsgs = [...diagnostics, ...lints];
    const format = message => `${message.file}\n${typescriptFormatter(message, true)}`;
    tsMessagesResolver({
      errors: allMsgs.filter(msg => msg.severity === 'error').map(format),
      warnings: allMsgs.filter(msg => msg.severity === 'warning').map(format)
    });
  });

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
  compiler.hooks.done.tap('done', async stats => {
    if (process.stdout.isTTY) {
      clearConsole();
    }

    const statsData = stats.toJson({
      all: false,
      warnings: true,
      errors: true
    });

    if (statsData.errors.length === 0) {
      const delayedMsg = setTimeout(() => {
        renderSucessMessage();
      }, 100);

      const tsMessages = await tsMessagesPromise;
      clearTimeout(delayedMsg);
      statsData.errors.push(...tsMessages.errors);
      statsData.warnings.push(...tsMessages.warnings);
      stats.compilation.errors.push(...tsMessages.errors);
      stats.compilation.warnings.push(...tsMessages.warnings);
    }

    // We have switched off the default Webpack output in WebpackDevServer
    // options so we are going to "massage" the warnings and errors and present
    // them in a readable focused way.
    const messages = formatWebpackMessages(statsData);
    const warnings = (messages.warnings || []).filter(warning => {
      // We ensure via strict CSS coding guidelines that this is not a problem. Therefore do not log any errors.
      const isWarningAboutConflictingStyleOrder =
        warning.indexOf('mini-css-extract-plugin') !== -1 && warning.indexOf('Conflicting order between:') !== -1;
      return !isWarningAboutConflictingStyleOrder;
    });

    const isSuccessful = !messages.errors.length && !warnings.length;
    const showInstructions = isSuccessful && (process.stdout.isTTY || isFirstCompile);

    if (isSuccessful) {
      renderSucessMessage();
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
    if (warnings.length) {
      console.log(chalk.yellow('Compiled with warnings.'));
      console.log();
      warnings.forEach(message => {
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

function renderSucessMessage() {
  console.log(chalk.green('Compiled successfully!'));
  console.log();
  console.log(`Development URL: ${chalk.blue(getDevUrl())}`);

  if (devModeOptions.target.local) {
    console.log(`Base Domain:     ${chalk.yellow('[Local Backend]')}`);
  } else {
    console.log(`Tenant:          ${devModeOptions.target.tenant}`);
    console.log(`Unit:            ${devModeOptions.target.tenantUnit}`);
    console.log(`Base Domain:     ${devModeOptions.target.baseDomain}`);
  }

  console.log();
  console.log('Getting security warnings in your browser? Check out:');
  console.log(chalk.blue('https://instana.io/s/3esFtc5ZRBOtVlRJMBMS1A'));
}
