/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { isArray } from 'lodash';

import {
  Granularity,
  InfraAlertRuleUnion,
  TagFilterExpression,
  TagFilterExpressionElementUnion,
  TimeConfig
} from '@instana/types';

// eslint-disable-next-line no-restricted-imports
import { MetricDefinition, getMetricDefinition } from 'in-sdk/metrics';
import { InfraSmartAlertConfigWithMetadata } from 'in-alerting/smart-alerts/infrastructure/form/infraAlertConfigTypes';
import { Tags } from 'in-alerting/smart-alerts/infrastructure/dialog/advanced/ThresholdSelectionInteractiveChart';
import { addTagFilters } from 'in-components/QueryBuilder/transformation/backendQueryModel';
import { createDefaultChartConfig } from 'in-alerting/components/Chart/chartViewConfig';
import { tagFilter } from 'in-components/QueryBuilder/transformation/tagFilter';
import { NumberFormatterObject } from 'in-services/formatters/number/types';
import { EQUALS } from 'in-components/QueryBuilder/tagFilter/operators';
import { getFormatterId } from 'in-stores/metric/formatters';
import { line } from 'in-stores/metric/renderer';
import { minutes } from 'in-services/time';

export const chartTimeConfig = {
  autoRefresh: false,
  to: Date.now(),
  windowSize: minutes.toMillis(30),
  focusedMoment: Date.now()
};

export const sparkChartGranularity = minutes.toMillis(30);

export function getEnrichedTagFilterExpression(
  tagFilterExpression: TagFilterExpressionElementUnion,
  selectedMetricGroup: Tags | undefined
) {
  if (selectedMetricGroup) {
    const groupingTFE: TagFilterExpression = { type: 'EXPRESSION', logicalOperator: 'AND', elements: [] };

    Object.keys(selectedMetricGroup).forEach(function (key: any) {
      const groupExpression = tagFilter(key, EQUALS, selectedMetricGroup[key]);
      groupingTFE.elements.push(groupExpression);
    });

    if ('elements' in tagFilterExpression) {
      tagFilterExpression = addTagFilters(tagFilterExpression, [groupingTFE]);
    } else {
      tagFilterExpression = {
        type: 'EXPRESSION',
        logicalOperator: 'AND',
        elements: isArray(tagFilterExpression)
          ? [...tagFilterExpression, groupingTFE]
          : [tagFilterExpression, groupingTFE]
      };
    }
  } else if (!('elements' in tagFilterExpression)) {
    tagFilterExpression = {
      type: 'EXPRESSION',
      logicalOperator: 'AND',
      elements: isArray(tagFilterExpression) ? [...tagFilterExpression] : [tagFilterExpression]
    };
  }
  return tagFilterExpression;
}

export function getUnifiedMetricConfig(
  alertRule: InfraAlertRuleUnion,
  enrichedTagFilterExpression: TagFilterExpressionElementUnion,
  granularity: Granularity
) {
  const { entityType, metricName, aggregation, crossSeriesAggregation, regex } = alertRule;

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
    granularity,
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
          tagFilterExpression: enrichedTagFilterExpression,
          timeShift: 0,
          type: entityType,
          regex
        }
      ]
    }
  };
}

interface ChartConfigProps {
  alertConfig: InfraSmartAlertConfigWithMetadata;
  timeConfig: TimeConfig;
}

export function getChartConfig({ alertConfig, timeConfig }: ChartConfigProps) {
  const { granularity } = alertConfig;
  const { metricName, aggregation, regex } = alertConfig.rule;

  const chartViewConfig = createDefaultChartConfig(timeConfig);

  return {
    customHeight: 182,
    thresholdType: 'staticThreshold',
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
        },
        warningThreshold: {
          metric: 'warningThreshold'
        },
        criticalThreshold: {
          metric: 'criticalThreshold'
        }
      }
    }
  };
}
