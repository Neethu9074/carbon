/* eslint-env mocha,node */
/* eslint-disable no-var, vars-on-top, strict */

'use strict';

// Set our default time zone so that tests with date formatting are predictable.
process.env.TZ = 'Europe/Berlin';

const Adapter = require('enzyme-adapter-react-16');
const Enzyme = require('enzyme');
const { JSDOM } = require('jsdom');
const path = require('path');
const chai = require('chai');

chai.use(require('chai-string'));
chai.use(require('chai-subset'));
chai.use(require('sinon-chai'));

// support static file require statements
['.png', '.less', '.css', '.svg', '.glsl', '.mless', '.mmd'].forEach(extension => {
  require.extensions[extension] = () => {
    return `a ${extension} module`;
  };
});

const babelConfig = require(path.join(__dirname, '..', '..', 'babel.config.js'));
require('@babel/register')(babelConfig);

// Ensuring a browser environment is simulated before React is loaded to avoid
// Error: Invariant Violation: Markup wrapping node not initialized
// Also see:
// https://github.com/facebook/react/issues/3840
const jsdom = new JSDOM('<html><head></head><body></body></html>', {
  url: 'http://demo.internal.instana.io'
});
global.window = jsdom.window;
global.document = global.window.document;
global.navigator = global.window.navigator;
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
