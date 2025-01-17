/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

/* eslint-env node */

const { createImportRestrictionRule } = require('../../build/linting/restrictedImportRule');

module.exports = {
  rules: {
    ...createImportRestrictionRule({
      enforceAbsoluteImportPaths: true,

      patterns: [
        // this would be a public part of that package,
        // but it should not be depending on this package.
        '!in-cloudfoundry/navigation'
      ],

      allowedInPackages: [
        // current package
        'in-components',

        // unwanted dependencies, that will need refactoring
        'in-alerting',
        'in-analyze',
        'in-api',
        'in-applications',
        'in-automation',
        'in-bizops',
        'in-client',
        'in-custom-dashboards',
        'in-events',
        'in-infrastructure',
        'in-kubernetes',
        'in-logging',
        'in-mobile-apps',
        'in-nutanix',
        'in-openstack',
        'in-phmc',
        'in-plg',
        'in-powervc',
        'in-sap',
        'in-service-levels',
        'in-settings',
        'in-synthetics',
        'in-vsphere',
        'in-vulnerability-center',
        'in-websites',
        'in-zhmc',

        // shared packages
        'in-services',
        'in-test',

        'in-stores',
        'in-sdk',
        'in-hooks',
        'in-hoc', // only 'in-hoc/connectTo'
        'in-subscription',
        'in-map',
        'in-themes',
        'in-forge'
      ]
    })
  }
};
