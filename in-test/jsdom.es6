/* eslint-env mocha,node */
import ExecutionEnvironment from 'react/lib/ExecutionEnvironment';
import mochaJsdom from 'mocha-jsdom';

import setupWebSocketGlobals from './setupWebSocketGlobals';
import setupThemeGlobals from './setupThemeGlobals';

export default function jsdomReact() {
  mochaJsdom({
    useEach: true,
    skipWindowCheck: true
  });

  ExecutionEnvironment.canUseDOM = true;

  beforeEach(() => {
    setupWebSocketGlobals();
    setupThemeGlobals();
    global.window.instana = {
      tenants: [
        {
          role: {
            id: '-1',
            name: 'Owner',
            implicitViewFilter: '',
            canConfigureServiceMapping: true,
            canConfigureEumApplications: true,
            canConfigureUsers: true,
            canInstallNewAgents: true,
            canSeeUsageInformation: true,
            canConfigureIntegrations: true,
            canSeeOnPremLicenseInformation: true,
            canConfigureRoles: true,
            canConfigureCustomAlerts: true,
            canConfigureApiTokens: true,
            canConfigureAgentRunMode: true,
            canViewAuditLog: true,
            canConfigureObjectives: true
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
  });
}
