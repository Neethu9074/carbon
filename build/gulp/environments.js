/* eslint-env node */
/* eslint-disable strict */

'use strict';

exports = module.exports = {
  'K8s Test (pink)': {
    tenant: 'instana',
    unit: 'test',
    baseDomain: 'pink.instana.rocks'
  },
  Custom: {
    // special case: Handled in `devModeQuestions`
    custom: true
  },
  'Locally Running Backend': {
    // special case: Handled in `devModeQuestions`
    local: true
  },
  'blue-instanaops (EU)': {
    tenant: 'instanaops',
    unit: 'blue',
    baseDomain: 'instana.io'
  },
  'red-instanaops (US)': {
    tenant: 'instanaops',
    unit: 'red',
    baseDomain: 'instana.io'
  },
  'K8s Nightly (pink)': {
    tenant: 'instana',
    unit: 'nightly',
    baseDomain: 'pink.instana.rocks'
  },
  'K8s Staging (peach)': {
    tenant: 'instana',
    unit: 'staging',
    baseDomain: 'peach.instana.rocks'
  },
  'K8s Preview (peach)': {
    tenant: 'instana',
    unit: 'preview',
    baseDomain: 'peach.instana.rocks'
  },
  'K8s Release (magenta)': {
    tenant: 'instana',
    unit: 'release',
    baseDomain: 'magenta.instana.rocks'
  },
  'Release Fullstack': {
    tenant: 'instana',
    unit: 'release',
    baseDomain: 'instana.io'
  },
  'Old Test Environment (deprecated)': {
    tenant: 'instana',
    unit: 'test',
    baseDomain: 'instana.io'
  },
  'eu-instanaops (deprecated)': {
    tenant: 'instanaops',
    unit: 'eu',
    baseDomain: 'instana.io'
  },
  'us-instanaops (deprecated)': {
    tenant: 'instanaops',
    unit: 'us',
    baseDomain: 'instana.io'
  }
};
