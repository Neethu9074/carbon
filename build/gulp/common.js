/* eslint-env node */
/* eslint-disable no-var, strict, vars-on-top */

'use strict';

var fs = require('fs');
var path = require('path');
var gulp = require('gulp');
var del = require('del');
var mkdirp = require('mkdirp');

const translateTheme = require('./translateTheme');
var buildUtil = require('./util');
var paths = require('./paths');


gulp.task('clean', () => {
  return del(paths.targetDir);
});


gulp.task('ensureTargetDirStructureExists', () => {
  mkdirp.sync(paths.targetDir);
  mkdirp.sync(paths.assetDir);
  mkdirp.sync(paths.bundleDir);
});


gulp.task('copyFavicon', () => {
  return gulp.src(paths.faviconSrc).pipe(gulp.dest(paths.assetDir));
});


gulp.task('writeBuildInfo', cb => {
  var data = {
    revision: buildUtil.getRevision(),
    date: new Date().toISOString()
  };

  if (process.env.INSTANA_UICLIENT_BRANCH) {
    data.branch = process.env.INSTANA_UICLIENT_BRANCH;
  }

  if (process.env.COM_INSTANA_IMAGE_TAG) {
    data.tag = process.env.COM_INSTANA_IMAGE_TAG;
  }

  fs.writeFile(paths.buildInfoFileLocation, JSON.stringify(data), cb);
});


gulp.task('translateThemeConfigs', () => {
  translateTheme('day', path.join(paths.rootDir, 'in-themes'), paths.assetDir);
  translateTheme('night', path.join(paths.rootDir, 'in-themes'), paths.assetDir);
});
