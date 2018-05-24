import { serverTime$ } from 'in-stores/serverTime';
import { always } from 'in-services/fixedStreams';
import SparkChart from 'in-components/SparkChart';
import connectTo from 'in-hoc/connectTo';
import React from 'react';

export default connectTo(
  props => {
    if (props.timeConfig.to) {
      return {
        metrics: props.datasource,
        timeConfig: always({
          windowSize: props.timeConfig.windowSize + props.wiggleRoom,
          to: props.timeConfig.to,
          focusedMoment: props.timeConfig.focusedMoment,
          autoRefresh: false
        })
      };
    }

    return {
      metrics: props.datasource,
      timeConfig: serverTime$.map(serverTime => ({
        windowSize: props.timeConfig.windowSize + props.wiggleRoom,
        to: serverTime - props.wiggleRoom,
        focusedMoment: serverTime - props.wiggleRoom,
        autoRefresh: props.timeConfig.autoRefresh
      }))
    };
  },
  function(props) {
    return <SparkChart {...props} />;
  }
);
