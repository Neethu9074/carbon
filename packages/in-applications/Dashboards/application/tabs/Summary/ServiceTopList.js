import React from 'react';

import { getApplicationDashboard, getServiceDashboard } from 'in-applications/navigation/paths';
import { meanLatencyLargeInSeconds, number, percentage } from 'in-services/formatters/number';
import TopListCardPresenter from 'in-new-components/TopListCard/TopListCardPresenter';
import TopList, { trackTopListNavigation } from 'in-new-components/TopList';
import getServices from 'in-subscription/application/getServices';
import Link from 'in-components/Link';
import theme from 'in-themes';

import locals from './ServiceTopList.mless';

const metrics = ['latency', 'calls', 'erroneousCalls'];
const labels = ['Latency', 'Calls', 'Erroneous Calls'];
const aggregations = ['MEAN', 'SUM', 'SUM'];
const formatters = [meanLatencyLargeInSeconds.compact, number.compact, number.compact];
const companionMetrics = [null, null, 'errors'];
const companionAggregations = [null, null, 'MEAN'];
const companionFormatters = [null, null, percentage.detailed];
const colors = [null, null, theme.lib.colors.failure];

export default function ServiceTopList({ applicationId, boundaryScope, timeConfig }) {
  return (
    <TopList
      title="Top Services"
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
      boundaryScope={boundaryScope}
      colors={colors}
    />
  );
}

function getList({
  applicationId,
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

  return getServices({
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
      applicationBoundaryScope: boundaryScope,
      timeConfig
    }
  });
}

function ViewAll({ applicationId, boundaryScope, selectedMetric }, className) {
  return (
    <Link
      className={className}
      href$={getApplicationDashboard(applicationId, {
        boundaryScope,
        tab: '/services',
        tabMatrix: {
          'service.orderBy': `${selectedMetric}Agg`,
          'service.orderDirection': `DESC`
        }
      })}
    >
      View all services
    </Link>
  );
}

function Label({ item, applicationId, boundaryScope }, _item, className) {
  return (
    <Link
      className={className}
      href$={getServiceDashboard(item.service.id, { applicationId, boundaryScope })}
      onClick={() => trackTopListNavigation()}
    >
      {item.service.label}
    </Link>
  );
}

function Metric({ formattedMetricValue }) {
  return formattedMetricValue;
}

function RenderCompanionMetric({ formattedCompanionMetric }) {
  return <span className={locals.companion}>({formattedCompanionMetric})</span>;
}
