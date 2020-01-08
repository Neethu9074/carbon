import React from 'react';

import { getBaselineValue } from 'in-websites/eum-alerting/chart/baselineUtils';
import getWebsiteMetrics from 'in-websites/subscriptions/getWebsiteMetrics';
import { finishedProgress, emptyArray } from 'in-services/fixedObjects';
import ChartWrapper from 'in-components/Chart/ChartWrapper';
import connectTo from 'in-hoc/connectTo';

export default connectTo(
  props => ({
    result: getWebsiteMetrics(props.metricsConfiguration).map(result =>
      mergeResult(result, props.y1.threshold, props.y1.baseline, props.y1.sensitivity, props.y1.operator)
    )
  }),
  function EumAlertingBarChartWrapper(props) {
    enrichChartMetrics(props);
    return <ChartWrapper {...props} />;
  }
);

function enrichChartMetrics(props) {
  props.metricsConfiguration.metrics['threshold'] = {
    metric: 'threshold'
  };
}

function mergeResult(result, thresholdValue, baseline, sensitivity, operator) {
  const mergedResult = {
    time: 0,
    progress: finishedProgress,
    errors: emptyArray,
    data: {}
  };

  if (result.errors.length > 0 || result.progress.loading) {
    return result;
  }

  const onLoadTime = result.data.onLoadTime;

  let threshold;
  if (!baseline || baseline.length === 0) {
    threshold = onLoadTime.map(([time]) => [time, thresholdValue]);
  } else {
    const isGreaterOp = isGreaterOperator(operator);
    threshold = onLoadTime.map(([time]) => {
      const baselineThresholdValue = getBaselineValue(time, baseline, sensitivity, isGreaterOp);
      return [time, baselineThresholdValue];
    });
  }

  mergedResult.time = Math.max(mergedResult.time, result.time);
  mergedResult.data = { onLoadTime, threshold };

  return mergedResult;
}

function isGreaterOperator(operator) {
  return operator === '>=' || operator === '>';
}
