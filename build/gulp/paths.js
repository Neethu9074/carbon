/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

/* eslint-env node */
/* eslint-disable no-var, strict, vars-on-top */

'use strict';

var path = require('path');

var paths = (module.exports = {});

paths.rootDir = path.join(__dirname, '..', '..');
paths.targetDir = path.join(paths.rootDir, 'target');
paths.assetDir = path.join(paths.targetDir, 'assets');
paths.bundleDir = path.join(paths.assetDir, 'bundle');
paths.i18nDir = path.join(paths.assetDir, 'i18n');
paths.binDir = path.join(paths.rootDir, 'node_modules', '.bin');
paths.devDir = path.join(paths.rootDir, 'dev');

// ## Source Files:
paths.packageDir = path.join(paths.rootDir, 'packages');
paths.themeDir = path.join(paths.packageDir, 'in-themes');
paths.devIndexHtmlSrc = path.join(paths.packageDir, 'in-client', 'index.html');
paths.devWaitingHtmlSrc = path.join(paths.packageDir, 'in-client', 'waiting.html');
paths.faviconSrc = path.join(paths.packageDir, 'in-client', 'favicon-*');
paths.appleTouchIconSrc = path.join(paths.packageDir, 'in-client', 'apple-*');

paths.allServerSourcesSelector = path.join(paths.packageDir, 'in-server', '**', '*');
paths.allServerSourcesIgnoreRules = [
  path.join('**', '__mocks__', '**', '*'),
  path.join('**', 'test', '**', '*'),
  path.join('**', 'coverage', '**', '*'),
  path.join('**', 'README.md'),
  path.join('**', 'generate-error-page-content', '**', '*')
];
paths.featureFlags = path.join(paths.devDir, 'featureFlags.js');
paths.i18nInputFiles = path.join(paths.packageDir, '*', 'i18n', '*');

// ## Target Files:
paths.devIndexHtmlTarget = path.join(paths.assetDir, 'index.html');
paths.buildInfoFileLocation = path.join(paths.assetDir, 'build.json');
paths.javascriptEntryPointFile = path.join(paths.bundleDir, 'index.js');
paths.allJsAssets = path.join(paths.bundleDir, '*.js');
paths.allCssAssets = path.join(paths.bundleDir, '*.css');
