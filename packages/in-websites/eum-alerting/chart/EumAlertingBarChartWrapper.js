import React from 'react';

import getWebsiteMetrics from 'in-websites/subscriptions/getWebsiteMetrics';
import { extendMetricConfigurationOnLiveMode } from 'in-websites/metrics';
import { finishedProgress, emptyArray } from 'in-services/fixedObjects';
import ChartWrapper from 'in-components/Chart/ChartWrapper';
import connectTo from 'in-hoc/connectTo';

export default connectTo(
  props => ({
    result: getWebsiteMetrics(extendMetricConfigurationOnLiveMode(props.metricsConfiguration)).map(result =>
      mergeResult(result, props.y1.threshold)
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

function mergeResult(result, thresholdValue) {
  const merged = {
    time: 0,
    progress: finishedProgress,
    errors: emptyArray,
    data: {}
  };

  if (result.errors.length > 0 || result.progress.loading) {
    return result;
  }

  const errors = result.data.errors;
  const threshold = errors.map(([time]) => [time, thresholdValue]);

  merged.time = Math.max(merged.time, result.time);
  merged.data = { errors, threshold };

  return merged;
}
