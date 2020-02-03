import React from 'react';

import AlertingChartReactComponent from 'in-new-components/Alerting/Chart/AlertingChartReactComponent';
import getWebsiteRateMetric from 'in-websites/eum-alerting/subscriptions/getWebsiteRateMetric';
import { getBaselineValue } from 'in-websites/eum-alerting/chart/baselineUtils';
import getWebsiteMetrics from 'in-websites/subscriptions/getWebsiteMetrics';
import { finishedProgress, emptyArray } from 'in-services/fixedObjects';
import ChartWrapper from 'in-components/Chart/ChartWrapper';
import connectTo from 'in-hoc/connectTo';

export default connectTo(
  props => {
    let websiteMetrics$;

    if (props.isCatalogMetric) {
      websiteMetrics$ = getWebsiteMetrics(props.metricsConfiguration);
    } else {
      websiteMetrics$ = getWebsiteRateMetric(props.metricsConfiguration);
    }

    return {
      result: websiteMetrics$.map(result => {
        return mergeResult(
          result,
          props.y1.metricIds[0],
          props.y1.threshold,
          props.y1.baseline,
          props.y1.sensitivity,
          props.y1.operator
        );
      })
    };
  },
  function EumAlertingBarChartWrapper(props) {
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
