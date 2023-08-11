/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { createField, notBlankValidator } from 'formalistic';

import { defaultTableSize } from 'in-custom-dashboards/widgets/Table/infrastructure/components/TableSizeConfigurator';
import { TableFormConfiguration } from 'in-custom-dashboards/widgets/Table/types';
import { composeAndShortCircuitOnError } from 'in-services/validators/compose';
import { notUndefinedValidator } from 'in-services/validators/undefined';
import { arrayValidator } from 'in-services/validators/jsonType';

export function createGroupField(savedState: Partial<TableFormConfiguration>) {
  return createField({
    value: (savedState && savedState?.grouping) || [],
    validator: composeAndShortCircuitOnError(notUndefinedValidator, arrayValidator)
  });
}

export function createEntityField(savedState: Partial<TableFormConfiguration>) {
  return createField({
    value: (savedState && savedState.entityType) || '',
    validator: composeAndShortCircuitOnError(notUndefinedValidator, notBlankValidator)
  });
}

export function createTableSizeField(savedState: Partial<TableFormConfiguration>) {
  return createField({
    value: (savedState && savedState.tableSize) || defaultTableSize,
    validator: composeAndShortCircuitOnError(notUndefinedValidator)
  });
}
