import React from 'react';

import { getEndpointDashboard, getServiceDashboard } from 'in-applications/navigation/paths';
import TopListCardPresenter from 'in-new-components/TopListCard/TopListCardPresenter';
import getKubernetesLogs from 'in-subscription/kubernetes/getKubernetesLogs';
import TopList, { trackTopListNavigation } from 'in-new-components/TopList';
import { millis, percentage, number } from 'in-services/formatters/number';
import Link from 'in-components/Link';

const metrics = ['latency'];
const labels = ['Latency'];
const aggregations = ['MEAN'];
const formatters = [millis.fixedCompact, number.compact, percentage.detailed];

export default function LogTopList({ serviceId, timeConfig }) {
  return (
    <TopList
      title="Top Logs"
      metrics={metrics}
      labels={labels}
      aggregations={aggregations}
      formatters={formatters}
      getList={getList}
      render={TopListCardPresenter}
      renderViewAll={ViewAll}
      renderLabel={Label}
      renderMetric={Metric}
      timeConfig={timeConfig}
      serviceId={serviceId}
    />
  );
}

function getList({ serviceId, timeConfig, selectedMetric, selectedMetricAggregation }) {
  return getKubernetesLogs({
    pagination: {
      page: 1,
      pageSize: 5
    },
    order: {
      by: selectedMetric,
      direction: 'DESC'
    },
    metrics: {
      [selectedMetric]: {
        metric: selectedMetric,
        aggregation: selectedMetricAggregation
      }
    },
    filter: {
      service: serviceId,
      timeConfig
    }
  });
}

function ViewAll({ serviceId }, className) {
  return (
    <Link
      className={className}
      href$={getServiceDashboard(serviceId, {
        tab: '/endpoints'
      })}
    >
      View All
    </Link>
  );
}

function Label({ item, applicationId, serviceId }, _item, className) {
  return (
    <Link
      className={className}
      href$={getEndpointDashboard(item.endpoint.label, { applicationId, serviceId })}
      onClick={() => trackTopListNavigation()}
    >
      {item.endpoint.label}
    </Link>
  );
}

function Metric({ formattedMetricValue }) {
  return formattedMetricValue;
}
