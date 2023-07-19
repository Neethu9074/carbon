/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { createField, createMapForm } from 'formalistic';

import { arrayNotEmptyValidator } from 'in-custom-dashboards/widgets/Table/eventsTable/validators/validator';
import { arrayValidator, stringValidator } from 'in-services/validators/jsonType';
import { composeAndShortCircuitOnError } from 'in-services/validators/compose';
import { notUndefinedValidator } from 'in-services/validators/undefined';

interface TableSubConfiguration {
  dynamicFocusQuery?: string;
  columns?: string[];
}
export function createForm(savedState: TableSubConfiguration) {
  return createMapForm()
    .put(
      'dynamicFocusQuery',
      createField({
        value: (savedState && savedState.dynamicFocusQuery) || '',
        validator: composeAndShortCircuitOnError(stringValidator)
      })
    )
    .put(
      'columns',
      createField({
        value: savedState?.columns ?? [],
        validator: composeAndShortCircuitOnError(notUndefinedValidator, arrayValidator, arrayNotEmptyValidator)
      })
    );
}
