import React from 'react';

import { getApplicationDashboard, getServiceDashboard } from 'in-applications/navigation/paths';
import TopListCardPresenter from 'in-new-components/TopListCard/TopListCardPresenter';
import { millis, percentage, number } from 'in-services/formatters/number';
import getServices from 'in-subscription/application/getServices';
import TopList from 'in-new-components/TopList';
import Link from 'in-components/Link';

const metrics = ['latency', 'calls', 'errors'];
const labels = ['Latency', 'Calls', 'Errors'];
const aggregations = ['MEAN', 'SUM', 'MEAN'];
const formatters = [millis.fixedCompact, number.compact, percentage.compact];

export default function ServiceTopList({ applicationId, timeframe }) {
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
      timeframe={timeframe}
      applicationId={applicationId}
    />
  );
}

function getList({ applicationId, timeframe, selectedMetric, selectedMetricAggregation }) {
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
      timeframe
    }
  });
}

function ViewAll({ applicationId, selectedMetric }) {
  return (
    <Link
      href$={getApplicationDashboard(applicationId, {
        tab: '/services',
        tabMatrix: {
          'service.orderBy': `${selectedMetric}Agg`,
          'service.orderDirection': `DESC`
        }
      })}
    >
      View All
    </Link>
  );
}

function Label({ item, applicationId }) {
  return <Link href$={getServiceDashboard(item.service.id, { applicationId })}>{item.service.label}</Link>;
}

function Metric({ formattedMetricValue }) {
  return formattedMetricValue;
}
