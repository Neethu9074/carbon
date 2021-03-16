/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

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
    selectTarget(devModeOptions, targetConfig, {});
    cb(devModeOptions);
    return;
  }

  inquirer.prompt(getQuestions(), answers => {
    if (answers.targetConfig.custom) {
      selectTarget(
        devModeOptions,
        {
          custom: answers.targetConfig.custom,
          tenant: answers.tenant,
          unit: answers.unit,
          baseDomain: answers.baseDomain
        },
        answers
      );
    } else {
      selectTarget(devModeOptions, answers.targetConfig, answers);
    }
    cb(devModeOptions);
  });
};

function getTargetSelectedViaEnvironmentVariables() {
  if (process.env.DEV_BASE_DOMAIN) {
    return {
      tenant: process.env.DEV_TENANT,
      unit: process.env.DEV_UNIT,
      baseDomain: process.env.DEV_BASE_DOMAIN
    };
  }

  if (/^test$/i.test(process.env.TARGET)) {
    return environments['K8s Test (pink)'];
  } else if (/^local$/i.test(process.env.TARGET)) {
    return {
      local: true
    };
  }

  return undefined;
}

function selectTarget(devModeOptions, targetConfig, answers) {
  if (targetConfig.local) {
    const host = answers.localTarget || 'localhost';
    devModeOptions.target.uiBackendUrl = `http://${host}:8080`;
    devModeOptions.target.websocketEndpoint = `http://${host}:8082/`;
    devModeOptions.target.butlerUrl = `http://${host}:8480`;
    devModeOptions.target.integrationUrl = `http://${host}:8182`;
    devModeOptions.target.local = true;
    devModeOptions.target.tenant = 'instana';
    devModeOptions.target.tenantUnit = 'local';
    devModeOptions.target.environment = 'local';
    devModeOptions.target.butlerDomain = 'local-instana.pink.instana.rocks:4000';
    devModeOptions.target.baseDomain = 'pink.instana.rocks';
  } else if (targetConfig.custom == 'selfhosted') {
    const localDomain = targetConfig.baseDomain;
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
      type: 'input',
      when: isLocalEnvironmentSelected,
      name: 'localTarget',
      message: 'Host where dev-env is runnig (default: localhost)',
      default: 'localhost'
    },
    {
      type: 'list',
      when: customSaasEnvironmentSelected,
      name: 'baseDomain',
      message: 'Base Domain?',
      choices: [
        {
          name: 'instana.io',
          value: 'instana.io'
        },
        {
          name: 'instana.rocks',
          value: 'instana.rocks'
        },
        {
          name: 'pink.instana.rocks',
          value: 'pink.instana.rocks'
        }
      ]
    },
    {
      type: 'input',
      when: customSelfHostedEnvironmentSelected,
      name: 'baseDomain',
      message: 'Hostname?'
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

function isLocalEnvironmentSelected(answers) {
  return answers.targetConfig.local === true;
}

function noReadyMadeEnvironmentSelected(answers) {
  return !!answers.targetConfig.custom;
}

function customSaasEnvironmentSelected(answers) {
  return answers.targetConfig.custom == 'saas';
}

function customSelfHostedEnvironmentSelected(answers) {
  return answers.targetConfig.custom == 'selfhosted';
}
