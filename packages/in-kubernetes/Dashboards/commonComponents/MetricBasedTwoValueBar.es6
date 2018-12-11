/* eslint-disable react/no-unused-prop-types */
import { combineLatest } from 'reactive-observables';
import React from 'react';

import { getMetricForFocusedMoment, getTimeWindowBasedMetricAggregation } from 'in-stores/metric';
import TwoValueBar from 'in-new-components/TwoValueBar';

import connectTo from 'in-hoc/connectTo';

export default connectTo(
  ({ snapshotId, metrics, timeWindowAggregation = 'mean' }) => ({
    values: combineLatest([
      getMetric({
        snapshotId,
        metric: metrics[0],
        timeWindowAggregation
      }),
      getMetric({
        snapshotId,
        metric: metrics[1],
        timeWindowAggregation
      })
    ])
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

function getMetric({ snapshotId, metric, timeWindowAggregation }) {
  if (!timeWindowAggregation) {
    return getMetricForFocusedMoment({ snapshotId, metric }).map(v => v[1]);
  }

  return getTimeWindowBasedMetricAggregation({
    snapshotId,
    metric,
    timeWindowAggregation
  });
}
