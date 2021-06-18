/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

/* eslint-env mocha,node */
/* eslint-disable no-var, vars-on-top, strict */

'use strict';

/**
 * Enzyme hasn't released an adapter to support react-17
 * Until the officila one is released we can use this package which is developed from adapter of react 16
 * Reference: https://github.com/enzymejs/enzyme/issues/2429
 */
const Adapter = require('@wojtekmaj/enzyme-adapter-react-17');
const Enzyme = require('enzyme');
const chai = require('chai');
// eslint-disable-next-line no-restricted-imports
const i18n = require('i18next');

chai.use(require('chai-string'));
chai.use(require('chai-subset'));
chai.use(require('sinon-chai'));

global.__DEV__ = false;
global.__HOT_RELOAD__ = false;
global.window.instana = {
  config: {
    environment: 'saas',
    tenant: 'instana',
    tenantUnit: 'test'
  }
};

global.window.instana.user = {
  tenants: [
    {
      role: {
        id: '-1',
        name: 'Owner',
        canConfigureServiceMapping: true,
        canConfigureEumApplications: true,
        canConfigureMobileAppMonitoring: true,
        canConfigureUsers: true,
        canInstallNewAgents: true,
        canSeeUsageInformation: true,
        canConfigureIntegrations: true,
        canSeeOnPremLicenseInformation: true,
        canConfigureTeams: true,
        canConfigureCustomAlerts: true,
        canConfigureApiTokens: true,
        canConfigureAgentRunMode: true,
        canViewAuditLog: true,
        canConfigureObjectives: true,
        canConfigureAgents: true,
        canConfigureAuthenticationMethods: true,
        canConfigureLogManagement: true,
        canViewAccountAndBillingInformation: true
      },
      tenantKey: 'instana',
      name: 'instana',
      id: '57309f589e1d8461616a545'
    }
  ],
  fullName: 'Stan stan',
  id: '59085f81fa065b001a0f6a8b',
  preferredName: 'Stan stan',
  email: 'stan@instana.com'
};

global.requestAnimationFrame = fn => setTimeout(fn, 0);
global.window.requestAnimationFrame = global.requestAnimationFrame;

// many tests import a whole bunch of modules and at some point this always
// ends up in in-connection (which requirs WebSocket globals).
global.window.WebSocket = function() {
  this.send = function() {};
  this.close = function() {};
};

// react unit tests with enzyme
Enzyme.configure({ adapter: new Adapter() });

i18n.init({
  lng: 'en-US',
  resources: {
    'en-US': require('../../target/assets/i18n/en-US.json')
  },

  defaultNS: 'common',

  react: {
    // Do not support language changes without reloading. This is unnecessary
    // complexity we can save ourselves.
    bindI18n: '',
    useSuspense: false,
    transKeepBasicHtmlNodesFor: ['br', 'strong', 'i', 'p', 'code']
  },

  interpolation: {
    // React already escapes values
    escapeValue: false
  }
});
