import React from 'react';

import { getInfrastructureMetrics, getApplicationMetrics, getServiceMetrics, getEndpointMetrics } from 'in-api/metrics';
import EventMetricDownloadView from 'in-components/DownloadButton/components/EventMetricDownloadView';
import connectTo from 'in-hoc/connectTo';

const metricAggregations = {
  count: { name: 'calls', aggregation: 'SUM' },
  trace_count: { name: 'traces', aggregation: 'SUM' },
  error_rate: { name: 'errors', aggregation: 'MEAN' },
  'duration.mean': { name: 'latency', aggregation: 'MEAN' },
  'duration.25th': { name: 'latency', aggregation: 'P25' },
  'duration.50th': { name: 'latency', aggregation: 'P50' },
  'duration.75th': { name: 'latency', aggregation: 'P75' },
  'duration.95th': { name: 'latency', aggregation: 'P95' },
  'duration.98th': { name: 'latency', aggregation: 'P98' },
  'duration.99th': { name: 'latency', aggregation: 'P99' },
  'duration.max': { name: 'latency', aggregation: 'MAX' },
  'duration.min': { name: 'latency', aggregation: 'MIN' }
};

export default connectTo(
  props => {
    const metricsRequest = getMetricsRequest(props);
    const { entityType } = props;
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
  function EventMetricChartDownloadView(props) {
    const { event, metric, metricValues } = props;
    if (!metricValues || !metricValues.hasOwnProperty('items')) {
      return null;
    }
    const data = getMetricData(event, metric, metricValues['items']);
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

  let rollup;
  const oneDay = Date.now() - 1000 * 60 * 60 * 24;
  const windowSize1Sec = 600000;
  const windowSize5Sec = 3000000;
  const windowSize60Sec = 36000000;

  const to = event.get('end') ? event.get('end') : Date.now();
  let timeFrame = { to: to };

  if (plugin === null) {
    return null;
  }

  let entity20Request = {
    pagination: {
      page: 1,
      pageSize: 1
    },
    order: {
      by: 'string',
      direction: 'ASC'
    }
  };

  let infraRequest = {
    query: '*',
    plugin: plugin,
    metrics: [metric],
    snapshotIds: [metricAccessId]
  };

  const backendMetric = getBackendMetricName(metric);

  if (backendMetric != null) {
    //Time of event creation decides the Metric rollup / windowSize
    //1 hour metric data is collected upto the event end time
    if (event.get('start') - windowSize5Sec < oneDay) {
      rollup = 60;
      timeFrame.from = event.get('start') - windowSize60Sec;
      timeFrame.windowSize = windowSize60Sec;
    } else {
      rollup = 5;
      timeFrame.from = event.get('start') - windowSize5Sec;
      timeFrame.windowSize = windowSize5Sec;
    }

    entity20Request.timeFrame = timeFrame;
    entity20Request.metrics = [
      {
        metric: backendMetric.name,
        aggregation: backendMetric.aggregation,
        granularity: rollup
      }
    ];
    entity20Request.nameFilter = event.getIn(['metadata', 'entityLabel']);
  }

  if (entityType === 'Service20') {
    if (backendMetric == null) {
      return null;
    }
    entity20Request.serviceId = event.getIn(['metadata', 'app20ServiceId']);
    return entity20Request;
  } else if (entityType === 'App20') {
    if (backendMetric == null) {
      return null;
    }
    entity20Request.applicationId = event.getIn(['metadata', 'app20ApplicationId']);
    return entity20Request;
  } else if (entityType === 'Endpoint20') {
    if (backendMetric == null) {
      return null;
    }
    entity20Request.endpointId = event.getIn(['metadata', 'app20EndpointId']);
    return entity20Request;
  }

  if (event.get('start') - windowSize1Sec < oneDay) {
    rollup = 60;
    timeFrame.from = event.get('start') - windowSize60Sec;
    timeFrame.windowSize = windowSize60Sec;
  } else {
    rollup = 1;
    timeFrame.from = event.get('start') - windowSize1Sec;
    timeFrame.windowSize = windowSize1Sec;
  }
  infraRequest.rollup = rollup;
  infraRequest.timeFrame = timeFrame;
  return infraRequest;
}

function getBackendMetricName(metricName) {
  if (metricAggregations.hasOwnProperty(metricName)) {
    return metricAggregations[metricName];
  }
  return null;
}

function getJsonData(data) {
  return JSON.stringify(data, null, 2);
}

function getMetricData(event, metric, metricValues) {
  let items = metricValues[0]['metrics'];
  let values = Object.values(items)[0];
  let finalValues = [];
  values.forEach(function(v) {
    let fv = { timestamp: v[0], value: v[1] };
    finalValues.push(fv);
  });
  let data = { event: event, metrics: finalValues };
  return data;
}
