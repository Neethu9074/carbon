/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { createContext, useContext } from 'react';
import { isEqual } from 'lodash';

import { TagFilterExpressionElementUnion, UnifiedMetricConfiguration } from '@instana/types';

import { EMPTY_EXPRESSION } from 'in-components/QueryBuilder/transformation/backendQueryModel';
import { fromBackendModel } from 'in-components/QueryBuilder/transformation/formModel';

export const FilterContext = createContext<TagFilterExpressionElementUnion>(EMPTY_EXPRESSION);

export function useFormModelFilterContext() {
  return fromBackendModel(useContext(FilterContext));
}

export function useFilterContext() {
  return useContext(FilterContext);
}

interface FilterableMetricConfiguration extends UnifiedMetricConfiguration {
  tagFilterExpression: TagFilterExpressionElementUnion;
}

export function useFilteredMetricConfiguration<T extends UnifiedMetricConfiguration | FilterableMetricConfiguration>(
  metricConfiguration: T
): T {
  const filterExpression = useFilterContext();
  return getFilteredConfiguration(metricConfiguration, filterExpression);
}

export function getFilteredConfiguration<T extends UnifiedMetricConfiguration | FilterableMetricConfiguration>(
  metricConfiguration: T,
  filterExpression: TagFilterExpressionElementUnion
): T {
  if (!('tagFilterExpression' in metricConfiguration) || isEqual(filterExpression, EMPTY_EXPRESSION)) {
    return metricConfiguration;
  }
  if (isEqual(metricConfiguration.tagFilterExpression, EMPTY_EXPRESSION)) {
    return {
      ...metricConfiguration,
      tagFilterExpression: filterExpression
    };
  }
  return {
    ...metricConfiguration,
    tagFilterExpression: {
      type: 'EXPRESSION',
      logicalOperator: 'AND',
      elements: [metricConfiguration.tagFilterExpression, filterExpression]
    }
  };
}
