/* eslint-disable  react/no-unused-prop-types */

import { serverTime$ } from 'in-stores/serverTime';
import { always } from 'in-services/fixedStreams';
import SparkChart from 'in-components/SparkChart';
import SvgIcon from 'in-components/SvgIcon';
import connectTo from 'in-hoc/connectTo';
import React from 'react';

import locals from './SparkChartReactComponent.mless';

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
    const { timeframe, metrics } = props;
    if (!timeframe || !metrics) {
      return <SvgIcon className={locals.noContentIcon} type="crossed_circle" height={26} color="#bec7cb" />;
    }
    return <SparkChart {...props} />;
  }
);
