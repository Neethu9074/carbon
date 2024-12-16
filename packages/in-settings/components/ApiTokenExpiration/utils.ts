/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { createField, createMapForm, Field, MapForm, ValidationResult } from 'formalistic';

import { DateFormatterInput, formatDateTime } from '@instana/format-date';

import { composeAndShortCircuitOnError } from 'in-services/validators/compose';
import { dateValidator, timeValidator } from 'in-services/validators/date';
import { formatDate, formatTime } from 'in-services/formatters/date';
import { notBlankValidator } from 'in-services/validators/string';
import { t } from 'in-i18n';

export const customTokenExpiry = 'customTokenExpiry';

export type ExpiryOptionType = 'Custom' | 'Never' | '30 days' | '60 days' | '90 days' | '365 days';

export function removeFormForExpiryTimeStamp(form: MapForm<any>): MapForm<any> {
  if (form.containsKey(customTokenExpiry)) {
    return form.remove(customTokenExpiry);
  }
  return form;
}

export function addFormForExpiryTimeStamp(form: MapForm<any>, ts?: number | null): MapForm<any> {
  return form.put(
    customTokenExpiry,
    createMapForm({ validator: isBeforeCurrentTimeValidator, touched: true })
      .put(
        'date',
        createField({
          value: ts ? formatDate(ts) : '',
          validator: composeAndShortCircuitOnError(notBlankValidator, dateValidator)
        })
      )
      .put(
        'time',
        createField({
          value: ts ? formatTime(ts) ?? '00:00' : '00:00',
          validator: composeAndShortCircuitOnError(notBlankValidator, timeValidator)
        })
      )
  );
}

export const isBeforeCurrentTimeValidator = ({
  date,
  time
}: {
  date: Field<string>;
  time: Field<string>;
}): ValidationResult | null => {
  const expiryDate = date?.value;
  const expiryTime = time?.value;

  const isBeforeCurrentTime = +new Date() - +new Date(String(`${expiryDate} ${expiryTime}`)) > 0;
  return isBeforeCurrentTime
    ? [{ severity: 'error', message: t('in-settings:tabs.tokenValidationPleaseEnterTimeInFuture') }]
    : null;
};

export const updateExpiresOnFormField = (form: MapForm<any>, value: DateFormatterInput): MapForm<any> => {
  return form.updateIn(['expiresOn'], (f: Field<DateFormatterInput>) => f.setValue(value).setTouched(true));
};

export const getApiTokenStatus = (expiresOn: DateFormatterInput) => {
  const time_diff: number = new Date().getTime() - (expiresOn as number);

  if (expiresOn === null || expiresOn === 0) {
    return t('in-settings:tabs.tokenActive');
  } else if (time_diff < 0) {
    return t('in-settings:tabs.tokenActiveUntil', { dateTime: formatDateTime(expiresOn) });
  } else {
    return t('in-settings:tabs.tokenExpiredOn', { dateTime: formatDateTime(expiresOn) });
  }
};
