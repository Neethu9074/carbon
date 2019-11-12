import React from 'react';

import { getApplicationDashboard, getServiceDashboard } from 'in-applications/navigation/paths';
import TopListCardPresenter from 'in-new-components/TopListCard/TopListCardPresenter';
import TopList, { trackTopListNavigation } from 'in-new-components/TopList';
import { meanLatencyFixed, percentage, number } from 'in-services/formatters/number';
import getServices from 'in-subscription/application/getServices';
import Link from 'in-components/Link';

const metrics = ['latency', 'calls', 'errors'];
const labels = ['Latency', 'Calls', 'Errors'];
const aggregations = ['MEAN', 'SUM', 'MEAN'];
const formatters = [meanLatencyFixed.compact, number.compact, percentage.detailed];

export default function ServiceTopList({ applicationId, boundaryScope, timeConfig }) {
  return (
    <TopList
      title="Top Services"
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
      boundaryScope={boundaryScope}
    />
  );
}

function getList({ applicationId, boundaryScope, timeConfig, selectedMetric, selectedMetricAggregation }) {
  return getServices({
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
