import { combineLatest } from '@instana/observables';
import React from 'react';

import getOpenEventsCountTimeSeries from 'in-events/subscriptions/getOpenEventsCountTimeSeries';
import { extendMetricConfigurationOnLiveMode } from 'in-events/metrics';
import { finishedProgress, emptyArray } from 'in-services/fixedObjects';
import ChartWrapper from 'in-components/Chart/ChartWrapper';
import connectTo from 'in-hoc/connectTo';

export default connectTo(
  ({ metricsConfiguration }) => {
    metricsConfiguration = extendMetricConfigurationOnLiveMode(metricsConfiguration);
    const perMetricObservables = Object.keys(metricsConfiguration.metrics).reduce((agg, metricName) => {
      agg.push(
        getOpenEventsCountTimeSeries({
          timeConfig: metricsConfiguration.timeConfig,
          query: metricsConfiguration.metrics[metricName].query,
          granularity: metricsConfiguration.metrics[metricName].granularity
        }).map(result => ({ metricName, result }))
      );
      return agg;
    }, []);

    return {
      result: combineLatest(perMetricObservables).map(mergeResult)
    };
  },
  function OpenEventsCountChartWrapper(props) {
    return <ChartWrapper {...props} />;
  }
);

function mergeResult(results) {
  const merged = {
    time: 0,
    progress: finishedProgress,
    errors: emptyArray,
    data: {}
  };

  for (let i = 0; i < results.length; i++) {
    const result = results[i];
    if (result.result.errors.length > 0) {
      return result.result;
    } else if (result.result.progress.loading) {
      return result.result;
    }

    merged.time = Math.max(merged.time, result.result.time);
    merged.data[result.metricName] = result.result.data;
  }

  return merged;
}
