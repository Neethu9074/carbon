/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { createField, notBlankValidator } from 'formalistic';

import { defaultTableSize } from 'in-custom-dashboards/widgets/Table/infrastructure/components/TableSizeConfigurator';
// @ts-expect-error
import { defaultOrder } from 'in-infrastructure/Explore/constants';
import { TableFormConfiguration } from 'in-custom-dashboards/widgets/Table/types';
import { composeAndShortCircuitOnError } from 'in-services/validators/compose';
import { notUndefinedValidator } from 'in-services/validators/undefined';
import { arrayValidator } from 'in-services/validators/jsonType';

export const aggregation = 'aggregation';
export const entityType = 'entityType';
export const grouping = 'grouping';
export const metric = 'metric';
export const datasets = 'datasets';
export const metricLabel = 'metricLabel';
export const sorting = 'sorting';
export const source = 'source';
export const tableSize = 'tableSize';
export const tagFilterExpression = 'tagFilterExpression';

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

export function createSortingField(savedState: Partial<TableFormConfiguration>) {
  return createField({
    value: (savedState && savedState.sorting) || defaultOrder,
    validator: composeAndShortCircuitOnError(notUndefinedValidator)
  });
}
