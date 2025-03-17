/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { ValidationResult } from 'formalistic';

import { t } from 'in-i18n';

export const notBlankSloValidator = (v: any): ValidationResult => {
  if (!v) {
    return [
      {
        severity: 'error',
        message: t('in-custom-dashboards:widgets.slo.v2Form.validators.notBlankSloValidator')
      }
    ];
  }
  return undefined;
};
