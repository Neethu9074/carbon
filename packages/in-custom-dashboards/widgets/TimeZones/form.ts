/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { createMapForm, createField, createListForm, ValidationResult, Item, MapForm, Field } from 'formalistic';

import { stringValidator, arrayValidator } from 'in-services/validators/jsonType';
import { composeAndShortCircuitOnError } from 'in-services/validators/compose';
import { notUndefinedValidator } from 'in-services/validators/undefined';
import { isBlank } from 'in-services/util/string';
import { t } from 'in-i18n';

interface TimeZoneConfiguration {
  timeZone?: string;
  label?: string;
}

type TimeZoneSubForm = MapForm<{ timeZone: Field<string>; label: Field<string> }>;

export function createForm(savedState?: TimeZoneConfiguration[]) {
  let listForm = createListForm<TimeZoneSubForm[]>({
    validator: composeAndShortCircuitOnError(
      notUndefinedValidator,
      arrayValidator,
      atLeastOneTimeZoneRequiredValidator
    ),
    items: (savedState || []).map(createTimeZoneSubForm)
  });

  if (!savedState) {
    listForm = listForm.push(createTimeZoneSubForm({ timeZone: 'UTC', label: '' }));
  }

  return listForm;
}

export function createTimeZoneSubForm({ timeZone, label }: TimeZoneConfiguration = {}): TimeZoneSubForm {
  return createMapForm<{}>()
    .put(
      'timeZone',
      createField({
        value: timeZone || 'UTC',
        validator: composeAndShortCircuitOnError(notUndefinedValidator, stringValidator, timeZoneRequired)
      })
    )
    .put(
      'label',
      createField({
        value: label || '',
        validator: composeAndShortCircuitOnError(notUndefinedValidator, stringValidator)
      })
    );
}

function atLeastOneTimeZoneRequiredValidator(items: Item[]): ValidationResult {
  if (items.length > 0) {
    return null;
  }

  return [
    {
      severity: 'error',
      message: t('in-custom-dashboards:widgets.timezones.atLeastOneTimeZoneMustBeConfigured')
    }
  ];
}

function timeZoneRequired(value: string): ValidationResult {
  if (isBlank(value)) {
    return [
      {
        severity: 'error',
        message: t('in-custom-dashboards:widgets.timezones.pleaseSelectATimeZone')
      }
    ];
  }

  return null;
}
