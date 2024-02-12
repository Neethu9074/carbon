/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { LogAlertConfigWithMetadata, Result, TimeConfig } from '@instana/types';

//@ts-expect-error TS migration
import { getThreshold, extendMetricConfiguration } from 'in-alerting/components/Chart/AlertingChartWrapper';
//@ts-expect-error TS migration
import { getRendererBasedOnThresholdType, getY1 } from 'in-alerting/components/Chart/AlertingChart';
import { getChartConfig, getUnifiedMetricConfig } from 'in-alerting/smart-alerts/logs/components/LogChartUtils';
import { createDefaultChartConfig } from 'in-alerting/components/Chart/chartViewConfig';
import { useResultData } from 'in-custom-dashboards/widgets/Chart/UnifiedMetricsChart';
import { finishedProgress, indeterminateProgress } from 'in-services/fixedObjects';
import { Config, MetricData } from 'in-custom-dashboards/widgets/Chart/types';
import { UnifiedMetricsResult } from 'in-subscription/getUnifiedMetrics';
import ChartWrapper from 'in-components/Chart/ChartWrapper';
import { number } from 'in-services/formatters/number';
import { t } from 'in-i18n';

interface LogAlertChartWrapperProps {
  alertConfig: LogAlertConfigWithMetadata;
  timeConfig: TimeConfig;
}

/**
 * The log count metric.
 * Please note that the actual metric name does not matter at the moment, because the logging space currently only supports
 * a single metric. And as of now, it reports that metric back for any given metricId. But for consistency, we use the same metric
 * identifier that is used in Log Analytics.
 */
const logSumMetricId = 'logs_distribution';

export default function InfraAlertChartWrapper({ alertConfig, timeConfig }: LogAlertChartWrapperProps) {
  const { threshold, granularity, tagFilterExpression } = alertConfig;
  const highlight = undefined;

  const chartViewConfig = createDefaultChartConfig(timeConfig);

  const renderer = getRendererBasedOnThresholdType(threshold, highlight, granularity, [], false);

  const unifiedMetricConfig = getUnifiedMetricConfig(logSumMetricId, tagFilterExpression, granularity);

  // chartProps to render the metric values and threshold to the chart
  const chartProps = {
    ...getChartConfig(alertConfig, timeConfig, logSumMetricId),
    y1: getY1(
      logSumMetricId,
      highlight,
      t('in-events:logSmartAlerts.logs'),
      number.forcedCompact,
      renderer,
      granularity,
      threshold,
      [],
      chartViewConfig
    )
  };

  const unifiedMetricData = useResultData(unifiedMetricConfig as Config, alertConfig.granularity, timeConfig);
  const metricResult = unifiedMetricData.metricResult;
  let metricResults = {};

  if (metricResult.errors.length > 0 || metricResult.progress.loading) {
    metricResults = {
      time: 0,
      progress: indeterminateProgress,
      errors: metricResult.errors,
      data: {}
    };
  } else {
    const metricValues = getMetricValues(metricResult) ?? [];
    metricResults = {
      progress: finishedProgress,
      errors: {},
      time: metricResult?.time,
      data: {
        [logSumMetricId]: metricValues,
        threshold: getThreshold(chartProps.y1, chartProps.thresholdType, metricValues, timeConfig)
      }
    };
  }

  const metricChartProps = { ...chartProps, result: metricResults as Result<MetricData> };
  return (
    <ChartWrapper
      showNoDataInfoWhenEmpty
      {...metricChartProps}
      metricsConfiguration={extendMetricConfiguration(chartProps)}
      granularity={granularity}
    />
  );
}

function getMetricValues(metricResult: Result<UnifiedMetricsResult[]>) {
  return metricResult?.data && metricResult?.data.length > 0 ? metricResult?.data[0]?.values : [];
}
