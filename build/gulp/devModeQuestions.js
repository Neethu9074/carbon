/* eslint-env node */
/* eslint-disable strict */

'use strict';

const inquirer = require('inquirer');

const environments = require('./environments');

exports.askQuestions = cb => {
  const buildMode = /^prod$/i.test(process.env.BUILD_MODE) ? 'production' : 'development';
  const devModeOptions = {
    target: {
      uiBackendUrl: null,
      websocketEndpoint: null,
      butlerUrl: null,
      integrationUrl: null,
      tenant: null,
      tenantUnit: null,
      butlerDomain: null,
      baseDomain: null,
      buildMode
    },
    buildMode
  };

  const targetConfig = getTargetSelectedViaEnvironmentVariables();
  if (targetConfig && !targetConfig.custom) {
    selectTarget(devModeOptions, targetConfig);
    cb(devModeOptions);
    return;
  }

  inquirer.prompt(getQuestions(), answers => {
    if (answers.targetConfig.custom) {
      selectTarget(devModeOptions, {
        tenant: answers.tenant,
        unit: answers.unit,
        baseDomain: answers.baseDomain
      });
    } else {
      selectTarget(devModeOptions, answers.targetConfig);
    }
    cb(devModeOptions);
  });
};

function getTargetSelectedViaEnvironmentVariables() {
  if (/^test$/i.test(process.env.TARGET)) {
    return environments['Test'];
  } else if (/^local$/i.test(process.env.TARGET)) {
    return environments['Locally Running Backend'];
  }

  return undefined;
}

function selectTarget(devModeOptions, targetConfig) {
  if (targetConfig.local) {
    devModeOptions.target.uiBackendUrl = 'http://localhost:8080';
    devModeOptions.target.websocketEndpoint = 'http://localhost:8082/';
    devModeOptions.target.butlerUrl = 'http://localhost:8480';
    devModeOptions.target.integrationUrl = 'http://localhost:8182';
    devModeOptions.target.local = true;
    devModeOptions.target.tenant = 'instana';
    devModeOptions.target.tenantUnit = 'local';
    devModeOptions.target.environment = 'local';
    devModeOptions.target.butlerDomain = 'local-instana.instana.io:4000';
    devModeOptions.target.baseDomain = 'instana.io';
  } else {
    const localDomain = `${targetConfig.unit}-${targetConfig.tenant}.${targetConfig.baseDomain}`;
    const localUrl = `https://${localDomain}`;
    devModeOptions.target.uiBackendUrl = localUrl;
    devModeOptions.target.websocketEndpoint = localUrl;
    devModeOptions.target.butlerUrl = localUrl;
    devModeOptions.target.integrationUrl = localUrl;
    devModeOptions.target.local = false;
    devModeOptions.target.tenant = targetConfig.tenant;
    devModeOptions.target.tenantUnit = targetConfig.unit;
    devModeOptions.target.environment = 'saas';
    devModeOptions.target.butlerDomain = localDomain;
    devModeOptions.target.baseDomain = targetConfig.baseDomain;
  }
}

function getQuestions() {
  return [
    {
      type: 'list',
      name: 'targetConfig',
      message: 'Environment?',
      choices: Object.keys(environments).map(name => ({
        name,
        value: environments[name]
      }))
    },
    {
      type: 'list',
      when: noReadyMadeEnvironmentSelected,
      name: 'baseDomain',
      message: 'Base Domain?',
      choices: [
        {
          name: 'instana.io',
          value: 'instana.io'
        },
        {
          name: 'pink.instana.rocks',
          value: 'pink.instana.rocks'
        },
        {
          name: 'peach.instana.rocks',
          value: 'peach.instana.rocks'
        },
        {
          name: 'magenta.instana.rocks',
          value: 'magenta.instana.rocks'
        },
        {
          name: 'rose.instana.rocks',
          value: 'rose.instana.rocks'
        },
        {
          name: 'melon.instana.rocks',
          value: 'melon.instana.rocks'
        }
      ]
    },
    {
      type: 'input',
      when: noReadyMadeEnvironmentSelected,
      name: 'tenant',
      message: 'Tenant?'
    },
    {
      type: 'input',
      when: noReadyMadeEnvironmentSelected,
      name: 'unit',
      message: 'Unit?'
    }
  ];
}

function noReadyMadeEnvironmentSelected(answers) {
  return answers.targetConfig.custom === true;
}
