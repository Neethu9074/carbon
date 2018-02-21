import React, { Fragment } from 'react';

import { getServiceDashboard, getEndpointDashboard } from 'in-applications/navigation/paths';
import TopListCardPresenter from 'in-new-components/TopListCard/TopListCardPresenter';
import getTraceTopList from 'in-subscription/application/getTraceTopList';
import { ms, number } from 'in-services/formatters/number';
import TopList from 'in-new-components/TopList';
import Link from 'in-components/Link';

const metrics = ['latency', 'selfLatency', 'calls'];
const labels = ['Elapsed Latency', 'Self Latency', 'Calls'];
const aggregations = ['MEAN', 'MEAN', 'SUM'];
const formatters = [ms.compact, ms.compact, number.compact];

export default function TraceTopList({ applicationId, serviceId, endpointId, timeframe }) {
  return (
    <TopList
      title="Top Traces"
      metrics={metrics}
      labels={labels}
      aggregations={aggregations}
      formatters={formatters}
      getList={getList}
      getItemsFromResult={getItemsFromResult}
      getMetricValueFromItem={getMetricValueFromItem}
      render={TopListCardPresenter}
      renderViewAll={ViewAll}
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
  return getTraceTopList({
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

function ViewAll() {
  return null;
}

function Label({ item, applicationId }) {
  return (
    <Fragment>
      <Fragment>
        <Link href$={getServiceDashboard(item.service.id, { applicationId })}>{item.service.label}</Link>
        {' / '}
      </Fragment>
      <Link href$={getEndpointDashboard(item.endpoint.id, { applicationId, serviceId: item.service.id })}>
        {item.endpoint.label}
      </Link>
    </Fragment>
  );
}

function Metric({ formattedMetricValue }) {
  return formattedMetricValue;
}
