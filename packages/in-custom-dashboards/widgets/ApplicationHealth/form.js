/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { createMapForm, createField, createListForm } from 'formalistic';

import { stringValidator, arrayValidator } from 'in-services/validators/jsonType';
import { composeAndShortCircuitOnError } from 'in-services/validators/compose';
import { notUndefinedValidator } from 'in-services/validators/undefined';
import { isBlank } from 'in-services/util/string';
import { t } from 'in-i18n';

export function createForm(savedState) {
  let listForm = createListForm({
    validator: composeAndShortCircuitOnError(
      arrayValidator,
      notUndefinedValidator,
      atLeastOneApplicationRequiredValidator
    ),
    items: (savedState || []).map(createApplicationHealthForm)
  });
  if (!savedState) {
    listForm = listForm.push(createApplicationHealthForm({ id: '', label: '' }));
  }
  return listForm;
}

export function createApplicationHealthForm({ id, label } = {}) {
  return createMapForm()
    .put(
      'label',
      createField({
        value: label || '',
        validator: composeAndShortCircuitOnError(notUndefinedValidator, stringValidator, applicationRequired)
      })
    )
    .put(
      'id',
      createField({
        value: id || '',
        validator: composeAndShortCircuitOnError(notUndefinedValidator, stringValidator, applicationRequired)
      })
    );
}

function atLeastOneApplicationRequiredValidator(items) {
  if (items.length > 0) {
    return null;
  }

  return [
    {
      severity: 'error',
      message: 'At least one application must be selected.'
    }
  ];
}

function applicationRequired(value) {
  if (isBlank(value)) {
    return [
      {
        severity: 'error',
        message: t('in-custom-dashboards:widgets.applicationHealth.form.validationError')
      }
    ];
  }

  return null;
}
