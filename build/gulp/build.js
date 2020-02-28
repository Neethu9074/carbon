/* eslint-env node */
/* eslint-disable no-var, strict, vars-on-top, no-console */
'use strict';

const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const execSync = require('child_process').execSync;
const nano = require('gulp-cssnano');
const { clone } = require('lodash');
const webpack = require('webpack');
const size = require('gulp-size');
const gulp = require('gulp');
const path = require('path');
const fs = require('fs');

const webpackConfig = require('../../webpack.config.js');
const commonJobs = require('./common');
const buildUtil = require('./util');
const paths = require('./paths');

gulp.task('build', cb => {
  const {
    clean,
    ensureTargetDirStructureExists,
    copyFavicon,
    copyAppleTouchIcon,
    writeBuildInfo,
    translateTheme
  } = commonJobs;

  gulp.series(
    clean,
    ensureTargetDirStructureExists,
    gulp.parallel(copyFavicon, copyAppleTouchIcon, writeBuildInfo, copyServerSources, translateTheme),
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

function copyServerSources() {
  return gulp.src(paths.allServerSourcesSelector).pipe(gulp.dest(paths.targetDir));
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
    new UglifyJsPlugin({
      sourceMap: true,
      uglifyOptions: {
        output: {
          comments: /\/DONOTKEEPANYCOMMENTS/
        }
      }
    })
  ];

  config.plugins = config.plugins.concat(
    new webpack.DefinePlugin({
      'process.env': {
        // This has effect on the react lib size
        NODE_ENV: JSON.stringify('production')
      }
    }),
    new webpack.BannerPlugin(buildUtil.getBanner())
  );

  webpack(config, (err, stats) => {
    if (err) {
      throw err;
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
    baseUrl: 'https://local-instana.instana.io:4000',
    uiBackendBaseUrl: 'http://127.0.0.1:8080',
    groundskeeperBaseUrl: 'http://127.0.0.1:8280',
    butlerBaseUrl: 'http://127.0.0.1:8480',
    port: 3131,
    adminPort: 3132,
    bindAddress: '0.0.0.0',
    cookie: {
      name: 'in-token-test'
    },
    mixpanelToken: '3f2a70afd2509a7a526380e354dce94b',
    eum: {
      apiKey: 'S8sh0aF6Q9yH1Z6gMNWpFw',
      domain: '//eum-test-fullstack-0-us-west-2.instana.io'
    },
    zendeskKey: 'cbc6d14e-73ae-48f2-8d8c-b9e27af1c64f',
    clientConfig: buildUtil.getDevModeConfig({
      uiBackendUrl: 'https://test-instana.instana.io',
      butlerUrl: 'https://test-instana.instana.io',
      tenant: 'instana',
      tenantUnit: 'test',
      region: 'us-west-2',
      environment: 'saas',
      butlerDomain: 'test-fullstack-0-us-west-2.instana.io'
    })
  };
  fs.writeFileSync(path.join(paths.targetDir, 'serverConfig.json'), JSON.stringify(config, 0, 2));
  cb();
}

function startTryBuildServer(cb) {
  execSync('node "' + path.join(paths.targetDir, 'index.js') + '"', {
    stdio: 'inherit'
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
      '/api/': 'https://test-instana.instana.io/api/',
      '/auth/': 'https://test-instana.instana.io/auth/',
      '/ump': 'https://test-instana.instana.io/ump',
      '/assets/': 'https://test-instana.instana.io/assets/',
      '/notifications/': 'https://instana.github.io/ui-notifications/content/',
      '/integrations/': 'https://test-instana.instana.io/integrations/',
      '/tos-privacy-agreement/storeUserAcceptance': 'http://127.0.0.1:8480/tos-privacy-agreement/storeUserAcceptance'
    },
    websocketProxy: {
      '/api/data/': 'https://test-instana.instana.io'
    }
  });
  cb();
}

function openTryBuildUrlInBrowser(cb) {
  buildUtil.openBrowser('https://local-instana.instana.io:4000');
  cb();
}
