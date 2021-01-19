/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { createField, notBlankValidator } from 'formalistic';

import { stringValidator, numberValidator } from 'in-services/validators/jsonType';
import { composeAndShortCircuitOnError } from 'in-services/validators/compose';
import { notUndefinedValidator } from 'in-services/validators/undefined';
import { buildEnumValidator } from 'in-services/validators/enum';

export function createForm(form, savedState) {
  return form
    .put(
      'sliConfigId',
      createField({
        value: (savedState && savedState.sliConfigId) || '',
        validator: composeAndShortCircuitOnError(stringValidator, notBlankValidator)
      })
    )
    .put(
      'slo',
      createField({
        value: (savedState && savedState.slo) || '',
        validator: composeAndShortCircuitOnError(notUndefinedValidator, numberValidator, sloValidator)
      })
    )
    .put(
      'metric',
      createField({
        value: (savedState && savedState.metric) || '',
        validator: composeAndShortCircuitOnError(notUndefinedValidator, stringValidator, notBlankValidator)
      })
    )
    .put(
      'aggregation',
      createField({
        // Aggregation selection not necessary because there is only one metric.
        // Therefore hard coded
        value: 'MEAN',
        validator: composeAndShortCircuitOnError(
          notUndefinedValidator,
          stringValidator,
          notBlankValidator,
          buildEnumValidator(['MEAN'])
        )
      })
    );
}

const sloValidatorFailureMessage = [
  {
    severity: 'error',
    message: `The provided number is invalid. The value should be between 0 and 99.99.`
  }
];

export function sloValidator(v) {
  if (v >= 1 || v < 0) {
    return sloValidatorFailureMessage;
  }
}
