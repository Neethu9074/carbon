import React from 'react';

import { getEndpointDashboard, getServiceDashboard } from 'in-applications/navigation/paths';
import TopListCardPresenter from 'in-new-components/TopListCard/TopListCardPresenter';
import { millis, percentage, number } from 'in-services/formatters/number';
import getEndpoints from 'in-subscription/application/getEndpoints';
import TopList from 'in-new-components/TopList';
import Link from 'in-components/Link';

const metrics = ['latency', 'selfLatency', 'calls', 'errors'];
const labels = ['Elapsed Latency', 'Self Latency', 'Calls', 'Errors'];
const aggregations = ['MEAN', 'MEAN', 'SUM', 'MEAN'];
const formatters = [millis.fixedCompact, millis.fixedCompact, number.compact, percentage.compact];

export default function EndpointTopList({ applicationId, serviceId, timeframe }) {
  return (
    <TopList
      title="Top Endpoints"
      metrics={metrics}
      labels={labels}
      aggregations={aggregations}
      formatters={formatters}
      getList={getList}
      render={TopListCardPresenter}
      renderViewAll={ViewAll}
      renderLabel={Label}
      renderMetric={Metric}
      timeframe={timeframe}
      applicationId={applicationId}
      serviceId={serviceId}
    />
  );
}

function getList({ applicationId, serviceId, timeframe, selectedMetric, selectedMetricAggregation }) {
  return getEndpoints({
    pagination: {
      page: 1,
      pageSize: 5
    },
    order: {
      by: 'metric',
      direction: 'DESC'
    },
    metrics: {
      metric: {
        metric: selectedMetric,
        aggregation: selectedMetricAggregation
      }
    },
    filter: {
      application: applicationId,
      service: serviceId,
      timeframe
    }
  });
}

function ViewAll({ applicationId, serviceId }) {
  return <Link href$={getServiceDashboard(serviceId, { applicationId, tab: '/endpoints' })}>View All</Link>;
}

function Label({ item, applicationId, serviceId }) {
  return (
    <Link href$={getEndpointDashboard(item.endpoint.id, { applicationId, serviceId })}>{item.endpoint.label}</Link>
  );
}

function Metric({ formattedMetricValue }) {
  return formattedMetricValue;
}
