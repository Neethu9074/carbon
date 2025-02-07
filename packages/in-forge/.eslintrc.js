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
      enforceAbsoluteImportPaths: false,

      allowedInPackages: [
        // current package
        'in-forge',

        // unwanted dependencies, that will need refactoring
        'in-applications',

        'in-infrastructure',
        'in-kubernetes',
        'in-zhmc',
        'in-custom-dashboards',
        'in-nutanix',
        'in-bizops',
        'in-websites',
        'in-vsphere',
        'in-sap',
        'in-powervc',
        'in-phmc',
        'in-cloudfoundry',
        'in-openstack',
        'in-integrations',
        'in-logging',
        'in-automation',

        // shared packages
        'in-components',
        'in-themes',
        'in-services',
        'in-test',
        'in-stores',
        'in-sdk',
        'in-hooks',
        'in-subscription',
        'in-hoc'
      ]
    })
  }
};
