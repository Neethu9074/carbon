/* eslint-env node */

module.exports = {
  test: {
    uiBackendUrl: 'https://test-instana.instana.io/api/data/',
    groundskeeperUrl: 'https://internal-groundskeeper-instana.instana.io',
    tenant: 'instana',
    tenantUnit: 'test',
    groundskeeperDomain: 'internal-groundskeeper-instana.instana.io'
  },
  processview: {
    uiBackendUrl: 'https://processview-instana.instana.io/api/data/',
    groundskeeperUrl: 'https://internal-groundskeeper-instana.instana.io',
    tenant: 'instana',
    tenantUnit: 'processview',
    groundskeeperDomain: 'internal-groundskeeper-instana.instana.io'
  },
  nightly: {
    uiBackendUrl: 'https://nightly-instana.instana.io/api/data/',
    groundskeeperUrl: 'https://internal-groundskeeper-instana.instana.io',
    tenant: 'instana',
    tenantUnit: 'nightly',
    groundskeeperDomain: 'internal-groundskeeper-instana.instana.io'
  },
  local: {
    uiBackendUrl: 'http://localhost:8082/',
    groundskeeperUrl: 'http://localhost:8280',
    withoutAuthPrefix: true,
    tenant: 'instana',
    tenantUnit: 'test',
    groundskeeperDomain: 'internal-groundskeeper-instana.instana.io'
  },
  staging: {
    uiBackendUrl: 'https://staging-instana.instana.io/api/data/',
    groundskeeperUrl: 'https://staging-instana.instana.io',
    tenant: 'instana',
    tenantUnit: 'staging',
    groundskeeperDomain: 'staging-groundskeeper-instana.instana.io'
  },
  current: {
    uiBackendUrl: 'https://current-instana.instana.io/api/data/',
    groundskeeperUrl: 'https://current-instana.instana.io',
    tenant: 'instana',
    tenantUnit: 'current',
    groundskeeperDomain: 'current-groundskeeper-instana.instana.io'
  },
  drivenow: {
    uiBackendUrl: 'https://drivenow.instana.io/api/data/',
    groundskeeperUrl: 'https://drivenow.instana.io',
    tenant: 'drivenow',
    tenantUnit: 'drivenow',
    groundskeeperDomain: 'instana.io'
  },
  crowsnest: {
    uiBackendUrl: 'https://crowsnest.instana.io/api/data/',
    groundskeeperUrl: 'https://crowsnest.instana.io',
    tenant: 'crowsnest',
    tenantUnit: 'crowsnest',
    groundskeeperDomain: 'instana.io'
  },
  dell: {
    uiBackendUrl: 'https://dell.instana.io/api/data/',
    groundskeeperUrl: 'https://dell.instana.io',
    tenant: 'dell',
    tenantUnit: 'dell',
    groundskeeperDomain: 'instana.io'
  },
  hellmann: {
    uiBackendUrl: 'https://hellmann.instana.io/api/data/',
    groundskeeperUrl: 'https://hellmann.instana.io',
    tenant: 'hellmann',
    tenantUnit: 'hellmann',
    groundskeeperDomain: 'instana.io'
  },
  sigil66: {
    uiBackendUrl: 'https://sigil66.instana.io/api/data/',
    groundskeeperUrl: 'https://sigil66.instana.io',
    tenant: 'sigil66',
    tenantUnit: 'sigil66',
    groundskeeperDomain: 'instana.io'
  },
  timocom: {
    uiBackendUrl: 'https://timocom.instana.io/api/data/',
    groundskeeperUrl: 'https://timocom.instana.io',
    tenant: 'timocom',
    tenantUnit: 'timocom',
    groundskeeperDomain: 'instana.io'
  },
  simulator: {
    uiBackendUrl: 'http://localhost:5000',
    groundskeeperUrl: 'http://localhost:5000',
    tenant: 'instana',
    tenantUnit: 'simulation',
    groundskeeperDomain: 'internal-groundskeeper-instana.instana.io'
  }
};
