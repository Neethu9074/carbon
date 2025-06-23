/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { ValidationResult } from 'formalistic';

import { t } from '@instana/i18n-react';

import { isNotBlank } from 'in-services/util/string';

export function daysOfTheWeekValidator(arr: number[]): ValidationResult {
  if (arr.length === 0) {
    return [
      {
        severity: 'error',
        message: t('in-service-levels:configureCorrectionWindowDialog.validators.daysOfTheWeek')
      }
    ];
  }

  return null;
}

export function startAndEndDateValidator(startDate: string, endDate: string): ValidationResult {
  if (isNotBlank(endDate) && new Date(endDate) <= new Date(startDate)) {
    return [
      {
        severity: 'error',
        message: t('in-service-levels:configureCorrectionWindowDialog.validators.startAndEndDate')
      }
    ];
  }
  return null;
}
