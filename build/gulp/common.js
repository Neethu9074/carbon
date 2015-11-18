/*eslint-env node*/
/*eslint-disable no-var, strict, vars-on-top */

'use strict';

var fs = require('fs');
var path = require('path');
var gulp = require('gulp');
var del = require('del');
var mkdirp = require('mkdirp');
var execSync = require('child_process').execSync;

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
  return gulp.src(paths.faviconSrc).pipe(gulp.dest(paths.assetDir));
});


gulp.task('writeBuildInfo', function(cb) {
  var data = {
    revision: buildUtil.getRevision(),
    date: new Date().toISOString()
  };

  fs.writeFile(paths.buildInfoFileLocation, JSON.stringify(data), cb);
});


gulp.task('translateThemeConfigs', function() {
  buildTheme('day', path.join(paths.rootDir, 'in-themes'), paths.assetDir);
  buildTheme('night', path.join(paths.rootDir, 'in-themes'), paths.assetDir);
});


function buildTheme(themeName, sourceDir, targetDir) {
  var script = path.join(
    paths.rootDir,
    'node_modules',
    'instana-ui-theme',
    'build',
    'translateTheme.js'
  );

  execSync(
    'node "' + script + '" "' + themeName + '" "' + sourceDir + '" "' + targetDir + '"',
    {
      stdio: 'inherit'
    }
  );
}
