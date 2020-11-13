import { createField, notBlankValidator } from 'formalistic';

import { emptyTagFilterExpression } from 'in-infrastructure/Explore/constants';
import { composeAndShortCircuitOnError } from 'in-services/validators/compose';
import { notUndefinedValidator } from 'in-services/validators/undefined';
import { stringValidator } from 'in-services/validators/jsonType';
import { objectValidator } from 'in-services/validators/jsonType';
import { buildEnumValidator } from 'in-services/validators/enum';
import { aggregationLabels } from 'in-stores/metric';

export function createForm(form, savedState) {
  return form
    .put(
      'tagFilterExpression',
      createField({
        value: (savedState && savedState.tagFilterExpression) || emptyTagFilterExpression,
        validator: composeAndShortCircuitOnError(objectValidator, markerValidator)
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
        value: (savedState && savedState.aggregation) || 'MEAN',
        validator: composeAndShortCircuitOnError(
          notUndefinedValidator,
          stringValidator,
          notBlankValidator,
          buildEnumValidator(Object.keys(aggregationLabels))
        )
      })
    )
    .put(
      'type',
      createField({
        value: (savedState && savedState.type) || '',
        validator: composeAndShortCircuitOnError(notUndefinedValidator, stringValidator, notBlankValidator)
      })
    );
}

export const invalidMarker = { invalid: true };

function markerValidator(value) {
  if (value.invalid) {
    return [{ severity: 'error' }];
  }
}
