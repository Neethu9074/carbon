/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import baseConfig from '../../../../eslint.config.mjs';

export default [
  ...baseConfig,
  {
    rules: {
      'no-restricted-imports': [
        'error',
        {
          paths: [
            {
              name: 'in-alerting/smart-alerts/slo/form/SloAlertFormProvider',
              importNames: ['sloAlertFormContext'],
              message: "Please use 'useSloAlertFormContext' hook instead"
            }
          ]
        }
      ]
    }
  }
];
