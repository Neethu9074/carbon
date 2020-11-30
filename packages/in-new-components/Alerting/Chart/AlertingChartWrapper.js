import { combineLatest, create, just } from 'reactive-observables';
import React from 'react';

import { finishedProgress, emptyArray, indeterminateProgress, pendingResult } from 'in-services/fixedObjects';
import { switchQB1orQB2Helper } from 'in-new-components/Alerting/components/WithQB1orQB2';
import { getBaselineValue } from 'in-new-components/Alerting/utils/baselineUtils';
import { isGreaterOperator } from 'in-new-components/Alerting/utils/alertUtils';
import ChartWrapper from 'in-components/Chart/ChartWrapper';
import connectTo from 'in-hoc/connectTo';

export const thresholdOrBaselineLoadingSignal$ = create().emit(false);

export default connectTo(
  props => {
    const { tagFilterExpression } = props.metricsConfiguration;

    const metrics$ = switchQB1orQB2Helper(
      () => props.getMetric(props.metricsConfiguration),
      () => (tagFilterExpression ? props.getMetric(props.metricsConfiguration) : just(pendingResult)),
      isQB2Config => isQB2Config(props.convertedTagFilterExpression)
    );
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
          : mergeResult(
              metrics,
              props.y1.metricIds[0],
              props.y1.threshold,
              props.y1.baseline,
              props.y1.sensitivity,
              props.y1.thresholdGranularity,
              props.y1.operator,
              props.mutateMetrics ?? {}
            );
      })
    };
  },
  function AlertingChartWrapper(props) {
    return <ChartWrapper showNoDataInfoWhenEmpty={false} {...extendProps(props)} />;
  }
);

function extendProps(props) {
  return {
    ...props,
    metricsConfiguration: {
      ...props.metricsConfiguration,
      metrics: { ...props.metricsConfiguration.metrics, threshold: { metric: 'threshold' } }
    }
  };
}

function mergeResult(
  result,
  metricName,
  thresholdValue,
  baseline,
  sensitivity,
  thresholdGranularity,
  operator,
  mutateMetrics
) {
  const mergedResult = {
    time: 0,
    progress: finishedProgress,
    errors: emptyArray,
    data: {}
  };

  if (result.errors.length > 0 || result.progress.loading) {
    return result;
  }

  let metricData = result.data[metricName];

  let threshold;
  if (!baseline || baseline.length === 0) {
    threshold = metricData.map(([time]) => [time, thresholdValue]);
  } else {
    const isGreaterOp = isGreaterOperator(operator);
    threshold = metricData.map(([time]) => {
      const baselineThresholdValue = getBaselineValue(time, baseline, sensitivity, thresholdGranularity, isGreaterOp);
      return [time, baselineThresholdValue];
    });
  }

  if (mutateMetrics?.doMutate && mutateMetrics?.metricNames.includes(metricName)) {
    metricData = mutateMetrics.mutate(metricData);
  }

  mergedResult.time = Math.max(mergedResult.time, result.time);
  mergedResult.data = {
    [metricName]: metricData,
    threshold
  };

  return mergedResult;
}
