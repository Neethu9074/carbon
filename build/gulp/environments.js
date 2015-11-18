/* eslint-env node */

module.exports = {
  test: {
    user: 'stan@instana.com',
    pw: '4711',
    uiBackendUrl: 'https://test-instana.instana.io/api',
    groundskeeperUrl: 'https://test-instana.instana.io',
    tenant: 'instana',
    tenantUnit: 'test',
    groundskeeperDomain: 'internal-groundskeeper-instana.instana.io'
  },
  demo2: {
    user: 'stan@instana.com',
    pw: '4711',
    uiBackendUrl: 'https://demo2-instana.instana.io/api',
    groundskeeperUrl: 'https://demo2-instana.instana.io',
    tenant: 'instana',
    tenantUnit: 'demo2',
    groundskeeperDomain: 'demo-groundskeeper-instana.instana.io'
  },
  demo: {
    user: 'stan@instana.com',
    pw: '4711',
    uiBackendUrl: 'https://demo.instana.io/api',
    groundskeeperUrl: 'https://demo.instana.io',
    tenant: 'instana',
    tenantUnit: 'demo',
    groundskeeperDomain: 'demo-groundskeeper-instana.instana.io'
  },
  johan: {
    user: 'fromutome@yahoo.com',
    pw: '34johan12',
    uiBackendUrl: 'https://johan.instana.io/api',
    groundskeeperUrl: 'https://johan.instana.io',
    tenant: 'johan',
    tenantUnit: 'test',
    groundskeeperDomain: 'instana.io'
  },
  betquest: {
    user: 'markus.bonsch@codecentric.de',
    pw: 'Horst67',
    uiBackendUrl: 'https://betquest.instana.io/api',
    groundskeeperUrl: 'https://betquest.instana.io',
    tenant: 'betquest',
    tenantUnit: 'test',
    groundskeeperDomain: 'instana.io'
  },
  codecentric: {
    user: 'tobias.knierim@codecentric.de',
    pw: 'crackme42',
    uiBackendUrl: 'https://codecentric.instana.io/api',
    groundskeeperUrl: 'https://codecentric.instana.io',
    tenant: 'codecentric',
    tenantUnit: 'test',
    groundskeeperDomain: 'instana.io'
  },
  centerdevice: {
    user: 'daniel.schneller@centerdevice.de',
    pw: '543centerdevice345',
    uiBackendUrl: 'https://centerdevice.instana.io/api',
    groundskeeperUrl: 'https://centerdevice.instana.io',
    tenant: 'centerdevice',
    tenantUnit: 'test',
    groundskeeperDomain: 'instana.io'
  },
  local: {
    user: 'stan@instana.com',
    pw: '4711',
    uiBackendUrl: 'http://localhost:8080',
    groundskeeperUrl: 'http://localhost:8280',
    tenant: 'instana',
    tenantUnit: 'test',
    groundskeeperDomain: 'internal-groundskeeper-instana.instana.io'
  },
  staging: {
    user: '<none>',
    pw: '<none>',
    uiBackendUrl: 'https://staging-instana.instana.io/api',
    groundskeeperUrl: 'https://staging-instana.instana.io',
    tenant: 'instana',
    tenantUnit: 'staging',
    groundskeeperDomain: 'staging-groundskeeper-instana.instana.io'
  },
  simulator: {
    user: '<none>',
    pw: '<none>',
    uiBackendUrl: 'http://localhost:5000',
    groundskeeperUrl: 'http://localhost:5000',
    tenant: 'instana',
    tenantUnit: 'simulation',
    groundskeeperDomain: 'internal-groundskeeper-instana.instana.io'
  }
};
