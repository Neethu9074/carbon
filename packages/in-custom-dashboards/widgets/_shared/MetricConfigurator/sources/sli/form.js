import { createField, notBlankValidator } from 'formalistic';

import { composeAndShortCircuitOnError } from 'in-services/validators/compose';
import { notUndefinedValidator } from 'in-services/validators/undefined';
import { stringValidator } from 'in-services/validators/jsonType';
import { buildEnumValidator } from 'in-services/validators/enum';

export function createForm(form, savedState) {
  return form
    .put(
      'SLIConfigId',
      createField({
        value: (savedState && savedState.SLIConfigId) || '',
        validator: composeAndShortCircuitOnError(stringValidator, notBlankValidator)
      })
    )
    .put(
      'SLO',
      createField({
        value: (savedState && savedState.slo) || '',
        validator: composeAndShortCircuitOnError(notBlankValidator, sloValidator)
      })
    )
    .put(
      'metric',
      createField({
        // Metric selection not necessary because there is only one metric.
        // Therefore hard coded
        value: (savedState && savedState.metric) || '',
        validator: composeAndShortCircuitOnError(notUndefinedValidator, stringValidator, notBlankValidator)
      })
    )
    .put(
      'aggregation',
      createField({
        // Aggregation selection not necessary because there is only one metric.
        // Therefore hard coded
        value: 'DISTINCT_COUNT',
        validator: composeAndShortCircuitOnError(
          notUndefinedValidator,
          stringValidator,
          notBlankValidator,
          buildEnumValidator(['DISTINCT_COUNT'])
        )
      })
    );
}

const sloValidatorFailureMessage = [
  {
    severity: 'error',
    message: `The provided number is invalid. The value should be a decimal between 0 and 1`
  }
];

export function sloValidator(v) {
  try {
    const num = Number(v);
    if (isNaN(num) || num > 1 || num < 0) {
      return sloValidatorFailureMessage;
    }
    return null;
  } catch (e) {
    return sloValidatorFailureMessage;
  }
}

export const ServiceLevelIndicators = {
  ERROR_BUDGET_REMAINING: 'Error Budget Remaining',
  SLI: 'SLI'
};
