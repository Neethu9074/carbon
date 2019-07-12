/* eslint-env node */
/* eslint-disable strict */

'use strict';

exports = module.exports = {
  Test: {
    tenant: 'instana',
    unit: 'test',
    baseDomain: 'instana.io'
  },
  Custom: {
    // special case: Handled in `devModeQuestions`
    custom: true
  },
  'Locally Running Backend': {
    // special case: Handled in `devModeQuestions`
    local: true
  },
  'eu-instanaops': {
    tenant: 'instanaops',
    unit: 'eu',
    baseDomain: 'instana.io'
  },
  'us-instanaops': {
    tenant: 'instanaops',
    unit: 'us',
    baseDomain: 'instana.io'
  },
  'K8 Test': {
    tenant: 'instana',
    unit: 'test',
    baseDomain: 'pink.instana.rocks'
  },
  'K8 Nightly': {
    tenant: 'instana',
    unit: 'nightly',
    baseDomain: 'pink.instana.rocks'
  },
  'K8 Staging': {
    tenant: 'instana',
    unit: 'staging',
    baseDomain: 'peach.instana.rocks'
  },
  'K8 Preview': {
    tenant: 'instana',
    unit: 'preview',
    baseDomain: 'peach.instana.rocks'
  },
  'K8 Release': {
    tenant: 'instana',
    unit: 'release',
    baseDomain: 'magenta.instana.rocks'
  }
};
