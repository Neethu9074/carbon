import React, { Fragment } from 'react';

import { getServiceDashboard, getEndpointDashboard } from 'in-applications/navigation/paths';
import getTraceTopList from 'in-subscription/application/getTraceTopList';
import TopListPresenter from 'in-components/TopList/TopListPresenter';
import { ms, number } from 'in-services/formatters/number';
import TopList from 'in-components/TopList';
import Link from 'in-components/Link';

const metrics = ['latency', 'selfLatency', 'calls'];
const labels = ['Elapsed Latency', 'Self Latency', 'Calls'];
const aggregations = ['MEAN', 'MEAN', 'SUM'];
const formatters = [ms.compact, ms.compact, number.compact];

export default function TraceTopList({ application, timeframe }) {
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
      renderViewAll={ViewAll}
      renderLabel={Label}
      renderMetric={Metric}
      timeframe={timeframe}
      application={application}
    />
  );
}

function getItemsFromResult(result) {
  return result.data;
}

function getMetricValueFromItem(item) {
  return item.metricValue;
}

function getList({ application, timeframe, selectedMetric, selectedMetricAggregation }) {
  return getTraceTopList({
    metric: {
      metric: selectedMetric,
      aggregation: selectedMetricAggregation
    },
    filter: {
      application: application.id,
      timeframe
    }
  });
}

function ViewAll() {
  return null;
}

function Label({ item, application }) {
  return (
    <Fragment>
      <Link href$={getServiceDashboard(item.service.id, { appId: application.id })}>{item.service.label}</Link>
      {' / '}
      <Link href$={getEndpointDashboard(item.endpoint.id, { appId: application.id, serviceId: item.service.id })}>
        {item.endpoint.label}
      </Link>
    </Fragment>
  );
}

function Metric({ formattedMetricValue }) {
  return formattedMetricValue;
}
