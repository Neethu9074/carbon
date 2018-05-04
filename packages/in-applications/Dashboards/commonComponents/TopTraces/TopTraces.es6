import React from 'react';

import TopListCardPresenter from 'in-new-components/TopListCard/TopListCardPresenter';
import List from 'in-applications/Dashboards/commonComponents/TopTraces/List';
import getTraceTopList from 'in-subscription/application/getTraceTopList';
import { millis } from 'in-services/formatters/number';
import TopList from 'in-new-components/TopList';

const metrics = ['latency'];
const labels = ['Latency'];
const aggregations = ['MEAN'];
const formatters = [millis.fixedCompact];

export default function TopTraces({ applicationId, serviceId, endpointId, timeConfig }) {
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
      timeConfig={timeConfig}
      applicationId={applicationId}
      serviceId={serviceId}
      endpointId={endpointId}
    />
  );
}

function getList({ applicationId, serviceId, endpointId, timeConfig, selectedMetric, selectedMetricAggregation }) {
  return getTraceTopList({
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
