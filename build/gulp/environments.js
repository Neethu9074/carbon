/* eslint-env node */

module.exports = {
  test: {
    uiBackendUrl: 'https://test-instana.instana.io',
    groundskeeperUrl: 'https://internal-groundskeeper-instana.instana.io',
    tenant: 'instana',
    tenantUnit: 'test',
    butlerDomain: 'internal-groundskeeper-instana.instana.io'
  },
  next: {
    uiBackendUrl: 'https://next-instana.instana.io',
    groundskeeperUrl: 'https://next-instana.instana.io',
    tenant: 'instana',
    tenantUnit: 'next',
    butlerDomain: 'next-groundskeeper-instana.instana.io'
  },
  processview: {
    uiBackendUrl: 'https://processview-instana.instana.io',
    groundskeeperUrl: 'https://internal-groundskeeper-instana.instana.io',
    tenant: 'instana',
    tenantUnit: 'processview',
    butlerDomain: 'internal-groundskeeper-instana.instana.io'
  },
  nightly: {
    uiBackendUrl: 'https://nightly-instana.instana.io',
    groundskeeperUrl: 'https://internal-groundskeeper-instana.instana.io',
    tenant: 'instana',
    tenantUnit: 'nightly',
    butlerDomain: 'internal-groundskeeper-instana.instana.io'
  },
  local: {
    uiBackendUrl: 'http://localhost:8082/',
    groundskeeperUrl: 'http://localhost:8480',
    withoutAuthPrefix: true,
    tenant: 'instana',
    tenantUnit: 'test',
    butlerDomain: 'internal-groundskeeper-instana.instana.io'
  },
  staging: {
    uiBackendUrl: 'https://staging-instana.instana.io',
    groundskeeperUrl: 'https://staging-instana.instana.io',
    tenant: 'instana',
    tenantUnit: 'staging',
    butlerDomain: 'staging-groundskeeper-instana.instana.io'
  },
  current: {
    uiBackendUrl: 'https://current-instana.instana.io',
    groundskeeperUrl: 'https://current-instana.instana.io',
    tenant: 'instana',
    tenantUnit: 'current',
    butlerDomain: 'current-groundskeeper-instana.instana.io'
  },
  drivenow: {
    uiBackendUrl: 'https://drivenow.instana.io',
    groundskeeperUrl: 'https://drivenow.instana.io',
    tenant: 'drivenow',
    tenantUnit: 'drivenow',
    butlerDomain: 'instana.io'
  },
  kddi: {
    uiBackendUrl: 'https://kddi.instana.io',
    groundskeeperUrl: 'https://kddi.instana.io',
    tenant: 'kddi',
    tenantUnit: 'kddi',
    butlerDomain: 'instana.io'
  },
  megazebra: {
    uiBackendUrl: 'https://megazebra.instana.io',
    groundskeeperUrl: 'https://megazebra.instana.io',
    tenant: 'megazebra',
    tenantUnit: 'megazebra',
    butlerDomain: 'instana.io'
  },
  partner: {
    uiBackendUrl: 'https://partner-partner.instana.io',
    groundskeeperUrl: 'https://partner-partner.instana.io',
    tenant: 'partner',
    tenantUnit: 'partner',
    butlerDomain: 'instana.io'
  },
  douglas: {
    uiBackendUrl: 'https://douglas.instana.io',
    groundskeeperUrl: 'https://douglas.instana.io',
    tenant: 'douglas',
    tenantUnit: 'douglas',
    butlerDomain: 'instana.io'
  },
  aetion: {
    uiBackendUrl: 'https://aetion.instana.io',
    groundskeeperUrl: 'https://aetion.instana.io',
    tenant: 'aetion',
    tenantUnit: 'aetion',
    butlerDomain: 'instana.io'
  },
  hellmann: {
    uiBackendUrl: 'https://hellmann.instana.io',
    groundskeeperUrl: 'https://hellmann.instana.io',
    tenant: 'hellmann',
    tenantUnit: 'hellmann',
    butlerDomain: 'instana.io'
  },
  sigil66: {
    uiBackendUrl: 'https://sigil66.instana.io',
    groundskeeperUrl: 'https://sigil66.instana.io',
    tenant: 'sigil66',
    tenantUnit: 'sigil66',
    butlerDomain: 'instana.io'
  },
  timocom: {
    uiBackendUrl: 'https://timocom.instana.io',
    groundskeeperUrl: 'https://timocom.instana.io',
    tenant: 'timocom',
    tenantUnit: 'timocom',
    butlerDomain: 'instana.io'
  },
  simulator: {
    uiBackendUrl: 'http://localhost:5000',
    groundskeeperUrl: 'http://localhost:5000',
    tenant: 'instana',
    tenantUnit: 'simulation',
    butlerDomain: 'internal-groundskeeper-instana.instana.io'
  }
};
