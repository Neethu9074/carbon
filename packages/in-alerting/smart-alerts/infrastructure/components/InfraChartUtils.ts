/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { InfraAlertConfigWithMetadata, TimeConfig } from '@instana/types';

// eslint-disable-next-line no-restricted-imports
import { MetricDefinition, getMetricDefinition } from 'in-sdk/metrics';
import { Tags } from 'in-alerting/smart-alerts/infrastructure/dialog/advanced/ThresholdSelectionInteractiveChart';
import { addTagFilters } from 'in-components/QueryBuilder/transformation/backendQueryModel';
import { createDefaultChartConfig } from 'in-alerting/components/Chart/chartViewConfig';
import { tagFilter } from 'in-components/QueryBuilder/transformation/tagFilter';
import { NumberFormatterObject } from 'in-services/formatters/number/types';
import { EQUALS } from 'in-components/QueryBuilder/tagFilter/operators';
import { getFormatterId } from 'in-stores/metric/formatters';
import { line } from 'in-stores/metric/renderer';

interface UnifiedMetricConfigProps {
  alertConfig: InfraAlertConfigWithMetadata;
  selectedMetricGroup?: Tags;
}

export function getUnifiedMetricConfig({ alertConfig, selectedMetricGroup }: UnifiedMetricConfigProps) {
  const { entityType, metricName, aggregation, crossSeriesAggregation, regex } = alertConfig.rule;
  let { tagFilterExpression } = alertConfig;

  if (selectedMetricGroup) {
    tagFilterExpression = addTagFilters(tagFilterExpression, Object.entries(selectedMetricGroup).map(([k, v]) => tagFilter(k, EQUALS, v)));
  }

  const metricDefinition = getMetricDefinition(entityType, metricName);
  const metricLabel = metricDefinition.getLabel();

  // Because the chart config for UnifiedMetricsChart requires a string formatterId (e.g. 'percentage.compact'),
  // which is then internally mapped to the formatter function, we need to do a tiny workaround here and map the formatter
  // function to that ID, just that it's internally mapped back to the function once again.
  const metricFormatterId = getFormatterId(
    ((metricDefinition as MetricDefinition).formatter as NumberFormatterObject).detailed
  );

  return {
    type: 'TIME_SERIES',
    granularity: alertConfig.granularity,
    y1: {
      formatter: metricFormatterId,
      min: 0,
      renderer: line.id,
      metrics: [
        {
          aggregation: aggregation,
          crossSeriesAggregation: crossSeriesAggregation,
          label: metricLabel,
          metric: metricName,
          source: 'INFRASTRUCTURE_METRICS',
          tagFilterExpression: tagFilterExpression,
          timeShift: 0,
          type: entityType,
          regex
        }
      ]
    }
  };
}

interface ChartConfigProps {
  alertConfig: InfraAlertConfigWithMetadata;
  timeConfig: TimeConfig;
}

export function getChartConfig({ alertConfig, timeConfig }: ChartConfigProps) {
  const { threshold, granularity } = alertConfig;
  const { metricName, aggregation, regex } = alertConfig.rule;

  const chartViewConfig = createDefaultChartConfig(timeConfig);

  return {
    customHeight: 182,
    thresholdType: threshold.type,
    timeConfig: timeConfig,
    metricsConfiguration: {
      timeConfig: chartViewConfig.timeConfig,
      metrics: {
        [metricName]: {
          metric: metricName,
          granularity,
          aggregation,
          regex
        },
        ['violations']: {
          metric: 'violations',
          aggregation: undefined
        },
        ['predictions']: {
          metric: 'predictions',
          granularity,
          aggregation
        },
        ['lowerBound']: {
          metric: 'lowerBound',
          granularity,
          aggregation
        },
        ['upperBound']: {
          metric: 'upperBound',
          granularity,
          aggregation
        }
      }
    }
  };
}
