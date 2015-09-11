/*eslint-env node*/
/*eslint-disable no-var, strict, vars-on-top */

'use strict';

var fs = require('fs');
var gulp = require('gulp');
var path = require('path');
var runSequence = require('run-sequence');
var inquirer = require('inquirer');

var paths = require('./paths');
var buildUtil = require('./util');
var environments = require('./environments');

// will be populated with data using the askForDevOptions task
var devModeOptions;

gulp.task('dev', function(cb) {
  runSequence(
    'askForDevOptions',
    'clean',
    'ensureTargetDirStructureExists',
    [
      'copyFavicon',
      'writeBuildInfo',
      'copyServerSources',
      'translateThemeConfigs',
      'setActiveThemeForDevMode'
    ],
    'writeDevConfigFile',
    cb
  );
});


gulp.task('askForDevOptions', function(cb) {
  var questions = [
    {
      type: 'list',
      name: 'environment',
      message: 'Which environment would you like to run against?',
      choices: Object.keys(environments).map(function(env) {
        var config = environments[env];
        return env + ' (' + config.user + ' / ' + config.pw + ')';
      }),
      filter: function(env) {
        // extract environment name
        return env.match(/(\w+)/)[1];
      }
    },
    {
      type: 'list',
      name: 'buildMode',
      message: 'In which mode would you like to compile the source code?',
      choices: [
        'development',
        'production'
      ],
      default: 'development'
    },
    {
      type: 'list',
      name: 'uiMode',
      message: 'Mode of the UI?',
      choices: [
        'saas',
        'demo'
      ],
      default: 'saas'
    },
    {
      type: 'list',
      name: 'activeTheme',
      message: 'Enabled theme',
      choices: [
        'night',
        'day'
      ],
      default: 'night'
    }
  ];

  inquirer.prompt(questions, function(selectedOptions) {
    devModeOptions = selectedOptions;
    cb();
  });
});


gulp.task('writeDevConfigFile', function() {
  var environment = devModeOptions.uiMode === 'saas' ? 'production' : 'demo';
  var devConfig = {
    environment: environment,
    keys: {
      xing: 'ecf760e609c548a8293d',
      linkedin: '77k38emu8xnsrk',
      google: '904562349505-fs9mmg5crd9kdk2v0fbmv6oc79jj3djv.apps.googleusercontent.com'
    }
  };
  fs.writeFileSync(
    path.join(paths.assetDir, 'config.json'),
    JSON.stringify(devConfig)
  );
});


gulp.task('setActiveThemeForDevMode', function() {
  buildUtil.setActiveTheme(devModeOptions.activeTheme);
});
