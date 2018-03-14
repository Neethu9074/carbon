import React from 'react';

import TopListCardPresenter from 'in-new-components/TopListCard/TopListCardPresenter';
import List from 'in-applications/Dashboards/commonComponents/TopTraces/List';
import getTraceTopList from 'in-subscription/application/getTraceTopList';
import { millis, number } from 'in-services/formatters/number';
import TopList from 'in-new-components/TopList';

const metrics = ['weight', 'calls', 'latency'];
const labels = ['Weight', 'Calls', 'Latency'];
const aggregations = ['MEAN', 'SUM', 'MEAN'];
const formatters = [millis.fixedCompact, number.fixedCompact, millis.fixedCompact];

export default function TraceTopList({ applicationId, serviceId, endpointId, timeframe }) {
  return (
    <TopList
      title="Top Traces"
      metrics={metrics}
      labels={labels}
      aggregations={aggregations}
      formatters={formatters}
      getList={getList}
      render={TopListCardPresenter}
      List={List}
      timeframe={timeframe}
      applicationId={applicationId}
      serviceId={serviceId}
      endpointId={endpointId}
    />
  );
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
