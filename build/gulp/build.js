/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

/* eslint-env node */
/* eslint-disable no-var, strict, vars-on-top, no-console */
'use strict';

const TerserPlugin = require('terser-webpack-plugin');
const execSync = require('child_process').execSync;
const nano = require('gulp-cssnano');
const { clone } = require('lodash');
const webpack = require('webpack');
const size = require('gulp-size');
const gulp = require('gulp');
const path = require('path');
const fs = require('fs');

const webpackConfig = require('../../webpack.config.js');
const { createI18nFiles } = require('./i18n');
const commonJobs = require('./common');
const buildUtil = require('./util');
const paths = require('./paths');

gulp.task('build', cb => {
  const { clean, ensureTargetDirStructureExists, copyFavicon, copyAppleTouchIcon, writeBuildInfo } = commonJobs;

  gulp.series(
    clean,
    ensureTargetDirStructureExists,
    gulp.parallel(createI18nFiles, copyFavicon, copyAppleTouchIcon, writeBuildInfo, copyServerSources),
    webpackBuild,
    minifyCss,
    printFileStatistics
  )(cb);
});

gulp.task('try-build', cb => {
  gulp.series(
    copyServerSources,
    gulp.parallel(startTryBuildProxy, copyServerSources, openTryBuildUrlInBrowser, writeTryBuildServerConfigFile),
    startTryBuildServer
  )(cb);
});

gulp.task('try-build-release', cb => {
  gulp.series(
    copyServerSources,
    gulp.parallel(
      startTryBuildReleaseProxy,
      copyServerSources,
      openTryBuildReleaseUrlInBrowser,
      writeTryBuildReleaseServerConfigFile
    ),
    startTryBuildServer
  )(cb);
});

function copyServerSources() {
  return gulp
    .src(paths.allServerSourcesSelector, {
      ignore: paths.allServerSourcesIgnoreRules
    })
    .pipe(gulp.dest(paths.targetDir));
}

function minifyCss() {
  return gulp
    .src(paths.allCssAssets)
    .pipe(
      nano({
        reduceIdents: false,
        zindex: false
      })
    )
    .pipe(gulp.dest(paths.bundleDir));
}

function printFileStatistics() {
  return gulp.src([paths.allCssAssets, paths.allJsAssets]).pipe(
    size({
      showFiles: true,
      gzip: true
    })
  );
}

function webpackBuild(cb) {
  // modify some webpack config options
  var config = clone(webpackConfig);

  config.mode = 'production';

  // Report the first error as a hard error instead of tolerating it.
  config.bail = true;

  // Display scope hoisting fallback triggers (since webpack 3.0.0)
  config.stats = clone(config.stats || {});
  config.stats.optimizationBailout = true;

  config.optimization = clone(config.optimization || {});
  config.optimization.concatenateModules = true;
  config.optimization.minimizer = [
    new TerserPlugin({
      terserOptions: {
        output: {
          preamble: `/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. ${new Date().getFullYear()}
 */`,
          comments: false
        }
      },
      extractComments: false
    })
  ];

  webpack(config, (err, stats) => {
    if (err) {
      throw err;
    }
    if (stats.hasErrors()) {
      throw new Error(
        stats.toString({
          colors: true
        })
      );
    }

    console.log(
      '[webpack:build]',
      stats.toString({
        colors: true
      })
    );

    cb();
  });
}

function writeTryBuildServerConfigFile(cb) {
  var config = {
    urlFormat: '$unit-$tenant.$baseDomain',
    baseUrl: 'https://local-instana.pink.instana.rocks:4000',
    uiBackendBaseUrl: 'https://test-instana.pink.instana.rocks',
    groundskeeperBaseUrl: 'http://127.0.0.1:8280',
    butlerBaseUrl: 'https://test-instana.pink.instana.rocks',
    integrationBaseUrl: 'https://globalbackend.rainbowtest.instana.rocks',
    port: 3131,
    adminPort: 3132,
    bindAddress: '0.0.0.0',
    cookie: {
      name: 'in-token-test'
    },
    segmentKey: 'K8GUn26weHMSk0fXYVNyiKtDPHmzr9Fj',
    amplitudeKey: 'client-R2KC1Tw3m8BAnSOiVOSwMWosWdGyGDmN',
    eum: {
      apiKey: 'hUD6LIQpRaeFDkvAf5X4Yg',
      domain: 'pink.instana.rocks/eum/',
      retrievalDomain: 'pink.instana.rocks/eum'
    },
    clientConfig: buildUtil.getDevModeConfig({
      uiBackendUrl: 'https://test-instana.pink.instana.rocks',
      butlerUrl: 'https://test-instana.pink.instana.rocks',
      tenant: 'instana',
      tenantUnit: 'test',
      tenantUnitId: 'fake_tenantUnitId',
      region: 'us-west-2',
      environment: 'saas',
      butlerDomain: 'test-fullstack-0-us-west-2.instana.io'
    })
  };
  fs.writeFileSync(path.join(paths.targetDir, 'serverConfig.json'), JSON.stringify(config, 0, 2));
  cb();
}

function startTryBuildServer(cb) {
  execSync(`bash -c 'node index.js | node_modules/pino-pretty/bin.js -c --ignore __in,v,module,hostname,pid'`, {
    stdio: 'inherit',
    cwd: paths.targetDir
  });
  cb();
}

function startTryBuildProxy(cb) {
  buildUtil.startProxrox({
    serverName: 'local-instana.instana.io',
    port: 4000,
    root: false,
    ssi: true,
    tls: true,
    tlsCertificateFile: path.join(__dirname, '..', 'cert', 'server.crt'),
    tlsCertificateKeyFile: path.join(__dirname, '..', 'cert', 'server.key'),
    proxy: {
      '/': 'http://127.0.0.1:3131',
      '/api/': 'https://test-instana.pink.instana.rocks/api/',
      '/auth/': 'https://test-instana.pink.instana.rocks/auth/',
      '/assets/': 'https://test-instana.pink.instana.rocks/assets/',
      '/notifications/': 'https://instana.github.io/ui-notifications/content/',
      '/integrations/': 'https://test-instana.pink.instana.rocks/integrations/',
      '/tos-privacy-agreement/storeUserAcceptance':
        'https://test-instana.pink.instana.rocks/tos-privacy-agreement/storeUserAcceptance'
    },
    websocketProxy: {
      '/api/data/': 'https://test-instana.pink.instana.rocks'
    }
  });
  cb();
}

function openTryBuildUrlInBrowser(cb) {
  buildUtil.openBrowser('https://local-instana.pink.instana.rocks:4000');
  cb();
}

function writeTryBuildReleaseServerConfigFile(cb) {
  var config = {
    urlFormat: '$unit-$tenant.$baseDomain',
    baseUrl: 'https:/release-instana.release-instana.instana.rocks:4000',
    uiBackendBaseUrl: 'https://release-instana.instana.rocks',
    groundskeeperBaseUrl: 'http://127.0.0.1:8280',
    butlerBaseUrl: 'https://release-instana.instana.rocks',
    integrationBaseUrl: 'https://globalbackend.rainbowtest.instana.rocks',
    port: 3131,
    adminPort: 3132,
    bindAddress: '0.0.0.0',
    cookie: {
      name: 'in-token-stable'
    },
    segmentKey: 'K8GUn26weHMSk0fXYVNyiKtDPHmzr9Fj',
    eum: {
      apiKey: 'hUD6LIQpRaeFDkvAf5X4Yg',
      domain: 'magenta.instana.rocks/eum/',
      retrievalDomain: 'magenta.instana.rocks/eum'
    },
    clientConfig: buildUtil.getDevModeReleaseConfig({
      uiBackendUrl: 'https://release-instana.instana.rocks',
      butlerUrl: 'https://release-instana.instana.rocks',
      tenant: 'instana',
      tenantUnit: 'release',
      tenantUnitId: 'fake_tenantUnitId',
      region: 'magenta',
      environment: 'saas',
      butlerDomain: 'test-fullstack-0-us-west-2.instana.io'
    })
  };
  fs.writeFileSync(path.join(paths.targetDir, 'serverConfig.json'), JSON.stringify(config, 0, 2));
  cb();
}

function startTryBuildReleaseProxy(cb) {
  buildUtil.startProxrox({
    serverName: 'local-instana.instana.io',
    port: 4000,
    root: false,
    ssi: true,
    tls: true,
    tlsCertificateFile: path.join(__dirname, '..', 'cert', 'server.crt'),
    tlsCertificateKeyFile: path.join(__dirname, '..', 'cert', 'server.key'),
    proxy: {
      '/': 'http://127.0.0.1:3131',
      '/api/': 'https://release-instana.instana.rocks/api/',
      '/auth/': 'https://release-instana.instana.rocks/auth/',
      '/assets/': 'https://release-instana.instana.rocks/assets/',
      '/notifications/': 'https://instana.github.io/ui-notifications/content/',
      '/integrations/': 'https://release-instana.instana.rocks/integrations/',
      '/tos-privacy-agreement/storeUserAcceptance':
        'https://release-instana.instana.rocks/tos-privacy-agreement/storeUserAcceptance'
    },
    websocketProxy: {
      '/api/data/': 'https://release-instana.instana.rocks'
    }
  });
  cb();
}

function openTryBuildReleaseUrlInBrowser(cb) {
  buildUtil.openBrowser('https://release-instana.release-instana.instana.rocks:4000');
  cb();
}
