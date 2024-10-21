/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { combineLatest, create, just } from '@instana/observables';

import {
  extractBaselineForSeverity,
  WARNING_SEVERITY,
  CRITICAL_SEVERITY
} from 'in-alerting/smart-alerts/components/utils/baselineUtils';
import { finishedProgress, emptyArray, indeterminateProgress, pendingResult, noop } from 'in-services/fixedObjects';
import { getThresholdInTimeframe } from 'in-alerting/components/Chart/renderer/lineWithAdaptiveBaseline';
import { getHistoricBaselineValue } from 'in-alerting/smart-alerts/components/utils/baselineUtils';
import { HISTORIC_BASELINE, STATIC_THRESHOLD } from 'in-alerting/smart-alerts/data/thresholdTypes';
import { isGreaterOperator } from 'in-alerting/smart-alerts/components/utils/alertUtils';
import { ADAPTIVE_BASELINE } from 'in-alerting/smart-alerts/data/thresholdTypes';
import { applyPostProcessing } from 'in-alerting/components/Chart/chartUtils';
import { isEmptyThreshold } from 'in-alerting/components/Chart/AlertingChart';
import ChartWrapper from 'in-components/Chart/ChartWrapper';
import connectTo from 'in-hoc/connectTo';

export const thresholdOrBaselineLoadingSignal$ = create().emit(false);

export default connectTo(
  props => {
    const { tagFilterExpression } = props.metricsConfiguration;

    const metrics$ = tagFilterExpression ? props.getMetric(props.metricsConfiguration) : just(pendingResult);

    const combined$ = combineLatest([metrics$, thresholdOrBaselineLoadingSignal$]);

    return {
      result: combined$.map(([metrics, thresholdOrBaselineLoading]) => {
        return props.canReload && thresholdOrBaselineLoading
          ? {
              time: 0,
              progress: indeterminateProgress,
              errors: metrics.errors,
              data: {}
            }
          : mergeResult({
              timeConfig: props.timeConfig,
              result: applyPostProcessing(metrics, props.postProcessMetric, props.granularity),
              y1: props.y1,
              thresholdType: props.thresholdType,
              setMetricResultPrecision: props.setMetricResultPrecision,
              isMultiThresholdEnabled: props.isMultiThresholdEnabled,
              isEventsView: props.isEventsView
            });
      })
    };
  },
  function AlertingChartWrapper(props) {
    return (
      <ChartWrapper
        showNoDataInfoWhenEmpty={false}
        {...props}
        metricsConfiguration={extendMetricConfiguration(props)}
      />
    );
  }
);

export function extendMetricConfiguration(props) {
  const result = {
    ...props.metricsConfiguration,
    metrics: {
      ...props.metricsConfiguration.metrics
    }
  };
  if (props.isMultiThresholdEnabled && !props.isEventsView) {
    result.metrics.warningThreshold = { metric: 'warningThreshold' };
    result.metrics.criticalThreshold = { metric: 'criticalThreshold' };
  } else {
    result.metrics.threshold = { metric: 'threshold' };
  }
  return result;
}

function getThresholdBasedOnThresholdType(
  thresholdValue,
  thresholdType,
  eventBasedAdaptiveBaseline,
  metricData,
  thresholdGranularity,
  timeConfig,
  isGreaterOp
) {
  switch (thresholdType) {
    case STATIC_THRESHOLD:
      return metricData.map(([time]) => [time, thresholdValue.value]);
    case HISTORIC_BASELINE:
      if ((thresholdValue.baseline ?? []).length === 0) {
        return [];
      }
      return metricData.map(([time]) => {
        const baselineThresholdValue = getHistoricBaselineValue(
          time,
          thresholdValue.baseline,
          thresholdValue.deviationFactor,
          thresholdGranularity,
          isGreaterOp
        );
        return [time, baselineThresholdValue];
      });
    case ADAPTIVE_BASELINE:
      return getThresholdInTimeframe(
        eventBasedAdaptiveBaseline,
        thresholdValue.baseline,
        thresholdValue.deviationFactor,
        isGreaterOp,
        thresholdGranularity,
        timeConfig
      );
    default:
      return [];
  }
}

export function getThreshold(y1, thresholdType, metricData, timeConfig, isMultiThresholdEnabled, isEventsView) {
  const { operator, warningThresholdValue, criticalThresholdValue, thresholdGranularity } = y1;
  const isGreaterOp = isGreaterOperator(operator);

  if (isMultiThresholdEnabled && !isEventsView) {
    return {
      warningThreshold: !isEmptyThreshold(warningThresholdValue)
        ? getThresholdBasedOnThresholdType(
            warningThresholdValue,
            thresholdType,
            extractBaselineForSeverity(y1.eventBasedAdaptiveBaseline, WARNING_SEVERITY),
            metricData,
            thresholdGranularity,
            timeConfig,
            isGreaterOp
          )
        : [],
      criticalThreshold: !isEmptyThreshold(criticalThresholdValue)
        ? getThresholdBasedOnThresholdType(
            criticalThresholdValue,
            thresholdType,
            extractBaselineForSeverity(y1.eventBasedAdaptiveBaseline, CRITICAL_SEVERITY),
            metricData,
            thresholdGranularity,
            timeConfig,
            isGreaterOp
          )
        : []
    };
  }

  const { threshold: thresholdValue, baseline, sensitivity, eventBasedAdaptiveBaseline } = y1;

  if (thresholdType === ADAPTIVE_BASELINE) {
    return getThresholdInTimeframe(
      eventBasedAdaptiveBaseline,
      baseline,
      sensitivity,
      isGreaterOperator(operator),
      thresholdGranularity,
      timeConfig
    );
  } else if ((baseline ?? []).length === 0 && (eventBasedAdaptiveBaseline ?? []).length === 0) {
    return metricData.map(([time]) => [time, thresholdValue]);
  } else {
    const isGreaterOp = isGreaterOperator(operator);

    return metricData.map(([time]) => {
      const baselineThresholdValue = getHistoricBaselineValue(
        time,
        baseline,
        sensitivity,
        thresholdGranularity,
        isGreaterOp
      );
      return [time, baselineThresholdValue];
    });
  }
}

function mergeResult({
  result,
  y1,
  thresholdType,
  setMetricResultPrecision = noop,
  timeConfig,
  isMultiThresholdEnabled,
  isEventsView
}) {
  if (result.errors.length > 0 || result.progress.loading) {
    return result;
  }

  setMetricResultPrecision(result?.resultPrecisionDetails?.resultPrecision);

  const metricName = y1.metricIds[0];
  const metricData = result.data[metricName];

  const data = {
    [metricName]: metricData,
    ...(isMultiThresholdEnabled && !isEventsView
      ? getThreshold(y1, thresholdType, metricData, timeConfig, isMultiThresholdEnabled, isEventsView)
      : { threshold: getThreshold(y1, thresholdType, metricData, timeConfig, isMultiThresholdEnabled, isEventsView) })
  };

  return {
    progress: finishedProgress,
    errors: emptyArray,
    time: Math.max(0, result.time),
    data: data
  };
}
