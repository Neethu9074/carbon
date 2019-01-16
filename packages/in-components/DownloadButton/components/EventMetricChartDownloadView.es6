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
  let { event, timeConfig, rollup, entityType, plugin, metric, metricAccessId } = props;
  const timeFrame = {
    //From time is set to 20 Minutes before the event triggering timeout
    // as some algorithms need some time (more data) to warm up
    from: event.get('triggeringTime') - 1000 * 60 * 20,
    to: timeConfig.to ? timeConfig.to : Date.now(),
    windowSize: timeConfig.windowSize
  };

  if (plugin === null) {
    return null;
  }

  if (rollup === 0) {
    rollup = 5000;
  }

  let entity20Request = {
    pagination: {
      page: 1,
      pageSize: 1
    },
    order: {
      by: 'string',
      direction: 'ASC'
    },
    timeFrame: timeFrame
  };

  let infraRequest = {
    timeFrame: timeFrame,
    query: '*',
    plugin: plugin,
    metrics: [metric],
    rollup: rollup / 1000,
    snapshotIds: [metricAccessId]
  };

  const backendMetric = getBackendMetricName(metric);

  if (backendMetric != null) {
    entity20Request.metrics = [
      {
        metric: backendMetric.name,
        aggregation: backendMetric.aggregation,
        granularity: rollup / 1000
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
  return infraRequest;
}

function getBackendMetricName(metricName) {
  if (metricAggregations.hasOwnProperty(metricName)) {
    return metricAggregations[metricName];
  }
  return null;
}

function getJsonData(data) {
  return JSON.stringify(data, null, 4);
}

function getMetricData(event, metric, metricValues) {
  var items = metricValues[0]['metrics'];
  var values = Object.values(items)[0];
  var finalValues = [];
  values.forEach(function(v) {
    let fv = { timestamp: v[0], value: v[1] };
    finalValues.push(fv);
  });
  let data = { event: event, metrics: finalValues };
  return data;
}
