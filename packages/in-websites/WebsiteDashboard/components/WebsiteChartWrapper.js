import React, { useState, useEffect } from 'react';
import { create } from 'reactive-observables';
import PropTypes from 'prop-types';

import getWebsiteMetrics from 'in-websites/subscriptions/getWebsiteMetrics';
import { extendMetricConfigurationOnLiveMode } from 'in-websites/metrics';
import ChartWrapper from 'in-components/Chart/ChartWrapper';
import { pendingResult } from 'in-services/fixedObjects';
import connectTo from 'in-hoc/connectTo';

export default function WebsiteChartWrapper(props) {
  const [query$] = useState(create());
  useEffect(() => {
    query$.emit(props.metricsConfiguration);
  });
  return <ConnectedWebsiteChartWrapper {...props} query$={query$} />;
}

const ConnectedWebsiteChartWrapper = connectTo(
  props => {
    return {
      result: props.query$
        .debounce(props.isDebounced ? 500 : 0)
        .flatMap(metricsConfiguration => {
          return getWebsiteMetrics(extendMetricConfigurationOnLiveMode(metricsConfiguration));
        })
        .startWith(pendingResult)
    };
  },
  function WebsiteChartWrapper(props) {
    return <ChartWrapper {...props} />;
  }
);

WebsiteChartWrapper.propTypes = {
  metricsConfiguration: PropTypes.object.isRequired,
  isDebounced: PropTypes.bool
};
