/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import moment from 'moment';

import { timeFormat as defaultTimeFormat, dateFormat } from 'in-services/formatters/date';
import { isBlank } from 'in-services/util/string';
import { t } from 'in-i18n';
import { ValidationResult } from 'formalistic';

export function timeValidator(v: string, timeFormat = defaultTimeFormat): ValidationResult {
  if (isBlank(v)) {
    return null;
  }

  if (moment(v, timeFormat).isValid()) {
    return null;
  }

  return [
    {
      severity: 'error',
      message: t('in-services:validators.timeDoesNotHaveTheFormat', { timeFormat: timeFormat })
    }
  ];
}

export function dateValidator(v: string): ValidationResult {
  if (isBlank(v)) {
    return null;
  }

  if (moment(v, dateFormat, true).isValid()) {
    return null;
  } else if (v.length !== dateFormat.length) {
    return [
      {
        severity: 'error',
        message: t('in-services:validators.dateDoesNotHaveTheFormat', { dateFormat: dateFormat })
      }
    ];
  }
  return [
    {
      severity: 'error',
      message: t('in-services:validators.dateIsInvalid')
    }
  ];
}
