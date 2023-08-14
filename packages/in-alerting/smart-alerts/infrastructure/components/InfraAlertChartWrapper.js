/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { Card } from '@instana/components';

import {
  enhanceNonToggleableSeries,
  enhanceLabels,
  getRendererBasedOnThresholdType,
  legendColors
} from 'in-alerting/components/Chart/AlertingChart';
// eslint-disable-next-line no-restricted-imports
import { useResultData } from 'in-custom-dashboards/widgets/Chart/UnifiedMetricsChart';
// eslint-disable-next-line no-restricted-imports
import { getMetricDefinition } from 'in-sdk/metrics';
import { createDefaultChartConfig } from 'in-alerting/components/Chart/chartViewConfig';
import { getThreshold } from 'in-alerting/components/Chart/AlertingChartWrapper';
import { zeroFillAndClipMetric } from 'in-alerting/components/Chart/chartUtils';
import { valueMissingPlaceholder } from 'in-components/valueMissingPlaceholder';
import { STATIC_THRESHOLD } from 'in-alerting/smart-alerts/data/thresholdTypes';
import { getFormatterId } from 'in-stores/metric/formatters';
import ChartWrapper from 'in-components/Chart/ChartWrapper';
import { finishedProgress } from 'in-services/fixedObjects';
import { number } from 'in-services/formatters/number';
import { line } from 'in-stores/metric/renderer';
import theme from 'in-themes';

export default function ChartData(props) {
  const { alertConfig, timeConfig } = props;
  const { entityType, metricName, aggregation } = alertConfig.rule;
  const { threshold, granularity } = alertConfig;

  const metricDefinition = getMetricDefinition(entityType, metricName);

  const metricLabel = metricDefinition.getLabel();
  // Because the chart config for UnifiedMetricsChart requires a string formatterId (e.g. 'percentage.compact'),
  // which is then internally mapped to the formatter function, we need to do a tiny workaround here and map the formatter
  // function to that ID, just that it's internally mapped back to the function once again.
  const metricFormatterId = getFormatterId(metricDefinition.formatter.detailed);

  const chartConfig = {
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
          tagFilterExpression: alertConfig.tagFilterExpression,
          timeShift: 0,
          type: entityType
        }
      ]
    }
  };

  // only apply zero filling to count metrics
  const requiresZeroFilling = aggregation === 'SUM';

  const chartProps = {
    canReload: undefined,
    customHeight: 182,
    getMetric: () => {},
    granularity: alertConfig.granularity,
    nonInteractive: true,
    postProcessMetric: requiresZeroFilling && zeroFillAndClipMetric,
    thresholdType: 'staticThreshold',
    timeConfig: timeConfig,
    metricsConfiguration: getMetricsConfiguration({ alertConfig, timeConfig }),
    y1: getY1({})
  };

  const resultData = useResultData(chartConfig, alertConfig.granularity, timeConfig);

  const result = resultData.metricResult;
  //   console.log('time --- ', result);
  let resultItem = {};
  if (result.errors.length > 0 || result.progress.loading) {
    return <></>;
  } else {
    // const transformResultId = (result as Result<any>)?.data[0]?.id;
    const transformResult = result?.data[0]?.values;

    resultItem = {
      progress: finishedProgress,
      errors: {},
      time: result.time,
      data: {
        [metricName]: transformResult,
        threshold: getThreshold(chartProps.y1, chartProps.thresholdType, transformResult, timeConfig)
      }
    };
  }

  function getY1(highlight) {
    const metricDefinition = getMetricDefinition(entityType, metricName);

    const metricLabel = metricDefinition.getLabel();
    const formatter = number.forcedCompact;
    const renderer = getRendererBasedOnThresholdType(threshold, highlight, granularity, []);
    return {
      colors: chartColors,
      metricIds: [metricName, 'threshold'],
      // i18n: Violations does not need to be translated, it is an internal name
      excludedLabelsFromTooltip: ['Violations', highlight?.label].filter(Boolean),
      nonToggleableSeries: enhanceNonToggleableSeries(metricName, highlight),
      labels: enhanceLabels(metricLabel),
      tooltipFormatter: value => (value < 0 || value === null ? valueMissingPlaceholder : formatter.detailed(value)),
      formatter: value => formatter.detailed(value),
      renderer,
      icons: {
        types: ['lib_line_chart', 'lib_threshold', 'lib_actions_stop', 'lib_actions_stop'],
        colors: [...legendColors, highlight?.length > 0 ? highlight?.color[0] : undefined].filter(Boolean)
      },
      thresholdGranularity: granularity,
      lineWidth: 1.75,

      // used as additional data:

      threshold: threshold.value,
      operator: threshold.operator,
      sensitivity: threshold.deviationFactor,
      baseline: threshold.baseline,
      eventBasedAdaptiveBaseline: [],
      getMax: computeMax
    };
  }

  function computeMax(metricsMaxValue) {
    if (threshold.type === STATIC_THRESHOLD) {
      return threshold.value >= metricsMaxValue ? Math.max(metricsMaxValue, threshold.value * 1.2) : metricsMaxValue;
    }
  }
  const clone = { ...chartProps, result: resultItem };

  //   console.log('props', clone);

  return (
    <Card title="Metrics">
      <ChartWrapper
        showNoDataInfoWhenEmpty={false}
        {...clone}
        metricsConfiguration={extendMetricConfiguration(chartProps)}
      />
    </Card>
  );
}

function extendMetricConfiguration(props) {
  return {
    ...props.metricsConfiguration,
    metrics: {
      ...props.metricsConfiguration.metrics,
      threshold: { metric: 'threshold' }
    }
  };
}

const chartColors = [theme.lib.colors.lightBlue800, theme.lib.colors.red800];

export function getMetricsConfiguration({ alertConfig, timeConfig }) {
  const { granularity } = alertConfig;
  const { metricName, aggregation } = alertConfig.rule;

  const chartViewConfig = createDefaultChartConfig(timeConfig);
  //   console.log('chartViewConfig ', chartViewConfig);

  return {
    tagFilterExpression: { elements: [], logicalOperator: 'AND', type: 'EXPRESSION' },
    includeInternal: undefined,
    includeSynthetic: undefined,
    timeConfig: chartViewConfig.timeConfig,
    metrics: {
      [metricName]: {
        metric: metricName,
        granularity: granularity,
        aggregation,
        tagFilterExpression: null
      }
    }
  };
}
