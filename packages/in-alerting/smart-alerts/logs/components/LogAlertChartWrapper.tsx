/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import {
  Granularity,
  LogTimeThreshold,
  Result,
  StaticThresholdData,
  TagFilter,
  TagFilterExpression,
  ThresholdData,
  TimeConfig,
  StaticThresholdRule,
  ThresholdOperator,
  Severity,
  SmartAlertThresholdRuleUnion,
  GetLogMetricAlertsPreviewQuery,
  RuleWithThreshold,
  LogAlertRuleUnion
} from 'in-types';
// @ts-expect-error TS migration
import AlertsPreviewLane from 'in-alerting/components/Chart/AlertsPreviewLane/AlertsPreviewLane';
//@ts-expect-error TS migration
import { extendMetricConfiguration } from 'in-alerting/components/Chart/AlertingChartWrapper';
import { SelectedMetric, getExpressionWithLogsGroupingTags } from 'in-events/components/EventContent/tagFilterUtils';
//@ts-expect-error TS migration
import { getY1ForMultiThreshold } from 'in-alerting/components/Chart/AlertingChart';
import { getChartConfig, getUnifiedMetricConfig } from 'in-alerting/smart-alerts/logs/components/LogChartUtils';
import { WARNING_SEVERITY, CRITICAL_SEVERITY } from 'in-alerting/smart-alerts/components/utils/baselineUtils';
import getLogMetricsAlertPreview from 'in-alerting/smart-alerts/logs/subscriptions/getLogMetricsAlertPreview';
import { zeroFillAndClipMetric, applyPostProcessing, Metrics } from 'in-alerting/components/Chart/chartUtils';
import { LogSmartAlertConfigWithMetadata } from 'in-alerting/smart-alerts/logs/form/logAlertConfigTypes';
import { createLineWithMultiStaticThreshold } from 'in-alerting/components/Chart/renderer/Renderer';
import { isGreaterOperatorOrUndefined } from 'in-alerting/smart-alerts/components/utils/alertUtils';
import { createDefaultChartConfig } from 'in-alerting/components/Chart/chartViewConfig';
import MarkerLanesPresenter from 'in-components/Chart/markerLanes/MarkerLanesPresenter';
import { useResultData } from 'in-custom-dashboards/widgets/Chart/UnifiedMetricsChart';
import { isEmpty } from 'in-alerting/smart-alerts/components/dialog/sharedFunctions';
import { finishedProgress, indeterminateProgress } from 'in-services/fixedObjects';
import { STATIC_THRESHOLD } from 'in-alerting/smart-alerts/data/thresholdTypes';
import { UnifiedMetricsResult } from 'in-subscription/getUnifiedMetrics';
import { Config } from 'in-custom-dashboards/widgets/Chart/types';
import ChartWrapper from 'in-components/Chart/ChartWrapper';
import { number } from 'in-services/formatters/number';
import { t } from 'in-i18n';

interface LogAlertChartWrapperProps {
  alertConfig: LogSmartAlertConfigWithMetadata;
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
  const { granularity, tagFilterExpression, timeThreshold, rules } = alertConfig;
  const firstRule: RuleWithThreshold<LogAlertRuleUnion> = rules[0];
  const thresholdsMap = firstRule.thresholds;
  // we only support static threshold(s) in Log SA.
  const warningThreshold = (thresholdsMap[WARNING_SEVERITY] as StaticThresholdRule)?.value;
  const criticalThreshold = (thresholdsMap[CRITICAL_SEVERITY] as StaticThresholdRule)?.value;
  const thresholdOperator = firstRule.thresholdOperator;

  const chartViewConfig = createDefaultChartConfig(timeConfig);

  const renderer = createLineWithMultiStaticThreshold(thresholdOperator, warningThreshold, criticalThreshold);

  const enrichedTagFilterExpression = selectedMetricGroup
    ? getExpressionWithLogsGroupingTags(tagFilterExpression as TagFilterExpression, [selectedMetricGroup])
    : tagFilterExpression;

  const unifiedMetricConfig = getUnifiedMetricConfig(logSumMetricId, enrichedTagFilterExpression, granularity);

  const y1Props = getY1ForMultiThreshold(
    logSumMetricId,
    t('in-alerting:smartAlerts.logs.logCount'),
    number.forcedCompact,
    renderer,
    granularity,
    thresholdOperator,
    thresholdsMap[WARNING_SEVERITY],
    thresholdsMap[CRITICAL_SEVERITY],
    [],
    chartViewConfig
  );

  // chartProps to render the metric values and threshold to the chart
  const chartProps = {
    ...getChartConfig(alertConfig, timeConfig, logSumMetricId),
    y1: y1Props
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
        warningThreshold: metricValues.map(([time]) => [time, warningThreshold]),
        criticalThreshold: metricValues.map(([time]) => [time, criticalThreshold])
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

        const isWarningThresholdDefined = !isEmpty(warningThreshold);
        const isCriticalThresholdDefined = !isEmpty(criticalThreshold);
        const isGreaterOp = isGreaterOperatorOrUndefined(thresholdOperator);
        if (
          isWarningThresholdDefined &&
          isCriticalThresholdDefined &&
          ((isGreaterOp && criticalThreshold < warningThreshold) ||
            (!isGreaterOp && warningThreshold < criticalThreshold))
        ) {
          return;
        }

        const alertsPreviewQuery = getAlertsPreviewQuery(
          timeConfig,
          enrichedTagFilterExpression,
          granularity,
          getThresholdData(getThresholdWithLowestSeverity(thresholdsMap)!, thresholdOperator),
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

function getThresholdData(rule: SmartAlertThresholdRuleUnion, operator: ThresholdOperator): ThresholdData {
  return {
    ...rule,
    operator
  };
}

/**
 * In the alert preview, we pass the warning threshold if it is present. Otherwise, critical threshold.
 */
function getThresholdWithLowestSeverity(thresholdsMap: { [P in Severity]?: SmartAlertThresholdRuleUnion }) {
  if (!isEmpty((thresholdsMap[WARNING_SEVERITY] as StaticThresholdRule)?.value)) {
    return thresholdsMap[WARNING_SEVERITY];
  }

  return thresholdsMap[CRITICAL_SEVERITY];
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
  if (threshold.type === STATIC_THRESHOLD) {
    return (threshold as StaticThresholdData).value != null;
  }
  return false;
}
