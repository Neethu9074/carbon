import { combineLatest } from 'reactive-observables';
import React from 'react';

import EventMetricDownloadView from 'in-components/DownloadButton/components/EventMetricDownloadView';
import { getMetricsForTimeframe } from 'in-stores/metric';
import { serverTime$ } from 'in-stores/serverTime';
import { timeConfig$ } from 'in-stores/timeline';
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
            props.snapshotId.map(snapshotId => {
              const ops = {
                snapshotId: snapshotId,
                metric: props.metric,
                timeConfig
              };

              return getMetricsForTimeframe(ops)
                .map(metrics => {
                  return {
                    label: `${props.label}`,
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
  function EventMetricChartDownloadView({ event, metric, metricValues }) {
    return (
      <EventMetricDownloadView
        data={metricValues}
        fileName={`metric-${metric}`}
        getJsonData={() => getJsonData(event, metric, metricValues)}
      />
    );
  }
);

function getJsonData(event, metric, metricValues) {
  let values = metricValues[metric];
  var finalValues = [];
  values.forEach(function(v) {
    let fv = { timestamp: v[0], value: v[1] };
    finalValues.push(fv);
  });
  let data = { event: event, values: finalValues };
  return JSON.stringify(data);
}
