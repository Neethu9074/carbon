#!/usr/bin/env node

/*eslint-env node*/
/*eslint-disable no-var*/

var path = require('path');
var os = require('os');
var fs = require('fs');
var inquirer = require('inquirer');
var childProcess = require('child_process');

var execSync = childProcess.execSync;
var spawn = childProcess.spawn;

var environments = {
  monitoring: {
    user: 'stan@instana.com',
    pw: '4711',
    uiBackendUrl: 'https://monitoring-instana.instana.io/api',
    groundskeeperUrl: 'https://monitoring-instana.instana.io/auth'
  },
  demo: {
    user: 'stan@instana.com',
    pw: '4711',
    uiBackendUrl: 'https://demo.instana.io/api',
    groundskeeperUrl: 'https://demo.instana.io/auth'
  },
  test: {
    user: 'stan@instana.com',
    pw: '4711',
    uiBackendUrl: 'https://test-instana.instana.io/api',
    groundskeeperUrl: 'https://test-instana.instana.io/auth'
  },
  johan: {
    user: 'fromutome@yahoo.com',
    pw: '34johan12',
    uiBackendUrl: 'https://johan.instana.io/api',
    groundskeeperUrl: 'https://johan.instana.io/auth'
  },
  betquest: {
    user: 'markus.bonsch@codecentric.de',
    pw: 'Horst67',
    uiBackendUrl: 'https://betquest.instana.io/api',
    groundskeeperUrl: 'https://betquest.instana.io/auth'
  },
  codecentric: {
    user: 'tobias.knierim@codecentric.de',
    pw: 'crackme42',
    uiBackendUrl: 'https://codecentric.instana.io/api',
    groundskeeperUrl: 'https://codecentric.instana.io/auth'
  },
  centerdevice: {
    user: 'daniel.schneller@centerdevice.de',
    pw: '543centerdevice345',
    uiBackendUrl: 'https://centerdevice.instana.io/api',
    groundskeeperUrl: 'https://centerdevice.instana.io/auth'
  },
  local: {
    user: 'stan@instana.com',
    pw: '4711',
    uiBackendUrl: 'http://localhost:8080',
    groundskeeperUrl: 'http://workstation:8280'
  },
  staging: {
    user: '<none>',
    pw: '<none>',
    uiBackendUrl: 'https://staging-instana.instana.io/api',
    groundskeeperUrl: 'https://staging-instana.instana.io/auth'
  },
  simulator: {
    user: '<none>',
    pw: '<none>',
    uiBackendUrl: 'http://localhost:5000',
    groundskeeperUrl: 'https://localhost:5000'
  }
};

main();

function main() {
  console.log('Instana dev run script');

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
    }
  ];

  inquirer.prompt(questions, runForEnvironment);
}

function runForEnvironment(runConfig) {
  var env = runConfig.environment;
  var buildMode = runConfig.buildMode;
  var envConfig = environments[env];
  var proxroxConfigLocation = writeProxroxConfigForEnvironment(env, envConfig);

  execSync('./node_modules/.bin/proxrox stop', {
    stdio: 'inherit'
  });
  execSync('./node_modules/.bin/proxrox start ' + proxroxConfigLocation, {
    stdio: 'inherit'
  });
  execSync('open https://local-instana.instana.io:4000');

  var processEnvironment = process.env;
  processEnvironment.BUILD_DEV = buildMode === 'development';
  processEnvironment.BUILD_INTERNAL = buildMode === 'development';

  spawn('./node_modules/.bin/gulp', ['dev'], {
    env: processEnvironment,
    stdio: 'inherit'
  }, function() {
    console.log('Dev mode finished');
  });
}

function writeProxroxConfigForEnvironment(env, envConfig) {
  var tmpFile = path.join(os.tmpdir(), '.proxrox.json');
  var proxroxConfig = buildProxroxConfig(envConfig);
  fs.writeFileSync(
    tmpFile,
    JSON.stringify(proxroxConfig, 0, 2)
  );
  return tmpFile;
}

function buildProxroxConfig(envConfig) {
  var uiBackendUrl = envConfig.uiBackendUrl;
  var groundskeeperUrl = envConfig.groundskeeperUrl;
  var instagrafanaUrl = 'https://monitoring-instana.instana.io/api/internal';

  return {
    serverName: 'local-instana.instana.io',
    port: 4000,
    root: false,
    ssi: true,
    tls: true,
    proxy: {
      '/': 'http://127.0.0.1:3000',
      '/auth/signIn': groundskeeperUrl + '/signIn',
      '/auth/signOut': groundskeeperUrl + '/signOut',
      '/auth/users/current': groundskeeperUrl + '/users/current',
      '/internal/api': instagrafanaUrl + 'api',
      '/uiTracker/': 'http://127.0.0.1:8484/'
    },

    websocketProxy: {
      '/api/data': uiBackendUrl + '/data'
    }
  };
}
