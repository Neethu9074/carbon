/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { createField } from 'formalistic';

import { stringValidator, numberValidator } from 'in-services/validators/jsonType';
import { composeAndShortCircuitOnError } from 'in-services/validators/compose';
import { notUndefinedValidator } from 'in-services/validators/undefined';
import { notBlankValidator } from 'in-services/validators/string';
import { buildEnumValidator } from 'in-services/validators/enum';
import { t } from 'in-i18n';

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
    message: t(
      'in-custom-dashboards:widgets.metricConfigurator.theProvidedNumberIsInvalidTheValueShouldBeBetween0And9999'
    )
  }
];

export function sloValidator(v) {
  if (v >= 1 || v < 0) {
    return sloValidatorFailureMessage;
  }
}
