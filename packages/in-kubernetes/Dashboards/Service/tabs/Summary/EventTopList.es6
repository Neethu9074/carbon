import React from 'react';

import { getEndpointDashboard, getServiceDashboard } from 'in-applications/navigation/paths';
import TopListCardPresenter from 'in-new-components/TopListCard/TopListCardPresenter';
import getKubernetesEvents from 'in-subscription/kubernetes/getKubernetesEvents';
import TopList, { trackTopListNavigation } from 'in-new-components/TopList';
import { millis, percentage, number } from 'in-services/formatters/number';
import Link from 'in-components/Link';

const metrics = ['latency'];
const labels = ['Latency'];
const aggregations = ['MEAN'];
const formatters = [millis.fixedCompact, number.compact, percentage.detailed];

export default function EventTopList({ serviceId, timeConfig }) {
  return (
    <TopList
      title="Top Events"
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
  return getKubernetesEvents({
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
