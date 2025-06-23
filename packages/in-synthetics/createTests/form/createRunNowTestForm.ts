/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { createField, createMapForm } from 'formalistic';

import { arrayValidator, numberValidator, stringValidator } from 'in-services/validators/jsonType';
import { arrayNotEmptyValidator } from 'in-synthetics/createTests/validators/validator';
import { composeAndShortCircuitOnError } from 'in-services/validators/compose';
import { notUndefinedValidator } from 'in-services/validators/undefined';
import { notBlankValidator } from 'in-services/validators/string';
import { minValidator } from 'in-services/validators/number';

export function createRunNowForm(testLocations: string[], savedState?: Record<string, any>) {
  savedState = savedState ?? {};
  let createTestForm = createMapForm({
    validator: notUndefinedValidator
  })
    .put(
      'locations',
      createField({
        value: savedState?.locations ?? testLocations ?? [],
        validator: composeAndShortCircuitOnError(notUndefinedValidator, arrayValidator, arrayNotEmptyValidator)
      })
    )
    .put('configuration', config(savedState))

    .put(
      'customProperties',
      createField({
        value: savedState?.customProperties ?? {}
      })
    );
  return createTestForm;
}
function config(savedState?: Record<string, any>) {
  return createMapForm()
    .put(
      'timeout',
      createField({
        value: savedState?.timeout ?? '0m',
        validator: composeAndShortCircuitOnError(notUndefinedValidator, stringValidator, notBlankValidator)
      })
    )
    .put(
      'retries',
      createField({
        value: savedState?.retries ?? 0,
        validator: composeAndShortCircuitOnError(numberValidator, minValidator(0))
      })
    );
}
