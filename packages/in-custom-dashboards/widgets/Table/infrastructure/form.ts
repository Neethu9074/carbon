/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { createField, notBlankValidator } from 'formalistic';

import { defaultTableSize } from 'in-custom-dashboards/widgets/Table/infrastructure/components/TableSizeConfigurator';
import { TableFormConfiguration } from 'in-custom-dashboards/widgets/Table/types';
import { composeAndShortCircuitOnError } from 'in-services/validators/compose';
import { getMetricKey } from 'in-infrastructure/Explore/services/metrics';
import { notUndefinedValidator } from 'in-services/validators/undefined';
import { defaultOrder } from 'in-infrastructure/Explore/constants';
import { arrayValidator } from 'in-services/validators/jsonType';
import { MetricItem } from './InfrastructureTableWidget';

export const aggregation = 'aggregation';
export const crossSeriesAggregation = 'crossSeriesAggregation';
export const entityType = 'entityType';
export const grouping = 'grouping';
export const metric = 'metric';
export const datasets = 'datasets';
export const metricLabel = 'metricLabel';
export const sorting = 'sorting';
export const source = 'source';
export const tableSize = 'tableSize';
export const tagFilterExpression = 'tagFilterExpression';
export const countGroup = 'countGroup';
export const showGroupsWithMissingTags = 'showGroupsWithMissingTags';

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
    value: migrateSorting(savedState),
    validator: composeAndShortCircuitOnError(notUndefinedValidator)
  });
}

export function createCountGroupField(savedState: Partial<TableFormConfiguration>) {
  return createField({
    value: Boolean(savedState.countGroup ?? true),
    validator: composeAndShortCircuitOnError(notUndefinedValidator)
  });
}

export function createShowGroupsWithMissingTagsField(savedState: Partial<TableFormConfiguration>) {
  return createField({
    value: Boolean(savedState.showGroupsWithMissingTags ?? false),
    validator: composeAndShortCircuitOnError(notUndefinedValidator)
  });
}

function migrateSorting(savedState: Partial<TableFormConfiguration>) {
  if (!savedState || !savedState.sorting) {
    return defaultOrder;
  }
  const metricKeys = savedState.datasets?.metrics?.map((m: MetricItem) =>
    getMetricKey(m.metric, m.aggregation, m.crossSeriesAggregation)
  );
  if (metricKeys.includes(savedState.sorting.by)) {
    return savedState.sorting;
  }
  for (const metric of metricKeys) {
    if (metric.startsWith(savedState.sorting.by)) {
      return {
        by: metric,
        direction: savedState.sorting.direction
      };
    }
  }
  return savedState.sorting;
}
