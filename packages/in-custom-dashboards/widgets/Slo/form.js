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

  let form = createMapForm();

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
  form = form.put(
    TimeWindowType,
    createField({
      value: savedState[TimeWindowType]
    })
  );
  if (savedState[TimeWindowType] === Fixed) {
    const start = savedState[TimeWindowStart];
    // auto-corrects invalid dates:
    const ts = parsedTimestamp(start?.date + ' ' + start?.time);
    form = addFormForStartTimeStamp(form, ts);
  }

  form = form.put(
    TimeWindowDuration,
    createField({
      validator: composeAndShortCircuitOnError(numericValidator, notBlankValidator, positiveNumberValidator),
      value: savedState[TimeWindowDuration] ?? '1'
    })
  );
  form = form.put(
    TimeWindowDurationUnit,
    createField({
      value: savedState[TimeWindowDurationUnit] ?? 'months'
    })
  );
  return form;
}

export const parsedTimestamp = str => {
  if (!moment().isValid(str)) return null;

  return parseDateTime(str).getTime();
};

export function removeFormForStartTimeStamp(form) {
  return form.remove(TimeWindowStart);
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
