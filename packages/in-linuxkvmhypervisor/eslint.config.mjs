/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

/* eslint-env node */

import { createImportRestrictionRule } from '../../build/linting/restrictedImportRule';

export const rules = {
  ...createImportRestrictionRule({
    enforceAbsoluteImportPaths: true,

    allowedInPackages: [
      // current package
      'in-linuxkvmhypervisor',

      // shared package
      'in-components',
      'in-forge',
      'in-hoc',
      'in-i18n',
      'in-stores',
      'ui-client',
      'in-services',
      'in-hooks',
      'in-infrastructure',
      'in-sdk',
      'in-subscription'
    ]
  })
};
