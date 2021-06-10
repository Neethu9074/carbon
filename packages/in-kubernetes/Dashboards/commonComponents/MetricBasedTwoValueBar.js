/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { getMetricForFocusedMoment, getTimeWindowBasedMetricAggregation } from 'in-stores/metric';
import TwoValueBar from 'in-components/TwoValueBar';
import connectTo from 'in-hoc/connectTo';
import theme from 'in-themes';

export default connectTo(
  ({ snapshotId, metrics, timeWindowAggregation = 'mean' }) => {
    const observables = {};

    if (metrics[0]) {
      observables.value1 = getMetric({
        snapshotId,
        metric: metrics[0],
        timeWindowAggregation
      });
    }
    if (metrics[1]) {
      observables.value2 = getMetric({
        snapshotId,
        metric: metrics[1],
        timeWindowAggregation
      });
    }

    return observables;
  },
  function MetricBasedTwoValueBar({ value1, value2, labels, renderLabels = true, formatter, transformer }) {
    if (value1 == undefined || value2 == undefined) {
      return null;
    }

    return (
      <TwoValueBar
        v1={value1}
        v2={value2}
        v1Color={theme.lib.colors.lightBlue800}
        v2Color={theme.lib.colors.red800}
        fullDomain={value2}
        formatter={formatter || identity}
        v1Label={labels && labels[0]}
        v2Label={labels && labels[1]}
        renderLabels={renderLabels}
        transformer={transformer}
      />
    );
  }
);

function identity(v) {
  return v;
}

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
