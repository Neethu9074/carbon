/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

export const regexValidationError = 'RegexValidationError';

import { t } from 'in-i18n';

export default function regexValidator(datasetForm: any) {
  if (!datasetForm) {
    return;
  }

  const { rule } = datasetForm;
  if (rule) {
    const { regex, metricName, entityType } = rule.toJS();
    if (regex) {
      try {
        new RegExp(metricName);
      } catch (e: any) {
        return [
          {
            severity: 'error',
            message: t('in-alerting:smartAlerts.infrastructure.regexNotValid'),
            category: regexValidationError
          }
        ];
      }
      if (metricName && !entityType.length) {
        return [
          {
            severity: 'error',
            message: t('in-alerting:smartAlerts.infrastructure.selectEntityType'),
            category: regexValidationError
          }
        ];
      }
    }
  }
  return null;
}
