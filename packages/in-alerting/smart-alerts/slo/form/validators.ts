/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { ValidationResult } from 'formalistic';

import { SloAlertBurnRateTimeWindowsFields } from 'in-alerting/smart-alerts/slo/form/alertFormDefinition';
import { isSloAlertDurationUnit } from 'in-alerting/smart-alerts/slo/components/TimeOptionsDropdown';
import { isFieldValid } from 'in-service-levels/components/ConfigDialog/createSloForm/utils';
import { calculateTimeWindowInMilliseconds } from 'in-alerting/smart-alerts/slo/form/utils';
import { isSloAlertThresholdOperator } from 'in-alerting/smart-alerts/slo/types';
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
  if (!isSloAlertThresholdOperator(operator)) {
    return [
      {
        severity: 'error',
        message: t('in-alerting:smartAlerts.slo.validators.noInvalidOperator')
      }
    ];
  }
  return undefined;
}

export function noInvalidDurationUnit(durationUnit: string): ValidationResult {
  if (!isSloAlertDurationUnit(durationUnit)) {
    return [
      {
        severity: 'error',
        message: t('in-alerting:smartAlerts.slo.validators.noInvalidDurationUnit')
      }
    ];
  }
  return undefined;
}

export function burnRateFormValidator(form: SloAlertBurnRateTimeWindowsFields): ValidationResult {
  const shortTimeWindowDurationField = form.shortTimeWindow.getIn(['duration']);
  const shortTimeWindowDurationUnitField = form.shortTimeWindow.getIn(['durationType']);
  const longTimeWindowDurationField = form.longTimeWindow.getIn(['duration']);
  const longTimeWindowDurationUnitField = form.longTimeWindow.getIn(['durationType']);

  if (!isFieldValid(shortTimeWindowDurationField) || !isFieldValid(longTimeWindowDurationField)) return undefined;

  const longTimeWindowDurationInMilliseconds = calculateTimeWindowInMilliseconds(
    longTimeWindowDurationField.value,
    longTimeWindowDurationUnitField.value
  );
  const shortTimeWindowDurationInMilliseconds = calculateTimeWindowInMilliseconds(
    shortTimeWindowDurationField.value,
    shortTimeWindowDurationUnitField.value
  );

  if (shortTimeWindowDurationInMilliseconds > longTimeWindowDurationInMilliseconds) {
    return [
      {
        severity: 'error',
        message: t('in-alerting:smartAlerts.slo.advancedModeContainer.burnRateShortWindowLongerThanLongWindowError'),
        path: '$.burnRateTimeWindows.longTimeWindow'
      }
    ];
  }

  return undefined;
}
