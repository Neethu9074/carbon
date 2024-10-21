/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import {
  Granularity,
  LogAlertConfigWithMetadata,
  LogTimeThreshold,
  Result,
  StaticThresholdData,
  TagFilter,
  TagFilterExpression,
  ThresholdData,
  TimeConfig,
  GetLogMetricAlertsPreviewQuery
} from 'in-types';
//@ts-expect-error TS migration
import { getThreshold, extendMetricConfiguration } from 'in-alerting/components/Chart/AlertingChartWrapper';
//@ts-expect-error TS migration
import { getRendererBasedOnThresholdType, getY1 } from 'in-alerting/components/Chart/AlertingChart';
// @ts-expect-error TS migration
import AlertsPreviewLane from 'in-alerting/components/Chart/AlertsPreviewLane/AlertsPreviewLane';
import { SelectedMetric, getExpressionWithLogsGroupingTags } from 'in-events/components/EventContent/tagFilterUtils';
import { getChartConfig, getUnifiedMetricConfig } from 'in-alerting/smart-alerts/logs/components/LogChartUtils';
import getLogMetricsAlertPreview from 'in-alerting/smart-alerts/logs/subscriptions/getLogMetricsAlertPreview';
import { zeroFillAndClipMetric, applyPostProcessing, Metrics } from 'in-alerting/components/Chart/chartUtils';
import { createDefaultChartConfig } from 'in-alerting/components/Chart/chartViewConfig';
import MarkerLanesPresenter from 'in-components/Chart/markerLanes/MarkerLanesPresenter';
import { useResultData } from 'in-custom-dashboards/widgets/Chart/UnifiedMetricsChart';
import { finishedProgress, indeterminateProgress } from 'in-services/fixedObjects';
import { UnifiedMetricsResult } from 'in-subscription/getUnifiedMetrics';
import { Config } from 'in-custom-dashboards/widgets/Chart/types';
import ChartWrapper from 'in-components/Chart/ChartWrapper';
import { number } from 'in-services/formatters/number';
import { t } from 'in-i18n';

interface LogAlertChartWrapperProps {
  alertConfig: LogAlertConfigWithMetadata;
  timeConfig: TimeConfig;
  selectedMetricGroup?: SelectedMetric;
  alertsPreviewEnabled?: boolean;
}

/**
 * The log count metric.
 * Please note that the actual metric name does not matter at the moment, because the logging space currently only supports
 * a single metric. And as of now, it reports that metric back for any given metricId. But for consistency, we use the same metric
 * identifier that is used in Log Analytics.
 */
const logSumMetricId = 'logs_distribution';

export default function LogAlertChartWrapper({
  alertConfig,
  timeConfig,
  selectedMetricGroup,
  alertsPreviewEnabled
}: LogAlertChartWrapperProps) {
  const { threshold, granularity, tagFilterExpression, timeThreshold } = alertConfig;
  const highlight = undefined;

  const chartViewConfig = createDefaultChartConfig(timeConfig);

  const renderer = getRendererBasedOnThresholdType(threshold.operator, threshold, highlight, granularity, [], false);

  const enrichedTagFilterExpression = selectedMetricGroup
    ? getExpressionWithLogsGroupingTags(tagFilterExpression as TagFilterExpression, [selectedMetricGroup])
    : tagFilterExpression;

  const unifiedMetricConfig = getUnifiedMetricConfig(logSumMetricId, enrichedTagFilterExpression, granularity);

  // chartProps to render the metric values and threshold to the chart
  const chartProps = {
    ...getChartConfig(alertConfig, timeConfig, logSumMetricId),
    y1: getY1(
      logSumMetricId,
      highlight,
      t('in-alerting:smartAlerts.logs.logCount'),
      number.forcedCompact,
      renderer,
      granularity,
      threshold,
      threshold.operator,
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

  const metricChartProps = { ...chartProps, result: metricResults as Metrics };

  // The logs API is inconsistent with other metric APIs and does not adjust the
  // window endtime or return the adjustedWindowSize, so we'll patch the return values.
  // NB: We should only zerofill log metrics which are aggregated by sum(count, message size, etc)
  const windowEnd = metricChartProps.result.time - (metricChartProps.result.time % granularity);
  const adjustedWindowSize = timeConfig.windowSize - (timeConfig.windowSize % granularity);
  const updatedResult = { ...metricChartProps.result, time: windowEnd, adjustedWindowSize };
  const zeroFilledResult = applyPostProcessing(updatedResult, zeroFillAndClipMetric, granularity);

  return (
    <ChartWrapper
      showNoDataInfoWhenEmpty
      {...{ ...metricChartProps, result: zeroFilledResult }}
      metricsConfiguration={extendMetricConfiguration(chartProps)}
      granularity={granularity}
      renderPreChartContent={props => {
        if (!alertsPreviewEnabled) {
          return;
        }

        const alertsPreviewQuery = getAlertsPreviewQuery(
          timeConfig,
          enrichedTagFilterExpression,
          granularity,
          threshold,
          timeThreshold
        );

        return (
          <MarkerLanesPresenter {...props}>
            <AlertsPreviewLane
              getAlertsPreview={getLogMetricsAlertPreview}
              alertsPreviewConfiguration={alertsPreviewQuery}
            />
          </MarkerLanesPresenter>
        );
      }}
    />
  );
}

function getMetricValues(metricResult: Result<UnifiedMetricsResult[]>) {
  return metricResult?.data && metricResult?.data.length > 0 ? metricResult?.data[0]?.values : [];
}

function getAlertsPreviewQuery(
  timeConfig: TimeConfig,
  enrichedTagFilterExpression: TagFilter | TagFilterExpression,
  granularity: Granularity,
  threshold: ThresholdData,
  timeThreshold: LogTimeThreshold
) {
  if (shouldRequestAlertsPreview(threshold)) {
    return {
      timeThreshold,
      threshold,
      granularity,
      metric: {
        source: 'LOG',
        timeConfig,
        granularity,
        aggregation: 'SUM',
        metric: logSumMetricId,
        resultType: 'TIME_SERIES',
        timeShift: { offset: 0 },
        tagFilterExpression: enrichedTagFilterExpression
      }
    } as GetLogMetricAlertsPreviewQuery;
  }

  return null;
}

function shouldRequestAlertsPreview(threshold: ThresholdData) {
  if (threshold.type === 'staticThreshold') {
    return (threshold as StaticThresholdData).value != null;
  }
  return false;
}
