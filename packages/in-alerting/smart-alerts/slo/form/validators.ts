/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { ValidationResult } from 'formalistic';

import { isSloAlertOperator } from 'in-alerting/smart-alerts/slo/components/OperatorDropdown';
import { t } from 'in-i18n';

export function noEmptySloIds(sloIds: string[]): ValidationResult {
  if (sloIds.length === 0) {
    return [
      {
        severity: 'error',
        message: t('in-alerting:smartAlerts.slo.validators.noEmptySloIds')
      }
    ];
  }
  return undefined;
}

export function notLessThanOrEqualToZero(value: number): ValidationResult {
  if (value <= 0) {
    return [
      {
        severity: 'error',
        message: t('in-alerting:smartAlerts.slo.validators.notLessThanOrEqualToZero')
      }
    ];
  }
  return undefined;
}

export function noInvalidOperator(operator: string): ValidationResult {
  if (!isSloAlertOperator(operator)) {
    return [
      {
        severity: 'error',
        message: t('in-alerting:smartAlerts.slo.validators.noInvalidOperator')
      }
    ];
  }
  return undefined;
}
