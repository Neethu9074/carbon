/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

/* eslint-env node */

const { createImportRestrictionRule } = require('../../build/linting/restrictedImportRule');

module.exports = {
  rules: {
    ...createImportRestrictionRule({
      enforceAbsoluteImportPaths: true,

      allowedInPackages: [
        // current package
        'in-plg',

        // unwanted dependencies, that will need refactoring
        'in-alerting',
        'in-analyze',
        'in-applications',
        'in-bizops',
        'in-cockpit',
        'in-events',
        'in-infrastructure',
        'in-mobile-apps',
        'in-custom-dashboards',
        'in-service-levels',
        'in-synthetics',
        'in-websites',

        // shared packages
        'in-api',
        'in-components',
        'in-cloudfoundry',
        'in-powervc',
        'in-vsphere',
        'in-phmc',
        'in-sap',
        'in-automation',
        'in-amp',
        'in-settings',
        'in-kubernetes',
        'in-client',
        'in-services',
        'in-openstack',
        'in-zhmc',
        'in-waiting-for-deployment',

        'in-hooks',
        'in-hoc', // only 'in-hoc/connectTo'
        'in-stores',
        'in-sdk',
        'in-subscription',
        'in-themes'
      ]
    })
  }
};
