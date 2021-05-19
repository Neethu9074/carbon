/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { createMapForm, createField, composeValidators } from 'formalistic';
import moment from 'moment';

import { sloValidator } from 'in-custom-dashboards/widgets/_shared/MetricConfigurator/sources/sli/form';
import { numericValidator, positiveNumberValidator } from 'in-services/validators/number';
import { formatDate, formatTime, parseDateTime } from 'in-services/formatters/date';
import { numberValidator, stringValidator } from 'in-services/validators/jsonType';
import { composeAndShortCircuitOnError } from 'in-services/validators/compose';
import { dateValidator, timeValidator } from 'in-services/validators/date';
import { notUndefinedValidator } from 'in-services/validators/undefined';
import { notBlankValidator } from 'in-services/validators/string';
import { t } from 'in-i18n';

// internal fields just for app-config information used internally
export const apConfigId = 'apConfigId';

export const sloTarget = 'slo';
export const sliConfigId = 'sliConfigId';
export const timeWindowType = 'timeWindowType';
export const timeWindowStart = 'timeWindowStart';
export const timeWindowDuration = 'timeWindowDuration';
export const timeWindowDurationUnit = 'timeWindowDurationUnit';

// time-window types
export const fixed = 'fixed';
export const dynamic = 'dynamic';
export const rolling = 'rolling';

export function createForm(oldSavedState) {
  const savedState = oldSavedState ?? {};

  let form = createMapForm({
    validator: validateTimeWindow
  });

  form = form.put(
    apConfigId,
    createField({
      validator: composeAndShortCircuitOnError(notUndefinedValidator, stringValidator, notBlankValidator),
      value: savedState[apConfigId]
    })
  );
  form = form.put(
    sloTarget,
    createField({
      validator: composeAndShortCircuitOnError(notUndefinedValidator, numberValidator, sloValidator),
      value: savedState[sloTarget] ?? ''
    })
  );
  form = form.put(
    sliConfigId,
    createField({
      validator: composeAndShortCircuitOnError(notUndefinedValidator, stringValidator, notBlankValidator),
      value: savedState[sliConfigId]
    })
  );
  const windowType = savedState[timeWindowType];
  form = form.put(
    timeWindowType,
    createField({
      value: windowType
    })
  );
  if (windowType === fixed) {
    const start = savedState[timeWindowStart];
    // auto-corrects invalid dates:
    const ts = parsedTimestamp(start?.date + ' ' + start?.time);
    form = addFormForStartTimeStamp(form, ts);
  }
  if (windowType === fixed || windowType === rolling) {
    form = addFormForTimeDuration(form, savedState);
  }
  return form;
}

function validateTimeWindow({ timeWindowDuration, timeWindowDurationUnit }) {
  if (!timeWindowDuration || !timeWindowDurationUnit || !timeWindowDuration.valid || !timeWindowDurationUnit.valid) {
    return null;
  }

  const timeWindowDurationInDays = getTimeWindowDurationInDays(timeWindowDuration.value, timeWindowDurationUnit.value);

  if (timeWindowDurationInDays > 365) {
    return [
      {
        severity: 'error',
        message: t('in-custom-dashboards:widgets.slo.theTimeWindowSizeHasToBeLessOrEqualTo365Days')
      }
    ];
  }

  return null;
}

function getTimeWindowDurationInDays(value, unit) {
  switch (unit) {
    case 'days':
      return value;
    case 'weeks':
      return value * 7;
    case 'months':
    default:
      return value === 12 ? 365 : value * 31;
  }
}

export const parsedTimestamp = str => {
  if (!moment().isValid(str)) return null;

  return parseDateTime(str).getTime();
};

export function removeFormForStartTimeStamp(form) {
  if (form.containsKey(timeWindowStart)) {
    return form.remove(timeWindowStart);
  }
  return form;
}

export function addFormForStartTimeStamp(form, ts) {
  const timestamp = ts ?? new Date().setHours(0, 0, 0, 0);
  return form.put(
    timeWindowStart,
    createMapForm()
      .put(
        'date',
        createField({
          value: formatDate(timestamp),
          validator: composeValidators(notBlankValidator, dateValidator)
        })
      )
      .put(
        'time',
        createField({
          value: formatTime(timestamp),
          validator: composeValidators(notBlankValidator, timeValidator)
        })
      )
  );
}

export function removeFormForTimeDuration(form) {
  if (form.containsKey(timeWindowDuration)) {
    form = form.remove(timeWindowDuration);
  }
  if (form.containsKey(timeWindowDurationUnit)) {
    form = form.remove(timeWindowDurationUnit);
  }
  return form;
}

export function addFormForTimeDuration(form, savedState, override = true) {
  if (override || !form.containsKey(timeWindowDuration))
    form = form.put(
      timeWindowDuration,
      createField({
        validator: composeAndShortCircuitOnError(numericValidator, positiveNumberValidator),
        value: savedState[timeWindowDuration] ?? '1'
      })
    );
  if (override || !form.containsKey(timeWindowDurationUnit))
    form = form.put(
      timeWindowDurationUnit,
      createField({
        value: savedState[timeWindowDurationUnit] ?? 'weeks'
      })
    );
  return form;
}
