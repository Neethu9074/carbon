/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { t } from 'in-i18n';
import React from 'react';

import { getApplicationDashboard, getServiceDashboard } from 'in-applications/navigation/paths';
import { TopListWithUrlState, trackTopListNavigation } from 'in-new-components/TopListWithUrlState';
import { meanLatencyLargeInSeconds, number, percentage } from 'in-services/formatters/number';
import TopListCardPresenter from 'in-new-components/TopListCard/TopListCardPresenter';
import getServices from 'in-subscription/application/getServices';
import Link from 'in-components/Link';
import theme from 'in-themes';

import locals from './ServiceTopList.mless';

const metrics = ['latency', 'calls', 'erroneousCalls'];
const labels = [
  t('in-applications:labelLatency'),
  t('in-applications:labelCalls'),
  t('in-applications:titleErroneousCalls')
];
const aggregations = ['MEAN', 'SUM', 'SUM'];
const formatters = [meanLatencyLargeInSeconds.compact, number.compact, number.compact];
const companionMetrics = [null, null, 'errors'];
const companionAggregations = [null, null, 'MEAN'];
const companionFormatters = [null, null, percentage.detailed];
const colors = [null, null, theme.lib.colors.failure];

export default function ServiceTopList({
  applicationId,
  boundaryScope,
  timeConfig,
  urlMatrixParamConfig,
  includeSyntheticCalls
}) {
  return (
    <TopListWithUrlState
      title={t('in-applications:titleTopServices')}
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
      urlMatrixParamConfig={urlMatrixParamConfig}
      includeSyntheticCalls={includeSyntheticCalls}
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
  selectedCompanionMetricAggregation,
  includeSyntheticCalls
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
      timeConfig,
      includeSyntheticCalls
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
      {t('in-applications:linkViewAllServices')}
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
