/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { InfraAlertConfigWithMetadata, Result, TimeConfig } from '@instana/types';
import { Card } from '@instana/components';

//@ts-expect-error TS migration
import { getThreshold, extendMetricConfiguration } from 'in-alerting/components/Chart/AlertingChartWrapper';
// eslint-disable-next-line no-restricted-imports
import { useResultData } from 'in-custom-dashboards/widgets/Chart/UnifiedMetricsChart';
//@ts-expect-error TS migration
import { getRendererBasedOnThresholdType, getY1 } from 'in-alerting/components/Chart/AlertingChart';
import {
  getUnifiedMetricConfig,
  getChartConfig
} from 'in-alerting/smart-alerts/infrastructure/components/InfraChartUtils';
// eslint-disable-next-line no-restricted-imports
import { Config, MetricData } from 'in-custom-dashboards/widgets/Chart/types';
// eslint-disable-next-line no-restricted-imports
import { getMetricDefinition } from 'in-sdk/metrics';
import { createDefaultChartConfig } from 'in-alerting/components/Chart/chartViewConfig';
import { finishedProgress, indeterminateProgress } from 'in-services/fixedObjects';
import ChartWrapper from 'in-components/Chart/ChartWrapper';
import { t } from 'in-i18n';

interface InfraAlertChartWrapperProps {
  alertConfig: InfraAlertConfigWithMetadata;
  timeConfig: TimeConfig;
}

export default function InfraAlertChartWrapper(props: InfraAlertChartWrapperProps) {
  const { alertConfig, timeConfig } = props;
  const { entityType, metricName } = alertConfig.rule;
  const { threshold, granularity } = alertConfig;

  const metricDefinition = getMetricDefinition(entityType, metricName);
  const metricLabel = metricDefinition.getLabel();
  const formatter = metricDefinition.formatter;

  const highlight = undefined;
  const renderer = getRendererBasedOnThresholdType(threshold, highlight, granularity, []);

  const chartViewConfig = createDefaultChartConfig(timeConfig);

  // config to get unified metric data
  const unifiedMetricConfig = getUnifiedMetricConfig({
    alertConfig
  });

  // chartProps to render the metric values and threshold to the chart
  const chartProps = {
    ...getChartConfig({
      alertConfig,
      timeConfig
    }),
    y1: getY1(metricName, highlight, metricLabel, formatter, renderer, granularity, threshold, [], chartViewConfig)
  };

  // WS hook to get unified metric results
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
    const metricValues = metricResult?.data ? metricResult?.data[0]?.values : [];

    metricResults = {
      progress: finishedProgress,
      errors: {},
      time: metricResult?.time,
      data: {
        [metricName]: metricValues,
        threshold: getThreshold(chartProps.y1, chartProps.thresholdType, metricValues, timeConfig)
      }
    };
  }

  const metricChartProps = { ...chartProps, result: metricResults as Result<MetricData> };

  return (
    <Card title={t('in-events:titleMetrics')}>
      <ChartWrapper
        showNoDataInfoWhenEmpty={false}
        {...metricChartProps}
        metricsConfiguration={extendMetricConfiguration(chartProps)}
        granularity={granularity}
      />
    </Card>
  );
}
