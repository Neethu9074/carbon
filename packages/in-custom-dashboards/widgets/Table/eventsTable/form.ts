/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { MapForm, createField } from 'formalistic';

import { arrayNotEmptyValidator } from 'in-custom-dashboards/widgets/Table/eventsTable/validators/validator';
import { arrayValidator, stringValidator } from 'in-services/validators/jsonType';
import { TableFormConfiguration } from 'in-custom-dashboards/widgets/Table/types';
import { composeAndShortCircuitOnError } from 'in-services/validators/compose';
import { notUndefinedValidator } from 'in-services/validators/undefined';

export function createForm(form: MapForm<any>, savedState: Partial<TableFormConfiguration>) {
  return form
    .put(
      'dynamicFocusQuery',
      createField<string>({
        value: (savedState && savedState.dynamicFocusQuery) || '',
        validator: composeAndShortCircuitOnError(stringValidator)
      })
    )
    .put(
      'columns',
      createField<string[]>({
        value: (savedState?.columns ?? ['title', 'entityLabel']) as string[],
        validator: composeAndShortCircuitOnError<string[]>(
          notUndefinedValidator,
          arrayValidator,
          arrayNotEmptyValidator
        )
      })
    );
}
