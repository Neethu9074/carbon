/* eslint-env node */
/* eslint-disable no-var, strict, vars-on-top, no-console */

'use strict';

const { clone } = require('lodash');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const fs = require('fs');
const path = require('path');
const gulp = require('gulp');
const size = require('gulp-size');
const webpack = require('webpack');
const runSequence = require('run-sequence');
const nano = require('gulp-cssnano');
const execSync = require('child_process').execSync;

const webpackConfig = require('../../webpack.config.js');
const buildUtil = require('./util');
const paths = require('./paths');

gulp.task('build', cb => {
  runSequence(
    'clean',
    'ensureTargetDirStructureExists',
    ['copyFavicon', 'writeBuildInfo', 'copyServerSources', 'translateTheme'],
    'webpack:build',
    'minifyCss',
    'printFileStatistics',
    cb
  );
});

gulp.task('try-build', cb => {
  runSequence(
    'copyServerSources',
    ['startTryBuildProxy', 'copyServerSources', 'openTryBuildUrlInBrowser', 'writeTryBuildServerConfigFile'],
    'startTryBuildServer',
    cb
  );
});

gulp.task('copyServerSources', () => {
  return gulp.src(paths.allServerSourcesSelector).pipe(gulp.dest(paths.targetDir));
});

gulp.task('minifyCss', () => {
  return gulp
    .src(paths.allCssAssets)
    .pipe(
      nano({
        zindex: false
      })
    )
    .pipe(gulp.dest(paths.bundleDir));
});

gulp.task('printFileStatistics', () => {
  return gulp.src([paths.allCssAssets, paths.allJsAssets]).pipe(
    size({
      showFiles: true,
      gzip: true
    })
  );
});

gulp.task('webpack:build', callback => {
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

    callback();
  });
});

gulp.task('writeTryBuildServerConfigFile', () => {
  var config = {
    baseUrl: 'https://local-instana.instana.io:4000',
    uiBackendBaseUrl: 'http://127.0.0.1:8080',
    groundskeeperBaseUrl: 'http://127.0.0.1:8280',
    port: 3131,
    adminPort: 3132,
    bindAddress: '0.0.0.0',
    cookie: {
      name: 'in-token-test'
    },
    googleAnalyticsTrackingId: '',
    eum: {
      apiKey: '',
      domain: ''
    },
    zendeskKey: 'cbc6d14e-73ae-48f2-8d8c-b9e27af1c64f',
    clientConfig: buildUtil.getDevModeConfig({
      uiBackendUrl: 'https://test-instana.instana.io',
      butlerUrl: 'https://test-instana.instana.io',
      tenant: 'instana',
      tenantUnit: 'test',
      environment: 'saas',
      butlerDomain: 'test-fullstack-0-us-west-2.instana.io'
    })
  };
  fs.writeFileSync(path.join(paths.targetDir, 'serverConfig.json'), JSON.stringify(config, 0, 2));
});

gulp.task('startTryBuildServer', () => {
  execSync('node "' + path.join(paths.targetDir, 'index.js') + '"', {
    stdio: 'inherit'
  });
});

gulp.task('startTryBuildProxy', () => {
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
      '/integrations/': 'https://test-instana.instana.io/integrations/'
    },
    websocketProxy: {
      '/api/data/': 'https://test-instana.instana.io'
    }
  });
});

gulp.task('openTryBuildUrlInBrowser', () => {
  buildUtil.openBrowser('https://local-instana.instana.io:4000');
});
