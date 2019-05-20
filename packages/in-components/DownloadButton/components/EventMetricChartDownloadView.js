import React from 'react';

import EventMetricDownloadView from 'in-components/DownloadButton/components/EventMetricDownloadView';
import { is20Type } from 'in-services/entityUtils';
import { getMetrics } from 'in-api/metrics';
import connectTo from 'in-hoc/connectTo';

export default connectTo(props => ({
  metricValues: getMetrics(getMetricsRequest(props))
}))(function EventMetricChartDownloadView(props) {
  const { event, metric, metricValues } = props;
  if (!metricValues) {
    return null;
  }
  return (
    <EventMetricDownloadView
      fileName={`event-${event.get('id')}-fp-report`}
      getJsonData={() => getJsonData(event, metric, metricValues)}
    />
  );
});

function getMetricsRequest(props) {
  const { event, entityType, plugin, metric, metricAccessId } = props;

  const now = Date.now();
  const oneHourWindowSize = 1000 * 60 * 60;
  const oneDay = now - oneHourWindowSize * 24;
  const tenHoursWindowSize = oneHourWindowSize * 10;
  // Extract metrics from 55 mins before event start to 5 mins after event start
  const to = event.get('start') + 1000 * 60 * 5;

  if (plugin === null) {
    return null;
  }
  const customIssue = event.getIn(['metadata', 'custom_issue']);
  const timeFrame = { to: to };
  let rollup;

  if (to - oneHourWindowSize < oneDay) {
    rollup = 60;
    timeFrame.from = to - tenHoursWindowSize;
    timeFrame.windowSize = tenHoursWindowSize;
  } else {
    if (is20Type(entityType) && !customIssue) {
      rollup = 5;
    } else {
      rollup = 1;
    }
    timeFrame.from = to - oneHourWindowSize;
    timeFrame.windowSize = oneHourWindowSize;
  }

  return {
    query: '*',
    plugin,
    rollup,
    timeFrame,
    metrics: [metric],
    snapshotIds: [metricAccessId]
  };
}

function getJsonData(event, metric, metricValues) {
  const data = getMetricData(event, metric, metricValues['metrics']);
  return JSON.stringify(data, null, 2);
}

function getMetricData(event, metric, metricValues) {
  return {
    event,
    metrics: mapMetricsToHumanReadableFormatIfPresent(metricValues[metric])
  };
}

function mapMetricsToHumanReadableFormatIfPresent(items) {
  if (!items) {
    return null;
  }

  return items.map(v => ({ timestamp: v[0], value: v[1] }));
}
