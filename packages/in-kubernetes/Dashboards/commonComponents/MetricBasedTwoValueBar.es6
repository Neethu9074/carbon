/* eslint-disable react/no-unused-prop-types */
import { combineLatest } from 'reactive-observables';
import React from 'react';

import { getTimeWindowBasedMetricAggregation } from 'in-stores/metric';
import TwoValueBar from 'in-new-components/TwoValueBar';
import { timeConfig$ } from 'in-stores/time/config';

import connectTo from 'in-hoc/connectTo';

export default connectTo(
  ({ snapshotId, metrics }) => ({
    values: timeConfig$.flatMap(timeConfig =>
      combineLatest([
        getTimeWindowBasedMetricAggregation({
          snapshotId,
          metric: metrics[0],
          timeConfig,
          timeWindowAggregation: 'mean'
        }),
        getTimeWindowBasedMetricAggregation({
          snapshotId,
          metric: metrics[1],
          timeConfig,
          timeWindowAggregation: 'mean'
        })
      ])
    )
  }),
  function MetricBasedTwoValueBar({ values, labels }) {
    if (!values) {
      return null;
    }
    return (
      <TwoValueBar
        v1={values[0]}
        v2={values[1]}
        fullDomain={values[1]}
        formatter={v => v}
        v1Label={labels[0]}
        v2Label={labels[1]}
      />
    );
  }
);
