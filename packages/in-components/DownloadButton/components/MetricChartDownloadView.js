/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { combineLatest } from '@instana/observables';

import DownloadView from 'in-components/DownloadButton/components/DownloadView';
import { getMetricsForTimeframe } from 'in-stores/metric';
import { timeConfig$ } from 'in-stores/time/config';
import { serverTime$ } from 'in-stores/serverTime';
import { getLabel } from 'in-sdk/snapshot';
import connectTo from 'in-hoc/connectTo';

export default connectTo(
  props => {
    return {
      metricValues: combineLatest([timeConfig$, serverTime$])
        .map(([timeConfig, serverTime]) => {
          const timeConfigCopy = {
            ...timeConfig
          };

          if (!timeConfigCopy.to) {
            timeConfigCopy.to = serverTime;
          }

          if (!timeConfigCopy.focusedMoment) {
            timeConfigCopy.focusedMoment = serverTime;
          }

          return timeConfig;
        })
        .distinct()
        .flatMap(timeConfig =>
          combineLatest(
            props.snapshots.map(snapshot => {
              const ops = {
                snapshotId: snapshot.get('id'),
                metric: props.metric,
                timeConfig
              };

              return getMetricsForTimeframe(ops)
                .map(metrics => {
                  return {
                    label: `${props.label}-${getLabel(snapshot)}`,
                    values: metrics.map(metricValues => metricValues.sort((a, b) => a.time - b.time))
                  };
                })
                .startWith(null);
            })
          )
        )
        .map(metrics => {
          const counters = {};
          metrics
            .filter(metric => !!metric)
            .forEach(metric => {
              counters[metric.label] = (counters[metric.label] || 0) + 1;
            });
          Object.entries(counters)
            .filter(e => e[1] > 1)
            .forEach(([label]) => {
              let i = 1;
              metrics
                .filter(metric => metric.label === label)
                .forEach(metric => {
                  metric.label += `_(${i++})`;
                });
            });
          const map = {};
          metrics.forEach(metric => {
            if (metric) {
              map[metric.label] = metric.values;
            }
          });
          return map;
        })
    };
  },
  function MetricChartDownloadView({ metric, metricValues }) {
    return (
      <DownloadView
        data={metricValues}
        fileName={`metric-${metric}`}
        getCsvData={() => getCsvData(metricValues)}
        getJsonData={() => getJsonData(metricValues)}
      />
    );
  }
);

function getCsvData(metricValues) {
  const metrics = Object.keys(metricValues);
  if (metrics.length === 0) {
    return;
  }

  const timestamps = `timestamps,${metricValues[metrics[0]].map(value => value[0]).join(',')}`;
  const lines = Object.keys(metricValues)
    .map(key => `${key.replace(/_\(\d+\)$/, '')},${metricValues[key].map(value => value[1]).join(',')}`)
    .join('\n');
  return `${timestamps}\n${lines}`;
}

function getJsonData(metricValues) {
  return JSON.stringify(metricValues, null, 4);
}
