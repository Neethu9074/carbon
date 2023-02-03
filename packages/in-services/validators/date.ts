/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { ValidationResult } from 'formalistic';
import { parse, isValid } from 'date-fns';

import { fillMissingInputTime, TimeFormat } from 'in-components/time/TimeSelectionDialogPresenter/timeInputFormatter';
import { timeFormat as defaultTimeFormat, dateFormat } from 'in-services/formatters/date';
import { isBlank } from 'in-services/util/string';
import { Nullish } from 'in-types';
import { t } from 'in-i18n';

export function timeValidator(v: string, timeFormat: TimeFormat = defaultTimeFormat): ValidationResult {
  if (isBlank(v)) {
    return null;
  }

  const enrichedTime = fillMissingInputTime(v, timeFormat);

  if (isValid(parse(enrichedTime, timeFormat, new Date()))) {
    return null;
  }

  return [
    {
      severity: 'error',
      message: t('in-services:validators.timeDoesNotHaveTheFormat', { timeFormat: timeFormat })
    }
  ];
}

export function dateValidator(v: string | Nullish): ValidationResult {
  if (isBlank(v)) {
    return null;
  }

  if (isValid(parse(v!, dateFormat, new Date()))) {
    return null;
  } else if (v!.length !== dateFormat.length) {
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
