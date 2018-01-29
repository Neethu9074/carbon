/* eslint-disable  react/no-unused-prop-types */

import { serverTime$ } from 'in-stores/serverTime';
import { always } from 'in-services/fixedStreams';
import SparkChart from 'in-components/SparkChart';
import connectTo from 'in-hoc/connectTo';
import React from 'react';

export default connectTo(
  props => {
    const observables = {
      metrics: props.datasource
    };
    const timeframe = {
      windowSize: props.timeframe.windowSize + props.wiggleRoom,
      to: props.timeframe.to
    };
    if (!timeframe.to) {
      observables.timeframe = serverTime$.map(serverTime => ({
        windowSize: timeframe.windowSize,
        to: serverTime - props.wiggleRoom
      }));
    } else {
      observables.timeframe = always(timeframe);
    }
    return observables;
  },
  function(props) {
    const { timeframe, metrics } = props;
    if (!timeframe || !metrics) {
      return null;
    }
    return <SparkChart {...props} />;
  }
);
