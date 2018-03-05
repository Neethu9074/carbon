import React from 'react';

import TopListCardPresenter from 'in-new-components/TopListCard/TopListCardPresenter';
import getTraceTopList from 'in-subscription/application/getTraceTopList';
import { ms, number } from 'in-services/formatters/number';
import TopList from 'in-new-components/TopList';
import Tooltip from 'in-components/Tooltip';
import Link from 'in-components/Link';

const metrics = ['latency', 'calls'];
const labels = ['Latency', 'Calls'];
const aggregations = ['MEAN', 'SUM'];
const formatters = [ms.compact, number.compact];

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

function getMetricValueFromItem(metricId, item) {
  return item.contributed;
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

function Label({ item }) {
  return (
    <Tooltip content="Coming soon" align="topMiddle">
      <Link href="" onClick={e => e.preventDefault()}>
        {item.endpoint.label}
      </Link>
    </Tooltip>
  );
}

function Metric({ formattedMetricValue }) {
  return formattedMetricValue;
}
