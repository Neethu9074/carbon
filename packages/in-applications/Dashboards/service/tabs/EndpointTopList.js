import theme from 'in-themes';
import React from 'react';

import { meanLatencyLargeInSeconds, number, percentage } from 'in-services/formatters/number';
import { getEndpointDashboard, getServiceDashboard } from 'in-applications/navigation/paths';
import TopListCardPresenter from 'in-new-components/TopListCard/TopListCardPresenter';
import TopList, { trackTopListNavigation } from 'in-new-components/TopList';
import getEndpoints from 'in-applications/subscriptions/getEndpoints';
import Link from 'in-components/Link';

import locals from './EndpointTopList.mless';

const metrics = ['latency', 'calls', 'erroneousCalls'];
const labels = ['Latency', 'Calls', 'Erroneous Calls'];
const aggregations = ['MEAN', 'SUM', 'SUM'];
const formatters = [meanLatencyLargeInSeconds.compact, number.compact, number.compact];
const companionMetrics = [null, null, 'errors'];
const companionAggregations = [null, null, 'MEAN'];
const companionFormatters = [null, null, percentage.detailed];
const colors = [null, null, theme.lib.colors.failure];

export default function EndpointTopList({ applicationId, serviceId, boundaryScope: boundaryScope, timeConfig }) {
  return (
    <TopList
      title="Top Endpoints"
      metrics={metrics}
      labels={labels}
      aggregations={aggregations}
      formatters={formatters}
      companionMetrics={companionMetrics}
      companionAggregations={companionAggregations}
      companionFormatters={companionFormatters}
      getList={getList}
      render={TopListCardPresenter}
      renderViewAll={ViewAll}
      renderLabel={Label}
      renderMetric={Metric}
      renderCompanionMetric={RenderCompanionMetric}
      timeConfig={timeConfig}
      applicationId={applicationId}
      serviceId={serviceId}
      boundaryScope={boundaryScope}
      colors={colors}
    />
  );
}

function getList({
  applicationId,
  serviceId,
  boundaryScope,
  timeConfig,
  selectedMetric,
  selectedMetricAggregation,
  selectedCompanionMetric,
  selectedCompanionMetricAggregation
}) {
  const metrics = {
    [selectedMetric]: {
      metric: selectedMetric,
      aggregation: selectedMetricAggregation
    }
  };
  if (selectedCompanionMetric) {
    metrics[selectedCompanionMetric] = {
      metric: selectedCompanionMetric,
      aggregation: selectedCompanionMetricAggregation
    };
  }
  return getEndpoints({
    pagination: {
      page: 1,
      pageSize: 5
    },
    order: {
      by: selectedMetric,
      direction: 'DESC'
    },
    metrics: metrics,
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

function RenderCompanionMetric({ formattedCompanionMetric }) {
  return <span className={locals.companion}>({formattedCompanionMetric})</span>;
}
