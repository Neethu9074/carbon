import React from 'react';

import getWebsiteMetrics from 'in-subscription/websiteMonitoring/getWebsiteMetrics';
import { extendMetricConfigurationOnLiveMode } from 'in-websites/metrics';
import ChartWrapper from 'in-components/Chart/ChartWrapper';
import connectTo from 'in-hoc/connectTo';

export default connectTo(
  props => ({
    result: getWebsiteMetrics(extendMetricConfigurationOnLiveMode(props.metricsConfiguration))
  }),
  function WebsiteChartWrapper(props) {
    return <ChartWrapper {...props} />;
  }
);
