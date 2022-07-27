/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { combineLatest, create, just } from '@instana/observables';

import { finishedProgress, emptyArray, indeterminateProgress, pendingResult, noop } from 'in-services/fixedObjects';
import { getThresholdInTimeframe } from 'in-alerting/components/Chart/renderer/lineWithAdaptiveBaseline';
import { getHistoricBaselineValue } from 'in-alerting/smart-alerts/components/utils/baselineUtils';
import { isGreaterOperator } from 'in-alerting/smart-alerts/components/utils/alertUtils';
import { ADAPTIVE_BASELINE } from 'in-alerting/smart-alerts/data/thresholdTypes';
import { applyPostProcessing } from 'in-alerting/components/Chart/chartUtils';
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
              setMetricResultPrecision: props.setMetricResultPrecision
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

function extendMetricConfiguration(props) {
  return {
    ...props.metricsConfiguration,
    metrics: {
      ...props.metricsConfiguration.metrics,
      threshold: { metric: 'threshold' }
    }
  };
}

function getThreshold(y1, thresholdType, metricData, timeConfig) {
  const {
    threshold: thresholdValue,
    baseline,
    sensitivity,
    thresholdGranularity,
    operator,
    eventBasedAdaptiveBaseline
  } = y1;

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

function mergeResult({ result, y1, thresholdType, setMetricResultPrecision = noop, timeConfig }) {
  if (result.errors.length > 0 || result.progress.loading) {
    return result;
  }

  setMetricResultPrecision(result?.resultPrecisionDetails?.resultPrecision);

  const metricName = y1.metricIds[0];
  const metricData = result.data[metricName];

  return {
    progress: finishedProgress,
    errors: emptyArray,
    time: Math.max(0, result.time),
    data: {
      [metricName]: metricData,
      threshold: getThreshold(y1, thresholdType, metricData, timeConfig)
    }
  };
}
