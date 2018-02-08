import React from 'react';

import { getApplicationDashboard, getServiceDashboard } from 'in-applications/navigation/paths';
import { ms, percentage, number } from 'in-services/formatters/number';
import TopListPresenter from 'in-components/TopList/TopListPresenter';
import getServices from 'in-subscription/application/getServices';
import TopList from 'in-components/TopList';
import Link from 'in-components/Link';

const metrics = ['latency', 'selfLatency', 'calls', 'errors'];
const labels = ['Elapsed Latency', 'Self Latency', 'Calls', 'Errors'];
const aggregations = ['MEAN', 'MEAN', 'SUM', 'MEAN'];
const formatters = [ms.compact, ms.compact, number.compact, percentage.compact];

export default function ServiceTopList({ application, timeframe }) {
  return (
    <TopList
      metrics={metrics}
      labels={labels}
      aggregations={aggregations}
      formatters={formatters}
      getList={getList}
      render={TopListPresenter}
      renderViewAll={ViewAll}
      renderLabel={Label}
      renderMetric={Metric}
      timeframe={timeframe}
      application={application}
    />
  );
}

function getList({ application, timeframe, selectedMetric, selectedMetricAggregation }) {
  return getServices({
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
      application: application.id,
      timeframe
    }
  });
}

function ViewAll({ application }) {
  return <Link href$={getApplicationDashboard(application.id, { tab: '/services' })}>View All</Link>;
}

function Label({ item, application }) {
  return <Link href$={getServiceDashboard(item.service.id, { appId: application.id })}>{item.service.label}</Link>;
}

function Metric({ formattedMetricValue }) {
  return formattedMetricValue;
}
