/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { createField, createMapForm, Field, MapForm } from 'formalistic';

import { arrayNotEmptyValidator } from 'in-custom-dashboards/widgets/Table/eventsTable/validators/validator';
import { arrayValidator, stringValidator } from 'in-services/validators/jsonType';
import { composeAndShortCircuitOnError } from 'in-services/validators/compose';
import { notUndefinedValidator } from 'in-services/validators/undefined';

export interface TableSubConfiguration {
  dynamicFocusQuery?: string;
  columns?: string[];
}
export function createForm(savedState: TableSubConfiguration | undefined): MapForm<{
  dynamicFocusQuery: Field<string>;
  columns: Field<string[]>;
}> {
  return createMapForm({
    items: {
      dynamicFocusQuery: createField<string>({
        value: (savedState && savedState.dynamicFocusQuery) || '',
        validator: composeAndShortCircuitOnError(stringValidator)
      }),
      columns: createField<string[]>({
        value: (savedState?.columns ?? []) as string[],
        validator: composeAndShortCircuitOnError<string[]>(
          notUndefinedValidator,
          arrayValidator,
          arrayNotEmptyValidator
        )
      })
    }
  });
}
