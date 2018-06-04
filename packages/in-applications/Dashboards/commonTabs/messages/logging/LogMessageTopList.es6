import React, { Fragment } from 'react';

import TopListCardPresenter from 'in-new-components/TopListCard/TopListCardPresenter';
import getLogMessageTopList from 'in-subscription/application/getLogMessageTopList';
import { number } from 'in-services/formatters/number';
import TopList from 'in-new-components/TopList';

const metrics = ['calls'];
const labels = ['Message Count'];
const aggregations = ['MEAN'];
const formatters = [number.compact];

export default function LogMessageTopList({ applicationId, serviceId, endpointId, timeConfig }) {
  return (
    <TopList
      title="Most Frequent Messages"
      metrics={metrics}
      labels={labels}
      aggregations={aggregations}
      formatters={formatters}
      getList={getList}
      getItemsFromResult={getItemsFromResult}
      getMetricValueFromItem={getMetricValueFromItem}
      render={TopListCardPresenter}
      renderLabel={Label}
      renderMetric={Metric}
      timeConfig={timeConfig}
      applicationId={applicationId}
      serviceId={serviceId}
      endpointId={endpointId}
    />
  );
}

function getItemsFromResult(result) {
  return result.data;
}

function getMetricValueFromItem(metricId, item) {
  return item.metricValue;
}

function getList({ applicationId, serviceId, endpointId, timeConfig, selectedMetric, selectedMetricAggregation }) {
  return getLogMessageTopList({
    metric: {
      metric: selectedMetric,
      aggregation: selectedMetricAggregation
    },
    filter: {
      application: applicationId,
      service: serviceId,
      endpoint: endpointId,
      timeConfig
    }
  });
}

function Label({ item }) {
  return (
    <Fragment>
      {item.level}: {item.message}
    </Fragment>
  );
}

function Metric({ formattedMetricValue }) {
  return formattedMetricValue;
}
