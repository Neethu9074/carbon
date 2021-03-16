/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { createField } from 'formalistic';

import { composeAndShortCircuitOnError } from 'in-services/validators/compose';
import { notUndefinedValidator } from 'in-services/validators/undefined';
import { arrayValidator } from 'in-services/validators/jsonType';

export function createForm(form, savedState) {
  const tagFilters = savedState?.tagFilters ?? [];
  return form.put(
    'tagFilters',
    createField({
      // Not the best formalistic style, but since we do not need any validation on
      // tag filters and since all tag filter components directly operate on the raw
      // data structure, this is easier to do.
      value: tagFilters,
      validator: composeAndShortCircuitOnError(notUndefinedValidator, arrayValidator)
    })
  );
}
