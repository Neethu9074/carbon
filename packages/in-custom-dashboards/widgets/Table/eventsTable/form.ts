/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { createField } from 'formalistic';

import { arrayNotEmptyValidator } from 'in-custom-dashboards/widgets/Table/eventsTable/validators/validator';
import { arrayValidator, stringValidator } from 'in-services/validators/jsonType';
import { TableFormConfiguration } from 'in-custom-dashboards/widgets/Table/types';
import { composeAndShortCircuitOnError } from 'in-services/validators/compose';
import { notUndefinedValidator } from 'in-services/validators/undefined';

export function createDynamicFocusQueryField(savedState: Partial<TableFormConfiguration>) {
  return createField<string>({
    value: (savedState && savedState.dynamicFocusQuery) || '',
    validator: composeAndShortCircuitOnError(stringValidator)
  });
}

export function createColumnsField(savedState: Partial<TableFormConfiguration>) {
  return createField<string[]>({
    value: (savedState?.columns ?? ['title', 'entityLabel']) as string[],
    validator: composeAndShortCircuitOnError<string[]>(notUndefinedValidator, arrayValidator, arrayNotEmptyValidator)
  });
}

export function createColumnsFieldForKubernetes(savedState: Partial<TableFormConfiguration>) {
  return createField<string[]>({
    value: (savedState?.columns ?? ['type', 'reason']) as string[],
    validator: composeAndShortCircuitOnError<string[]>(notUndefinedValidator, arrayValidator, arrayNotEmptyValidator)
  });
}
