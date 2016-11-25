/* eslint-env node */
/* eslint-disable no-var, strict, vars-on-top */

'use strict';

var path = require('path');

var paths = module.exports = {};

paths.rootDir = path.join(__dirname, '..', '..');
paths.targetDir = path.join(paths.rootDir, 'target');
paths.assetDir = path.join(paths.targetDir, 'assets');
paths.bundleDir = path.join(paths.assetDir, 'bundle');
paths.binDir = path.join(paths.rootDir, 'node_modules', '.bin');

// ## Source Files:
paths.devIndexHtmlSrc = path.join(paths.rootDir, 'in-client', 'index.html');
paths.faviconSrc = path.join(paths.rootDir, 'in-client', 'favicon.png');
paths.allServerSourcesSelector = path.join(paths.rootDir, 'in-server', '**/*');

// ## Target Files:
paths.devIndexHtmlTarget = path.join(paths.assetDir, 'index.html');
paths.activeThemeJsonFile = path.join(paths.rootDir, 'in-themes', 'active.json');
paths.activeThemeLessFile = path.join(paths.rootDir, 'in-themes', 'active.less');
paths.buildInfoFileLocation = path.join(paths.assetDir, 'build.json');
paths.javascriptEntryPointFile = path.join(paths.bundleDir, 'index.js');
paths.allJsAssets = path.join(paths.bundleDir, '*.js');
paths.allCssAssets = path.join(paths.bundleDir, '*.css');
