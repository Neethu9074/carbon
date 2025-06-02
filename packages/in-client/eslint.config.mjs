/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

/* eslint-disable no-restricted-imports */
import { createImportRestrictionRule } from '../../build/linting/restrictedImportRule.js';
import baseConfig from '../../eslint.config.mjs';

export default [
  ...baseConfig,
  {
    rules: {
      ...createImportRestrictionRule({
        enforceAbsoluteImportPaths: true,
        allowedInPackages: [
          // current package
          'in-client',

          'in-components',
          'in-analyze',
          'in-applications',
          'in-automation',
          'in-bizops',
          'in-cloudfoundry',
          'in-custom-dashboards',
          'in-events',
          'in-hoc',
          'in-infrastructure',
          'in-init',
          'in-integrations',
          'in-kubernetes',
          'in-linuxkvmhypervisor',
          'in-logging',
          'in-mobile-apps',
          'in-nutanix',
          'in-openstack',
          'in-phmc',
          'in-plg',
          'in-powervc',
          'in-profiling',
          'in-sap',
          'in-service-levels',
          'in-services',
          'in-settings',
          'in-stores',
          'in-synthetics',
          'in-themes',
          'in-vsphere',
          'in-vulnerability-center',
          'in-websites',
          'in-windowshypervisor',
          'in-xenserver',
          'in-zhmc'
        ]
      })
    }
  }
];
