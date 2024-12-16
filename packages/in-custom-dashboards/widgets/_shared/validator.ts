/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { Field, ValidationResult } from 'formalistic';

import { t } from 'in-i18n';

interface Props {
  operator: Field<string>;
  critical: Field<string>;
  warning: Field<string>;
}

export function validateThresholdOrder({ critical, warning, operator }: Props): ValidationResult | boolean {
  const operatorValue = operator?.value;
  const hasCriticalThreshold = critical?.value !== '';
  const hasWarningThreshold = warning?.value !== '';

  if (!hasWarningThreshold || !hasCriticalThreshold) {
    return null;
  }

  const criticalThreshold = parseFloat(critical?.value);
  const warningThreshold = parseFloat(warning?.value);

  if ((operatorValue === '<' || operatorValue === '<=') && warningThreshold <= criticalThreshold) {
    return [
      {
        severity: 'error',
        message: t('in-custom-dashboards:widgets.bigNumber.thresholdForm.warningValidator')
      }
    ];
  } else if ((operatorValue === '>' || operatorValue === '>=') && warningThreshold >= criticalThreshold) {
    return [
      {
        severity: 'error',
        message: t('in-custom-dashboards:widgets.bigNumber.thresholdForm.criticalValidator')
      }
    ];
  }

  return null;
}
