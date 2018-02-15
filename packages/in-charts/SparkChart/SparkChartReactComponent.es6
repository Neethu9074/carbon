import { serverTime$ } from 'in-stores/serverTime';
import { always } from 'in-services/fixedStreams';
import SparkChart from 'in-components/SparkChart';
import connectTo from 'in-hoc/connectTo';
import React from 'react';

export default connectTo(
  props => {
    if (props.timeframe.to) {
      return {
        metrics: props.datasource,
        timeframe: always({
          windowSize: props.timeframe.windowSize + props.wiggleRoom,
          to: props.timeframe.to
        })
      };
    }

    return {
      metrics: props.datasource,
      timeframe: serverTime$.map(serverTime => ({
        windowSize: props.timeframe.windowSize + props.wiggleRoom,
        to: serverTime - props.wiggleRoom
      }))
    };
  },
  function(props) {
    return <SparkChart {...props} />;
  }
);
