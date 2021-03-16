/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import { metric as metricType } from 'in-new-components/AnalyzeView/fieldTypes';
import { emptyArray } from 'in-services/fixedObjects';

export const groupName = 'name';

export function getSingleNumberMetricId({ metricId, aggregationId }) {
  return metricId + '_' + aggregationId;
}

export function getSparkChartTimeSeriesMetricId({ metricId, aggregationId }) {
  return metricId + '_' + aggregationId + '_sparkChart';
}

export function getAvailableMetrics({ metricCatalog, metricCatalogFilter, fixedFields }) {
  return (
    metricCatalog
      ?.filter(metricDescription => metricCatalogFilter?.(metricDescription) ?? true)
      .map(metric => {
        // Remove aggregations of fixed metrics
        const fixedAggregations = fixedFields
          .filter(f => f.type === metricType && f.metricId === metric.metricId)
          .map(f => f.aggregationId);
        const aggregations = metric.aggregations
          .filter(a => !fixedAggregations.includes(a))
          .sort((agg1, agg2) => agg1.localeCompare(agg2));
        return aggregations.length > 0
          ? {
              metric: metric.metricId,
              label: metric.label,
              description: metric.description,
              aggregations: aggregations
            }
          : null;
      })
      .filter(Boolean) || emptyArray
  );
}
