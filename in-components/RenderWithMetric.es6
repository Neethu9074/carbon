import React from 'react';

import { getTimeWindowBasedMetricAggregation } from 'in-stores/metric';
import connectTo from 'in-hoc/connectTo';

export default connectTo(
  props => {
    // TODO align with metric properties in the MetricValue component
    return {
      metricValue: getTimeWindowBasedMetricAggregation({
        snapshotId: props.snapshotId,
        metric: props.metric,
        timeWindowAggregation: props.timeWindowAggregation,
        timeframe: props.timeframe
      })
    };
  },
  function RenderWithMetric(props) {
    const Component = props.component;
    return <Component {...props} />;
  }
);
