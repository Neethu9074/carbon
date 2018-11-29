import React from 'react';

import { getEndpointDashboard, getServiceDashboard } from 'in-applications/navigation/paths';
import TopListCardPresenter from 'in-new-components/TopListCard/TopListCardPresenter';
import TopList, { trackTopListNavigation } from 'in-new-components/TopList';
import { millis, percentage, number } from 'in-services/formatters/number';
import getEndpoints from 'in-subscription/application/getEndpoints';
import Link from 'in-components/Link';

const metrics = ['latency', 'calls', 'errors'];
const labels = ['Latency', 'Calls', 'Errors'];
const aggregations = ['MEAN', 'SUM', 'MEAN'];
const formatters = [millis.fixedCompact, number.compact, percentage.detailed];

export default function EndpointTopList({ applicationId, serviceId, timeConfig }) {
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
      timeConfig={timeConfig}
      applicationId={applicationId}
      serviceId={serviceId}
    />
  );
}

function getList({ applicationId, serviceId, timeConfig, selectedMetric, selectedMetricAggregation }) {
  return getEndpoints({
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
      application: applicationId,
      service: serviceId,
      includeSyntheticCalls: false,
      timeConfig
    }
  });
}

function ViewAll({ applicationId, serviceId, selectedMetric }, className) {
  return (
    <Link
      className={className}
      href$={getServiceDashboard(serviceId, {
        applicationId,
        tab: '/endpoints',
        tabMatrix: {
          'endpoint.orderBy': `${selectedMetric}Agg`,
          'endpoint.orderDirection': `DESC`
        }
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
