import React from 'react';

import { getEndpointDashboard, getServiceDashboard } from 'in-applications/navigation/paths';
import TopListCardPresenter from 'in-new-components/TopListCard/TopListCardPresenter';
import { meanLatencyFixed, percentage, number } from 'in-services/formatters/number';
import TopList, { trackTopListNavigation } from 'in-new-components/TopList';
import getEndpoints from 'in-subscription/application/getEndpoints';
import Link from 'in-components/Link';

const metrics = ['latency', 'calls', 'errors'];
const labels = ['Latency', 'Calls', 'Errors'];
const aggregations = ['MEAN', 'SUM', 'MEAN'];
const formatters = [meanLatencyFixed.compact, number.compact, percentage.detailed];

export default function EndpointTopList({ applicationId, serviceId, boundaryScope, timeConfig }) {
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
      boundaryScope={boundaryScope}
    />
  );
}

function getList({ applicationId, serviceId, boundaryScope, timeConfig, selectedMetric, selectedMetricAggregation }) {
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
      applicationBoundaryScope: boundaryScope,
      timeConfig
    }
  });
}

function ViewAll({ applicationId, serviceId, boundaryScope, selectedMetric }, className) {
  return (
    <Link
      className={className}
      href$={getServiceDashboard(serviceId, {
        applicationId,
        boundaryScope,
        tab: '/endpoints',
        tabMatrix: {
          'endpoint.orderBy': `${selectedMetric}Agg`,
          'endpoint.orderDirection': `DESC`
        }
      })}
    >
      View all endpoints
    </Link>
  );
}

function Label({ item, applicationId, serviceId, boundaryScope }, _item, className) {
  return (
    <Link
      className={className}
      href$={getEndpointDashboard(item.endpoint.id, { applicationId, serviceId, boundaryScope })}
      onClick={() => trackTopListNavigation()}
    >
      {item.endpoint.label}
    </Link>
  );
}

function Metric({ formattedMetricValue }) {
  return formattedMetricValue;
}
