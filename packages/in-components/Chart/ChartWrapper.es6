import React from 'react';

import getMetrics from 'in-subscription/application/getMetrics';
import { getResolvedTimeframe } from 'in-applications/metrics';
import Chart from 'in-components/Chart/ChartReactComponent';
import connectTo from 'in-hoc/connectTo';

export default connectTo(
  props => ({
    result: getMetrics(props.metricsConfiguration)
  }),
  function ChartWrapper({ result }) {
    if (result.errors.length > 0) {
      return result.errors.join(',');
    }

    if (result.progress.loading) {
      return 'Loading...';
    }

    return <Chart {...wrapProps(this.props)} />;
  }
);

function wrapProps(props) {
  const propsClone = Object.assign({}, props);

  propsClone.timeframe = getResolvedTimeframe(propsClone.timeframe, propsClone.result);

  propsClone.y1.metrics = propsClone.y1.metricIds.map(id => props.result.data[id]);

  if (propsClone.y2 != null) {
    propsClone.y2.metrics = propsClone.y2.metricIds.map(id => props.result.data[id]);
  }

  return propsClone;
}
