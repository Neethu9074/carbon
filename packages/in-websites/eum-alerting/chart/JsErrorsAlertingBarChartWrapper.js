import React from 'react';

import getWebsiteRateMetric from 'in-websites/eum-alerting/subscriptions/getWebsiteRateMetric';
import getWebsiteMetrics from 'in-websites/subscriptions/getWebsiteMetrics';
import { finishedProgress, emptyArray } from 'in-services/fixedObjects';
import ChartWrapper from 'in-components/Chart/ChartWrapper';
import connectTo from 'in-hoc/connectTo';

const errorCount = 'errors';
const errorRate = 'specificJsErrorRate';

export default connectTo(
  props => {
    let websiteMetrics$;

    if (props.metricName === errorCount) {
      websiteMetrics$ = getWebsiteMetrics(props.metricsConfiguration);
    }

    if (props.metricName === errorRate) {
      websiteMetrics$ = getWebsiteRateMetric(props.metricsConfiguration);
    }

    return {
      result: websiteMetrics$.map(result => mergeResult(result, props.y1.threshold))
    };
  },
  function JsErrorsAlertingBarChartWrapper(props) {
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
  const mergedResult = {
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

  mergedResult.time = Math.max(mergedResult.time, result.time);
  mergedResult.data = { errors, threshold };

  return mergedResult;
}
