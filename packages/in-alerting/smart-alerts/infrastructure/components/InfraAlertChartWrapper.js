/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { Card } from '@instana/components';

// eslint-disable-next-line no-restricted-imports
import { useResultData } from 'in-custom-dashboards/widgets/Chart/UnifiedMetricsChart';
import {
  getUnifiedMetricConfig,
  getChartConfig
} from 'in-alerting/smart-alerts/infrastructure/components/InfraChartUtils';
import { getThreshold, extendMetricConfiguration } from 'in-alerting/components/Chart/AlertingChartWrapper';
// eslint-disable-next-line no-restricted-imports
import { getMetricDefinition } from 'in-sdk/metrics';
import { getRendererBasedOnThresholdType, getY1 } from 'in-alerting/components/Chart/AlertingChart';
import { createDefaultChartConfig } from 'in-alerting/components/Chart/chartViewConfig';
import { finishedProgress, indeterminateProgress } from 'in-services/fixedObjects';
import { number, percentage } from 'in-services/formatters/number';
import { getFormatterId } from 'in-stores/metric/formatters';
import ChartWrapper from 'in-components/Chart/ChartWrapper';
import { line } from 'in-stores/metric/renderer';

export default function InfraAlertChartWrapper(props) {
  const { alertConfig, timeConfig } = props;
  const { entityType, metricName, aggregation } = alertConfig.rule;
  const { threshold, granularity } = alertConfig;

  const metricDefinition = getMetricDefinition(entityType, metricName);

  const metricLabel = metricDefinition.getLabel();
  // Because the chart config for UnifiedMetricsChart requires a string formatterId (e.g. 'percentage.compact'),
  // which is then internally mapped to the formatter function, we need to do a tiny workaround here and map the formatter
  // function to that ID, just that it's internally mapped back to the function once again.
  const metricFormatterId = getFormatterId(metricDefinition.formatter.detailed);

  const highlight = undefined;
  const formatter = isCustomRateMetric(metricName) ? percentage : number.forcedCompact;
  const renderer = getRendererBasedOnThresholdType(threshold, highlight, granularity, []);

  const chartViewConfig = createDefaultChartConfig(timeConfig);

  // config to get unified metric data
  const unifiedMetricConfig = getUnifiedMetricConfig({
    alertConfig,
    metricFormatterId,
    line,
    aggregation,
    metricLabel,
    metricName,
    entityType
  });

  // WS hook to get unified metric results
  const unifiedMetricData = useResultData(unifiedMetricConfig, alertConfig.granularity, timeConfig);
  const metricResult = unifiedMetricData.metricResult;

  let metricResults = {};

  // chartProps to render the metric values and threshold to the chart
  const chartProps = {
    ...getChartConfig({
      threshold,
      timeConfig,
      chartViewConfig,
      metricName,
      granularity,
      aggregation
    }),
    y1: getY1(metricName, highlight, metricLabel, formatter, renderer, granularity, threshold, [], chartViewConfig)
  };

  if (metricResult.errors.length > 0 || metricResult.progress.loading) {
    metricResults = {
      time: 0,
      progress: indeterminateProgress,
      errors: metricResult.errors,
      data: {}
    };
  } else {
    const metricValues = metricResult?.data[0]?.values;

    metricResults = {
      progress: finishedProgress,
      errors: {},
      time: metricResult.time,
      data: {
        [metricName]: metricValues,
        threshold: getThreshold(chartProps.y1, chartProps.thresholdType, metricValues, timeConfig)
      }
    };
  }

  const metricChartProps = { ...chartProps, result: metricResults };

  return (
    <Card title="Metrics">
      <ChartWrapper
        showNoDataInfoWhenEmpty={false}
        {...metricChartProps}
        metricsConfiguration={extendMetricConfiguration(chartProps)}
      />
    </Card>
  );
}

function isCustomRateMetric(metricName) {
  return metricName === 'cpu.used';
}
