import { combineLatest } from 'reactive-observables';
import React from 'react';

import DownloadView from 'in-components/DownloadButton/components/DownloadView';
import { getMetricsForTimeframe } from 'in-stores/metric';
import { serverTime$ } from 'in-stores/serverTime';
import { timeframe$ } from 'in-stores/timeline';
import { getLabel } from 'in-sdk/snapshot';
import connectTo from 'in-hoc/connectTo';

export default connectTo(
  props => {
    return {
      metricValues: combineLatest([timeframe$, serverTime$])
        .map(([timeframe, serverTime]) => {
          if (!timeframe.to) {
            timeframe.to = serverTime;
          }
          return timeframe;
        })
        .distinct()
        .flatMap(timeframe =>
          combineLatest(
            props.snapshots.map(snapshot => {
              const ops = {
                snapshotId: snapshot.get('id'),
                metric: props.metric,
                timeframe
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
    .map(key => `${key},${metricValues[key].map(value => value[1]).join(',')}`)
    .join('\n');
  return `${timestamps}\n${lines}`;
}

function getJsonData(metricValues) {
  return JSON.stringify(metricValues, null, 4);
}
