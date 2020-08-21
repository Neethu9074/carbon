import { createMapForm, notBlankValidator, createField, composeValidators } from 'formalistic';
import moment from 'moment';

import { formatDate, formatTime, parseDateTime } from 'in-services/formatters/date';
import { composeAndShortCircuitOnError } from 'in-services/validators/compose';
import { dateValidator, timeValidator } from 'in-services/validators/date';
import { notUndefinedValidator } from 'in-services/validators/undefined';
import { numericValidator } from 'in-services/validators/number';
import { demo } from 'in-custom-dashboards/widgets/Slo';

export const SliConfigId = 'sliConfigId';
export const SloTarget = 'slo';
export const SloApName = 'apName';
export const SliApConfigId = 'apConfigId';
export const TimeWindowType = 'timeWindowType';
export const TimeWindowStart = 'timeWindowStart';
export const TimeWindowDuration = 'timeWindowDuration';
export const TimeWindowDurationUnit = 'timeWindowDurationUnit';

// time-window types
export const Fixed = 'fixed';
export const Dynamic = 'dynamic';
export const Rolling = 'rolling';

export function createForm(oldSavedState) {
  const savedState = oldSavedState ?? {
    ...demo
  };

  let form = createMapForm();

  form = form.put(
    SloApName,
    createField({
      value: savedState[SloApName] ?? demo[SloApName]
    })
  );
  form = form.put(
    SliApConfigId,
    createField({
      validator: composeAndShortCircuitOnError(notUndefinedValidator),
      value: savedState[SliApConfigId]
    })
  );
  form = form.put(
    SloTarget,
    createField({
      validator: composeAndShortCircuitOnError(notUndefinedValidator, numericValidator),
      value: savedState[SloTarget] ?? demo[SloTarget]
    })
  );
  form = form.put(
    SliConfigId,
    createField({
      validator: composeAndShortCircuitOnError(notUndefinedValidator, notBlankValidator),
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
    const ts = parsedTimestamp(start?.date + ' ' + start?.time) ?? new Date().getTime();
    form = addFormForStartTimeStamp(form, ts);
  }

  form = form.put(
    TimeWindowDuration,
    createField({
      validator: composeAndShortCircuitOnError(numericValidator),
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
  return form.put(
    TimeWindowStart,
    createMapForm()
      .put(
        'date',
        createField({
          value: formatDate(ts),
          validator: composeValidators(notBlankValidator, dateValidator)
        })
      )
      .put(
        'time',
        createField({
          value: formatTime(ts),
          validator: composeValidators(notBlankValidator, timeValidator)
        })
      )
  );
}
