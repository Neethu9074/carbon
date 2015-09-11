/*eslint-env node*/
/*eslint-disable no-var, strict, vars-on-top */

'use strict';

var fs = require('fs');
var path = require('path');
var gulp = require('gulp');
var del = require('del');
var mkdirp = require('mkdirp');
var buildTheme = require('instana-ui-theme/build/translateTheme');

var buildUtil = require('./util');

var paths = require('./paths');


gulp.task('clean', function() {
  return del(paths.targetDir);
});


gulp.task('ensureTargetDirStructureExists', function() {
  mkdirp.sync(paths.targetDir);
  mkdirp.sync(paths.assetDir);
  mkdirp.sync(paths.bundleDir);
});


gulp.task('copyFavicon', function() {
  gulp.src(paths.faviconSrc).pipe(gulp.dest(paths.assetDir));
});


gulp.task('writeBuildInfo', function(cb) {
  var data = {
    revision: buildUtil.getRevision(),
    version: buildUtil.getVersion(),
    date: new Date().toISOString(),
    containerTag: process.env.INSTANA_CONTAINER_TAG || 'unknown'
  };

  fs.writeFile(paths.buildInfoFileLocation, JSON.stringify(data), cb);
});


gulp.task('translateThemeConfigs', function() {
  buildTheme('day', path.join(paths.rootDir, 'in-themes'), paths.assetDir);
  buildTheme('night', path.join(paths.rootDir, 'in-themes'), paths.assetDir);
});


gulp.task('copyServerSources', function() {
  gulp.src(paths.allServerSourcesSelector).pipe(gulp.dest('target/'));
});
