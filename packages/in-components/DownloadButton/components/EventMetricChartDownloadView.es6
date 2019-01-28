import React from 'react';

import { getMetrics } from 'in-api/metrics';
import EventMetricDownloadView from 'in-components/DownloadButton/components/EventMetricDownloadView';
import connectTo from 'in-hoc/connectTo';

export default connectTo(
  props => {
    const metricsRequest = getMetricsRequest(props);
    return {
      metricValues: getMetrics(metricsRequest)
    };
  },
  function EventMetricChartDownloadView(props) {
    const { event, metric, metricValues } = props;
    if (!metricValues) {
      return null;
    }
    const data = getMetricData(event, metric, metricValues['metrics']);
    return (
      <EventMetricDownloadView
        data={data}
        metric={metric}
        fileName={`metric-${metric}`}
        getJsonData={() => getJsonData(data)}
      />
    );
  }
);

function getMetricsRequest(props) {
  let { event, entityType, plugin, metric, metricAccessId } = props;
  const oneDay = Date.now() - 1000 * 60 * 60 * 24;
  const windowSize = 3600000;
  const windowSize60Sec = 36000000;
  let rollup;

  const to = event.get('end') ? event.get('end') : Date.now();
  let timeFrame = { to: to };

  if (plugin === null) {
    return null;
  }

  if (oneDay - event.get('start') > windowSize) {
    rollup = 60;
    timeFrame.from = to - windowSize60Sec;
    timeFrame.windowSize = windowSize60Sec;
  } else {
    if (entityType === 'Service20' || entityType === 'App20' || entityType === 'Endpoint20') {
      rollup = 5;
    } else {
      rollup = 1;
    }
    timeFrame.from = to - windowSize;
    timeFrame.windowSize = windowSize;
  }

  let request = {
    query: '*',
    plugin: plugin,
    metrics: [metric],
    snapshotIds: [metricAccessId]
  };

  request.rollup = rollup;
  request.timeFrame = timeFrame;
  return request;
}

function getJsonData(data) {
  return JSON.stringify(data, null, 2);
}

function getMetricData(event, metric, metricValues) {
  let data = { event: event };
  let items = metricValues[metric];
  if (!items) {
    return data;
  }
  let finalValues = [];
  items.forEach(function(v) {
    let fv = { timestamp: v[0], value: v[1] };
    finalValues.push(fv);
  });
  data.metrics = finalValues;
  return data;
}
