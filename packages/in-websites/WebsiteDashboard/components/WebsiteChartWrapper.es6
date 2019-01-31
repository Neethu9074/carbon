import React from 'react';

import getWebsiteMetrics from 'in-subscription/websiteMonitoring/getWebsiteMetrics';
import { extendWebsiteMetricConfigurationOnLiveMode } from 'in-applications/metrics';
import ChartWrapper from 'in-components/Chart/ChartWrapper';
import connectTo from 'in-hoc/connectTo';

export default connectTo(
  props => ({
    result: getWebsiteMetrics(extendWebsiteMetricConfigurationOnLiveMode(props.metricsConfiguration))
  }),
  function WebsiteChartWrapper(props) {
    return <ChartWrapper {...props} />;
  }
);
