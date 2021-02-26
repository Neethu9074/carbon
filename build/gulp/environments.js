/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
/* eslint-env node */
/* eslint-disable strict */

'use strict';

exports = module.exports = {
  'K8s Test (pink)': {
    tenant: 'instana',
    unit: 'test',
    baseDomain: 'pink.instana.rocks'
  },
  'Custom SaaS (run local UI against an arbitrary tenant unit in one of our SaaS or internal regions)': {
    // special case: Handled in `devModeQuestions`
    custom: 'saas'
  },
  'Custom Self Hosted (run local UI against an arbitrary remote self hosted installation)': {
    // special case: Handled in `devModeQuestions`
    custom: 'selfhosted'
  },
  'Local (manually started) Backend (run local UI against fully local backend or against a partially local backend with ssh tunnels)': {
    // special case: Handled in `devModeQuestions`
    local: true
  },
  'K8s Nightly (pink)': {
    tenant: 'instana',
    unit: 'nightly',
    baseDomain: 'pink.instana.rocks'
  },
  'K8s Release (magenta)': {
    tenant: 'instana',
    unit: 'release',
    baseDomain: 'instana.rocks'
  },
  'K8s Staging (peach)': {
    tenant: 'instana',
    unit: 'staging',
    baseDomain: 'instana.rocks'
  },
  'K8s Preview (peach)': {
    tenant: 'instana',
    unit: 'preview',
    baseDomain: 'instana.rocks'
  },
  'blue-instanaops (EU AWS)': {
    tenant: 'instanaops',
    unit: 'blue',
    baseDomain: 'instana.io'
  },
  'red-instanaops (US AWS)': {
    tenant: 'instanaops',
    unit: 'red',
    baseDomain: 'instana.io'
  },
  'green-instanaops (EU GCP)': {
    tenant: 'instanaops',
    unit: 'green',
    baseDomain: 'instana.io'
  },
  'orange-instanaops (US GCP)': {
    tenant: 'instanaops',
    unit: 'orange',
    baseDomain: 'instana.io'
  },
  'internal-instanaops': {
    tenant: 'instanaops',
    unit: 'internal',
    baseDomain: 'instana.io'
  }
};
