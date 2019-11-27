import React from 'react';

import getMobileAppMetrics from 'in-mobile-apps/subscriptions/getMobileAppMetrics';
import { extendMetricConfigurationOnLiveMode } from 'in-mobile-apps/metrics';
import ChartWrapper from 'in-components/Chart/ChartWrapper';
import connectTo from 'in-hoc/connectTo';

export default connectTo(
  props => ({
    result: getMobileAppMetrics(extendMetricConfigurationOnLiveMode(props.metricsConfiguration))
  }),
  function MobileAppChartWrapper(props) {
    return <ChartWrapper {...props} />;
  }
);
