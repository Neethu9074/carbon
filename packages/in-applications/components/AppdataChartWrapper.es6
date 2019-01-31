import React from 'react';

import { extendMetricConfigurationOnLiveMode } from 'in-applications/metrics';
import getMetrics from 'in-subscription/application/getMetrics';
import ChartWrapper from 'in-components/Chart/ChartWrapper';
import connectTo from 'in-hoc/connectTo';

export default connectTo(
  props => ({
    result: getMetrics(extendMetricConfigurationOnLiveMode(props.metricsConfiguration))
  }),
  function AppdataChartWrapper(props) {
    return <ChartWrapper {...props} />;
  }
);
