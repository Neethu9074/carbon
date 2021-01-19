/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import EventMetricDownloadView from 'in-components/DownloadButton/components/EventMetricDownloadView';
import { isAppDataEntityType } from 'in-services/entityUtils';
import { days, hours, minutes } from 'in-services/time';
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
      getJsonData={() => getJsonTextData(event, metric, metricValues)}
    />
  );
});

function getMetricsRequest(props) {
  const { event, entityType, plugin, metric, metricAccessId } = props;

  const now = Date.now();
  const oneHourWindowSize = hours.toMillis(1);
  const oneDay = now - days.toMillis(1);
  const tenHoursWindowSize = hours.toMillis(10);
  // Extract metrics from 55 mins before event start to 5 mins after event start
  const to = event.get('start') + minutes.toMillis(5);

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
    if (isAppDataEntityType(entityType) && !customIssue) {
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

function getJsonTextData(event, metric, metricValues) {
  const metricData = metricValues['metrics'][metric];
  const content = {
    event,
    metrics: mapMetricsToSeparatedTimeAndValueListIfPresent(metricData)
  };
  return JSON.stringify(content, null, 2);
}

function mapMetricsToSeparatedTimeAndValueListIfPresent(items) {
  if (!items) {
    return null;
  }
  const timestamps = [];
  const values = [];
  items.forEach(v => {
    timestamps.push(v[0]);
    values.push(v[1]);
  });
  return {
    timestamps: timestamps,
    values: values
  };
}
