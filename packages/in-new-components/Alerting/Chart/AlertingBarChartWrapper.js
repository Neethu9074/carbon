import { just, combineLatest } from 'reactive-observables';
import React from 'react';

import AlertingChartReactComponent from 'in-new-components/Alerting/Chart/AlertingChartReactComponent';
import { finishedProgress, emptyArray, indeterminateProgress } from 'in-services/fixedObjects';
import { thresholdOrBaselineLoadingSignal$ } from 'in-websites/alerting/constants';
import { getBaselineValue } from 'in-new-components/Alerting/utils/baselineUtils';
import ChartWrapper from 'in-components/Chart/ChartWrapper';
import connectTo from 'in-hoc/connectTo';

export default connectTo(
  props => {
    const metrics$ = props.getMetric(props.metricsConfiguration);
    const baseline$ = just(props.y1.baseline).startWith(null);
    const threshold$ = just(props.y1.threshold).startWith(null);

    const combined$ = combineLatest([
      baseline$,
      threshold$,
      metrics$,
      thresholdOrBaselineLoadingSignal$.startWith(false)
    ]);

    return {
      result: combined$.map(([baseline, threshold, metrics, thresholdOrBaselineLoading]) => {
        return props.canReload && thresholdOrBaselineLoading
          ? {
              time: 0,
              progress: indeterminateProgress,
              errors: metrics.errors,
              data: {}
            }
          : mergeResult(metrics, props.y1.metricIds[0], threshold, baseline, props.y1.sensitivity, props.y1.operator);
      })
    };
  },
  function AlertingBarChartWrapper(props) {
    enrichChartMetrics(props);
    return <ChartWrapper customChartComponent={AlertingChartReactComponent} {...props} />;
  }
);

function enrichChartMetrics(props) {
  props.metricsConfiguration.metrics['threshold'] = {
    metric: 'threshold'
  };
  props.metricsConfiguration.metrics['alerts'] = {
    metric: 'alerts'
  };
}

function mergeResult(result, metricName, thresholdValue, baseline, sensitivity, operator) {
  const mergedResult = {
    time: 0,
    progress: finishedProgress,
    errors: emptyArray,
    data: {}
  };

  if (result.errors.length > 0 || result.progress.loading) {
    return result;
  }

  const metricData = result.data[metricName];

  let threshold;
  if (!baseline || baseline.length === 0) {
    threshold = metricData.map(([time]) => [time, thresholdValue]);
  } else {
    const isGreaterOp = isGreaterOperator(operator);
    threshold = metricData.map(([time]) => {
      const baselineThresholdValue = getBaselineValue(time, baseline, sensitivity, isGreaterOp);
      return [time, baselineThresholdValue];
    });
  }

  mergedResult.time = Math.max(mergedResult.time, result.time);
  mergedResult.data = {
    [metricName]: metricData,
    threshold
  };

  return mergedResult;
}

function isGreaterOperator(operator) {
  return operator === '>=' || operator === '>';
}
