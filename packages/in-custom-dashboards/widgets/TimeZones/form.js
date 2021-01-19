/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { createMapForm, createField, createListForm } from 'formalistic';

import { stringValidator, arrayValidator } from 'in-services/validators/jsonType';
import { composeAndShortCircuitOnError } from 'in-services/validators/compose';
import { notUndefinedValidator } from 'in-services/validators/undefined';
import { isBlank } from 'in-services/util/string';

export function createForm(savedState) {
  let listForm = createListForm({
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

export function createTimeZoneSubForm({ timeZone, label } = {}) {
  return createMapForm()
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

function atLeastOneTimeZoneRequiredValidator(items) {
  if (items.length > 0) {
    return null;
  }

  return [
    {
      severity: 'error',
      message: 'At least one time zone must be configured.'
    }
  ];
}

function timeZoneRequired(value) {
  if (isBlank(value)) {
    return [
      {
        severity: 'error',
        message: 'Please select a time zone.'
      }
    ];
  }

  return null;
}
