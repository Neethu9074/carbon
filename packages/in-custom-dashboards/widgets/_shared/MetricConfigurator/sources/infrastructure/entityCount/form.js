/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { createField, notBlankValidator } from 'formalistic';

import { composeAndShortCircuitOnError } from 'in-services/validators/compose';
import { notUndefinedValidator } from 'in-services/validators/undefined';
import { stringValidator } from 'in-services/validators/jsonType';
import { buildEnumValidator } from 'in-services/validators/enum';

export function createForm(form, savedState) {
  return form
    .put(
      'dynamicFocusQuery',
      createField({
        value: (savedState && savedState.dynamicFocusQuery) || '',
        validator: composeAndShortCircuitOnError(notUndefinedValidator, stringValidator, notBlankValidator)
      })
    )
    .put(
      'metric',
      createField({
        // Metric selection not necessary because there is only one metric.
        // Therefore hard coded
        value: 'count',
        validator: composeAndShortCircuitOnError(
          notUndefinedValidator,
          stringValidator,
          notBlankValidator,
          buildEnumValidator(['count'])
        )
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
