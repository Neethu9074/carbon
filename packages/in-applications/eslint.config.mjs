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
          'in-alerting',
          'in-analyze',
          'in-api',
          'in-applications',
          'in-components',
          'in-connection',
          'in-events',
          'in-hoc',
          'in-hooks',
          'in-mobile-apps',
          'in-sdk',
          'in-service-levels',
          'in-services',
          'in-settings',
          'in-stores',
          'in-subscription',
          'in-test',
          'in-themes',
          'in-websites',
          'in-infrastructure',
          'in-custom-dashboards',
          'in-logging',
          'in-forge',
          'in-kubernetes',
          'in-synthetics',
          'in-map',
          'in-automation',
          'in-cloudfoundry',
          'in-openstack',
          'in-powervc',
          'in-vsphere',
          'in-sap',
          'in-zhmc',
          'in-phmc',
          'in-vulnerability-center'
        ]
      })
    }
  }
];
