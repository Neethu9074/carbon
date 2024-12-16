/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

/* eslint-env node */
/* eslint-disable no-var, strict, vars-on-top */

'use strict';

var fs = require('fs');
var gulp = require('gulp');
var del = require('del');
var { mkdirp } = require('mkdirp');

var buildUtil = require('./util');
var paths = require('./paths');

exports.clean = clean;
exports.ensureTargetDirStructureExists = ensureTargetDirStructureExists;
exports.copyFavicon = copyFavicon;
exports.copyAppleTouchIcon = copyAppleTouchIcon;
exports.writeBuildInfo = writeBuildInfo;

async function clean() {
  return await del(paths.targetDir);
}

function ensureTargetDirStructureExists(cb) {
  mkdirp.sync(paths.targetDir);
  mkdirp.sync(paths.assetDir);
  mkdirp.sync(paths.bundleDir);
  cb();
}

function copyFavicon() {
  return gulp.src(paths.faviconSrc).pipe(gulp.dest(paths.assetDir));
}

function copyAppleTouchIcon() {
  return gulp.src(paths.appleTouchIconSrc).pipe(gulp.dest(paths.assetDir));
}

function writeBuildInfo(cb) {
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
}
