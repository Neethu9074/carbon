import { createField, notBlankValidator } from 'formalistic';

import { composeAndShortCircuitOnError } from 'in-services/validators/compose';
import { notUndefinedValidator } from 'in-services/validators/undefined';
import { stringValidator } from 'in-services/validators/jsonType';
import { buildEnumValidator } from 'in-services/validators/enum';
import { sloValidator } from 'in-services/validators/number';

export function createForm(form, savedState) {
  return form
    .put(
      'sliConfig',
      createField({
        value: (savedState && savedState.sliConfig) || '',
        validator: composeAndShortCircuitOnError(stringValidator, notBlankValidator)
      })
    )
    .put(
      'slo',
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
        value: 'errorBudgetRemaining',
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
