import React, { Fragment } from 'react';

import getLogMessageTopList from 'in-subscription/application/getLogMessageTopList';
import TopListPresenter from 'in-components/TopList/TopListPresenter';
import { number } from 'in-services/formatters/number';
import TopList from 'in-new-components/TopList';

const metrics = ['calls'];
const labels = ['Message Count'];
const aggregations = ['MEAN'];
const formatters = [number.compact];

export default function LogMessageTopList({ applicationId, serviceId, endpointId, timeframe }) {
  return (
    <TopList
      metrics={metrics}
      labels={labels}
      aggregations={aggregations}
      formatters={formatters}
      getList={getList}
      getItemsFromResult={getItemsFromResult}
      getMetricValueFromItem={getMetricValueFromItem}
      render={TopListPresenter}
      renderViewAll={false}
      renderLabel={Label}
      renderMetric={Metric}
      timeframe={timeframe}
      applicationId={applicationId}
      serviceId={serviceId}
      endpointId={endpointId}
    />
  );
}

function getItemsFromResult(result) {
  return result.data;
}

function getMetricValueFromItem(item) {
  return item.metricValue;
}

function getList({ applicationId, serviceId, endpointId, timeframe, selectedMetric, selectedMetricAggregation }) {
  return getLogMessageTopList({
    metric: {
      metric: selectedMetric,
      aggregation: selectedMetricAggregation
    },
    filter: {
      application: applicationId,
      service: serviceId,
      endpoint: endpointId,
      timeframe
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
