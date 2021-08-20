/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { combineLatest } from '@instana/observables';

import createLatestMetricsObservable from 'in-subscription/latestMetrics';
import { getInfraGranularity } from 'in-stores/metric';
import connectTo from 'in-hoc/connectTo';

export default connectTo(
  ({ snapshotId, timeConfig, filterMetrics, filter, minRollup, createObservable = createLatestMetricsObservable }) => ({
    filterMetrics: combineLatest(
      filterMetrics.map(metric =>
        createObservable({
          snapshotId,
          metric,
          rollup: getInfraGranularity(timeConfig, minRollup),
          timeConfig
        }).map(metric => metric[1])
      )
    ).map(metrics => {
      const matchingMetrics = [];
      filterMetrics.forEach((m, i) => {
        if (!filter(metrics[i])) {
          matchingMetrics.push(filterMetrics[i]);
        }
      });
      return matchingMetrics;
    })
  })
)(function({ filterMetrics = [], chartComponent: Chart, filterReasons, y1, ...props }) {
  return <Chart y1={disableSeries({ filterMetrics, filterReasons, y1 })} {...props} />;
});

const disableSeries = ({
  filterMetrics,
  filterReasons,
  y1: { forceDisabledMetrics = [], nonToggleableSeries = [], ...rest }
}) => {
  return {
    forceDisabledMetrics: forceDisabledMetrics.concat(filterMetrics).sort(),
    nonToggleableSeries: new Map(nonToggleableSeries.concat(filterMetrics).map((m, i) => [m, filterReasons[i]])),
    ...rest
  };
};
