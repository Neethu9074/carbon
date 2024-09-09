/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { createMapForm, createField, composeValidators, ValidationResult, MapForm, Field } from 'formalistic';
import { isValid, parse } from 'date-fns';
import { isArray } from 'lodash';

import { dateTimeFormat, formatDate, formatTime, parseDateTime } from 'in-services/formatters/date';
import { numericValidator, positiveNumberValidator } from 'in-services/validators/number';
import { MonitoringSource } from 'in-custom-dashboards/widgets/SloLegacy/constants';
import { numberValidator, stringValidator } from 'in-services/validators/jsonType';
import { composeAndShortCircuitOnError } from 'in-services/validators/compose';
import { dateValidator, timeValidator } from 'in-services/validators/date';
import { notUndefinedValidator } from 'in-services/validators/undefined';
import { notBlankValidator } from 'in-services/validators/string';
import { t } from 'in-i18n';

// internal fields just for app-config information used internally
export const apConfigId = 'apConfigId';

export const entityType = 'entityType';
export const entityId = 'entityId';
export const sloTarget = 'slo';
export const sliConfigId = 'sliConfigId';
export const timeWindowType = 'timeWindowType';
export const timeWindowStart = 'timeWindowStart';
export const timeWindowDuration = 'timeWindowDuration';
export const timeWindowDurationUnit = 'timeWindowDurationUnit';

export type TimeWindowDuration = 'days' | 'weeks' | 'months';
export type TimeWindowType = 'fixed' | 'rolling' | 'dynamic';

export interface SloWidgetConfiguration {
  entityType: MonitoringSource; // old schema configs might not have this set, it defaults to 'Applications'
  entityId: string; // old schema configs might not have this set and use apConfigId instead

  slo: number;
  sliConfigId: string;
  timeWindowType: TimeWindowType;

  // timeWindowType = 'fixed'
  timeWindowStart?: {
    date: string;
    time: string;
  };

  // timeWindowType = 'fixed' | 'rolling'
  timeWindowDuration?: number;
  timeWindowDurationUnit?: TimeWindowDuration;

  // deprecated
  apConfigId?: string;
}

export function createForm(oldSavedState: Partial<SloWidgetConfiguration> = {}): MapForm<any> {
  const savedState = ensureConfigBackwardCompatibility(oldSavedState);

  let form: MapForm<any> = createMapForm({
    validator: validateTimeWindow
  });

  form = form
    .put(
      entityType,
      createField({
        validator: composeAndShortCircuitOnError(notUndefinedValidator, stringValidator, notBlankValidator),
        value: savedState[entityType]
      })
    )
    .put(
      entityId,
      createField({
        validator: composeAndShortCircuitOnError(notUndefinedValidator, stringValidator, notBlankValidator),
        value: savedState[entityId]
      })
    )
    .put(
      sloTarget,
      createField({
        validator: composeAndShortCircuitOnError(notUndefinedValidator, numberValidator, sloValidator),
        value: savedState[sloTarget]
      })
    )
    .put(
      sliConfigId,
      createField({
        validator: composeAndShortCircuitOnError(notUndefinedValidator, stringValidator, notBlankValidator),
        value: savedState[sliConfigId]
      })
    );
  const windowType = savedState[timeWindowType] ?? 'dynamic';
  form = form.put(
    timeWindowType,
    createField({
      value: windowType
    })
  );
  if (windowType === 'fixed') {
    const start = savedState[timeWindowStart];
    // auto-corrects invalid dates:
    const ts = parseTimestamp(start?.date + ' ' + start?.time);
    form = addFormForStartTimeStamp(form, ts);
  }
  if (windowType === 'fixed' || windowType === 'rolling') {
    form = addFormForTimeDuration(form, savedState);
  }
  return form;
}

interface TimeWindowForm {
  timeWindowDuration?: Field<number>;
  timeWindowDurationUnit?: Field<TimeWindowDuration>;
}
function validateTimeWindow({ timeWindowDuration, timeWindowDurationUnit }: TimeWindowForm): ValidationResult {
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

function getTimeWindowDurationInDays(value: number, unit: TimeWindowDuration): number {
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

export const parseTimestamp = (str: string, strFormat: string = dateTimeFormat): number | null => {
  if (!isValid(parse(str, strFormat, new Date()))) {
    return null;
  }

  return parseDateTime(str).getTime();
};

export function removeFormForStartTimeStamp(form: MapForm<any>): MapForm<any> {
  if (form.containsKey(timeWindowStart)) {
    return form.remove(timeWindowStart);
  }
  return form;
}

export function addFormForStartTimeStamp(form: MapForm<any>, ts?: number | null): MapForm<any> {
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

export function removeFormForTimeDuration(form: MapForm<any>): MapForm<any> {
  if (form.containsKey(timeWindowDuration)) {
    form = form.remove(timeWindowDuration);
  }
  if (form.containsKey(timeWindowDurationUnit)) {
    form = form.remove(timeWindowDurationUnit);
  }
  return form;
}

export function addFormForTimeDuration(
  form: MapForm<any>,
  savedState: Partial<SloWidgetConfiguration>,
  override = true
): MapForm<any> {
  if (override || !form.containsKey(timeWindowDuration))
    form = form.put(
      timeWindowDuration,
      createField({
        validator: composeAndShortCircuitOnError(numericValidator, positiveNumberValidator),
        value: savedState[timeWindowDuration] ?? 1
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

export function ensureConfigBackwardCompatibility<C extends Partial<SloWidgetConfiguration>>(savedForm: C): C {
  const id = savedForm[entityId] ?? savedForm[apConfigId];
  const type = savedForm[entityType] ?? 'application';

  return {
    ...savedForm,
    [entityType]: type,
    [entityId]: id
  };
}

export function getMaxTimeWindowDurationValue(unit: TimeWindowDuration): number {
  switch (unit) {
    case 'days':
      return 365;
    case 'weeks':
      return 52;
    case 'months':
    default:
      return 12;
  }
}

const sloValidatorFailureMessage: ValidationResult = [
  {
    severity: 'error',
    message: t(
      'in-custom-dashboards:widgets.metricConfigurator.theProvidedNumberIsInvalidTheValueShouldBeBetween0And9999'
    )
  }
];

export function sloValidator(v?: number): ValidationResult {
  if (v == null) return;

  if (v >= 1 || v < 0) {
    return sloValidatorFailureMessage;
  }
  return;
}

/**
 * @deprecated - formalistic v2 now supports generics out of the box
 */
export function getField<T>(form: MapForm<any>, path: string[] | string): Field<T> | undefined {
  // @ts-expect-error this needs to be removed anyway
  const item = isArray(path) ? form.getIn(path) : form.get(path);
  return item as Field<T> | undefined;
}
