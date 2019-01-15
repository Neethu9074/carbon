import React from 'react';

import { getInfrastructureMetrics, getApplicationMetrics, getServiceMetrics, getEndpointMetrics } from 'in-api/metrics';
import EventMetricDownloadView from 'in-components/DownloadButton/components/EventMetricDownloadView';
import connectTo from 'in-hoc/connectTo';

export default connectTo(
  props => {
    const { entityType, metricsRequest } = props;
    if (entityType === 'Service20') {
      return {
        metricValues: getServiceMetrics(metricsRequest)
      };
    } else if (entityType === 'App20') {
      return {
        metricValues: getApplicationMetrics(metricsRequest)
      };
    } else if (entityType === 'Endpoint20') {
      return {
        metricValues: getEndpointMetrics(metricsRequest)
      };
    }
    // else assume 'Entity10'
    return {
      metricValues: getInfrastructureMetrics(metricsRequest)
    };
  },
  function EventMetricChartDownloadView({ event, metric, metricsRequest, metricValues }) {
    if (!metricValues) {
      return null;
    }
    const data = getMetricData(event, metric, metricsRequest.metrics.shift(), metricValues);
    return (
      <EventMetricDownloadView
        data={data}
        metric={metric}
        metrics={metricsRequest.metrics.shift()}
        event={event}
        fileName={`metric-${metric}`}
        getJsonData={() => getJsonData(data)}
      />
    );
  }
);

function getJsonData(data) {
  return JSON.stringify(data, null, 4);
}

function getMetricData(event, metric, metrics, metricValues) {
  var values = parseMetricValues(metric, metrics, metricValues);
  var finalValues = [];
  values.forEach(function(v) {
    let fv = { timestamp: v[0], value: v[1] };
    finalValues.push(fv);
  });
  let data = { event: event, metrics: finalValues };
  return data;
}

function parseMetricValues(metric, metrics, metricValues) {
  var array = Array.from(metricValues.get('items'));
  var data = array
    .shift()
    .get('metrics')
    .toJS();
  if (data.hasOwnProperty(metric)) {
    return data[metric];
  } else {
    var key = metrics.metric + '.' + metrics.aggregation.toLowerCase() + '.' + metrics.granularity;
    return data[key];
  }
}
