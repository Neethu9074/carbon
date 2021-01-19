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
  Custom: {
    // special case: Handled in `devModeQuestions`
    custom: true
  },
  'Locally Running Backend': {
    // special case: Handled in `devModeQuestions`
    local: true
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
