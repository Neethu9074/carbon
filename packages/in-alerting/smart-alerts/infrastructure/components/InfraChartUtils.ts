/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { InfraAlertConfigWithMetadata, TimeConfig } from '@instana/types';

// eslint-disable-next-line no-restricted-imports
import { MetricDefinition, getMetricDefinition } from 'in-sdk/metrics';
import { createDefaultChartConfig } from 'in-alerting/components/Chart/chartViewConfig';
import { tagFilter } from 'in-components/QueryBuilder/transformation/tagFilter';
import { NumberFormatterObject } from 'in-services/formatters/number/types';
import { EQUALS } from 'in-components/QueryBuilder/tagFilter/operators';
import { getFormatterId } from 'in-stores/metric/formatters';
import { deepCopy } from 'in-services/util/object';
import { line } from 'in-stores/metric/renderer';
import { TagFilterExpression } from 'in-types';
import { EventOrMap } from 'in-events/types';

interface UnifiedMetricConfigProps {
  alertConfig: InfraAlertConfigWithMetadata;
  event: EventOrMap;
}

export function getUnifiedMetricConfig({ alertConfig, event }: UnifiedMetricConfigProps) {
  const { entityType, metricName, aggregation } = alertConfig.rule;

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
          label: metricLabel,
          metric: metricName,
          source: 'INFRASTRUCTURE_METRICS',
          tagFilterExpression: getFilterGroupExpression(alertConfig, event),
          timeShift: 0,
          type: entityType
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
  const { metricName, aggregation } = alertConfig.rule;

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
          aggregation
        }
      }
    }
  };
}

export function getFilterGroupExpression(alertConfig: InfraAlertConfigWithMetadata, event: EventOrMap) {
  const filterExpression = deepCopy(alertConfig.tagFilterExpression) as TagFilterExpression;
  const groupingTags = event.getIn(['metadata', 'groupingTags'], []);

  groupingTags?.map((tagValue: string, tagKey: string) => {
    const groupExpression = tagFilter(tagKey, EQUALS, tagValue);
    filterExpression.elements.push(groupExpression);
  });

  return filterExpression;
}
