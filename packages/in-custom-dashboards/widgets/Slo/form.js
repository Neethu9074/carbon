import { createMapForm, notBlankValidator, createField, composeValidators } from 'formalistic';
import moment from 'moment';

import { sloValidator } from 'in-custom-dashboards/widgets/_shared/MetricConfigurator/sources/sli/form';
import { numericValidator, positiveNumberValidator } from 'in-services/validators/number';
import { formatDate, formatTime, parseDateTime } from 'in-services/formatters/date';
import { numberValidator, stringValidator } from 'in-services/validators/jsonType';
import { composeAndShortCircuitOnError } from 'in-services/validators/compose';
import { dateValidator, timeValidator } from 'in-services/validators/date';
import { notUndefinedValidator } from 'in-services/validators/undefined';
import { demo } from 'in-custom-dashboards/widgets/Slo';

// internal fields just for app-config information used internally
export const ApConfigId = 'apConfigId';
export const ApName = 'apName';
export const ApBoundaryScope = 'apBoundaryScope';

export const SloTarget = 'slo';
export const SliConfigId = 'sliConfigId';
export const TimeWindowType = 'timeWindowType';
export const TimeWindowStart = 'timeWindowStart';
export const TimeWindowDuration = 'timeWindowDuration';
export const TimeWindowDurationUnit = 'timeWindowDurationUnit';

// time-window types
export const Fixed = 'fixed';
export const Dynamic = 'dynamic';
export const Rolling = 'rolling';

export function createForm(oldSavedState) {
  const savedState = oldSavedState ?? {};

  let form = createMapForm({
    validator: validateTimeWindow
  });

  form = form.put(
    ApName,
    createField({
      value: savedState[ApName] ?? ''
    })
  );
  form = form.put(
    ApBoundaryScope,
    createField({
      value: savedState[ApBoundaryScope] ?? demo[ApBoundaryScope]
    })
  );
  form = form.put(
    ApConfigId,
    createField({
      validator: composeAndShortCircuitOnError(notUndefinedValidator, stringValidator, notBlankValidator),
      value: savedState[ApConfigId]
    })
  );
  form = form.put(
    SloTarget,
    createField({
      validator: composeAndShortCircuitOnError(notUndefinedValidator, numberValidator, sloValidator),
      value: savedState[SloTarget] ?? ''
    })
  );
  form = form.put(
    SliConfigId,
    createField({
      validator: composeAndShortCircuitOnError(notUndefinedValidator, stringValidator, notBlankValidator),
      value: savedState[SliConfigId]
    })
  );
  const windowType = savedState[TimeWindowType];
  form = form.put(
    TimeWindowType,
    createField({
      value: windowType
    })
  );
  if (windowType === Fixed) {
    const start = savedState[TimeWindowStart];
    // auto-corrects invalid dates:
    const ts = parsedTimestamp(start?.date + ' ' + start?.time);
    form = addFormForStartTimeStamp(form, ts);
  }
  if (windowType === Fixed || windowType === Rolling) {
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
        message: 'The time window size has be be less or equal to 365 days.'
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
      return value * 31;
  }
}

export const parsedTimestamp = str => {
  if (!moment().isValid(str)) return null;

  return parseDateTime(str).getTime();
};

export function removeFormForStartTimeStamp(form) {
  if (form.containsKey(TimeWindowStart)) {
    return form.remove(TimeWindowStart);
  }
  return form;
}

export function addFormForStartTimeStamp(form, ts) {
  const timestamp = ts ?? new Date().setHours(0, 0, 0, 0);
  return form.put(
    TimeWindowStart,
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
  if (form.containsKey(TimeWindowDuration)) {
    form = form.remove(TimeWindowDuration);
  }
  if (form.containsKey(TimeWindowDurationUnit)) {
    form = form.remove(TimeWindowDurationUnit);
  }
  return form;
}

export function addFormForTimeDuration(form, savedState, override = true) {
  if (override || !form.containsKey(TimeWindowDuration))
    form = form.put(
      TimeWindowDuration,
      createField({
        validator: composeAndShortCircuitOnError(numericValidator, positiveNumberValidator),
        value: savedState[TimeWindowDuration] ?? '1'
      })
    );
  if (override || !form.containsKey(TimeWindowDurationUnit))
    form = form.put(
      TimeWindowDurationUnit,
      createField({
        value: savedState[TimeWindowDurationUnit] ?? 'weeks'
      })
    );
  return form;
}
