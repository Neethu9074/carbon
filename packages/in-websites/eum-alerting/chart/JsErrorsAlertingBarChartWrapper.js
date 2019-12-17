import React from 'react';

import getWebsiteSpecificJsErrorRateMetric from 'in-websites/eum-alerting/subscriptions/getWebsiteSpecificJsErrorRateMetric';
import { fieldNames, selectOptions } from 'in-websites/eum-alerting/data/alertDialogFormDefinition';
import getWebsiteMetrics from 'in-websites/subscriptions/getWebsiteMetrics';
import { finishedProgress, emptyArray } from 'in-services/fixedObjects';
import ChartWrapper from 'in-components/Chart/ChartWrapper';
import connectTo from 'in-hoc/connectTo';

const errorCount = selectOptions[fieldNames.ruleMetricName][0].value;
const errorRate = selectOptions[fieldNames.ruleMetricName][1].value;

export default connectTo(
  props => {
    let websiteMetrics$;

    if (props.metricName === errorCount) {
      websiteMetrics$ = getWebsiteMetrics(props.metricsConfiguration);
    }

    if (props.metricName === errorRate) {
      websiteMetrics$ = getWebsiteSpecificJsErrorRateMetric(props.metricsConfiguration);
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
