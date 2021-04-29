/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { Link } from '@instana/components';
import React from 'react';

import { isSyntheticOption } from 'in-applications/Dashboards/commonComponents/includeSyntheticCalls';
import { TopListWithUrlState, trackTopListNavigation } from 'in-new-components/TopListWithUrlState';
import { getApplicationDashboard, getServiceDashboard } from 'in-applications/navigation/paths';
import { meanLatencyLargeInSeconds, number, percentage } from 'in-services/formatters/number';
import TopListCardPresenter from 'in-new-components/TopListCard/TopListCardPresenter';
import getServices from 'in-subscription/application/getServices';
import theme from 'in-themes';
import { t } from 'in-i18n';

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
  syntheticCalls
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
      Renderer={TopListCardPresenter}
      ViewAll={ViewAll}
      Label={Label}
      Metric={Metric}
      CompanionMetric={CompanionMetric}
      timeConfig={timeConfig}
      applicationId={applicationId}
      boundaryScope={boundaryScope}
      colors={colors}
      urlMatrixParamConfig={urlMatrixParamConfig}
      syntheticCalls={syntheticCalls}
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
  syntheticCalls
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
      includeSyntheticCalls: isSyntheticOption(syntheticCalls)
    }
  });
}

function ViewAll({ applicationId, boundaryScope, selectedMetric, syntheticCalls, className }) {
  return (
    <Link
      className={className}
      href$={getApplicationDashboard(applicationId, {
        boundaryScope,
        syntheticCalls,
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

function Label({ item, applicationId, boundaryScope, syntheticCalls, className }) {
  return (
    <Link
      className={className}
      href$={getServiceDashboard(item.service.id, { applicationId, boundaryScope, syntheticCalls })}
      onClick={() => trackTopListNavigation()}
    >
      {item.service.label}
    </Link>
  );
}

function Metric({ formattedMetricValue }) {
  return formattedMetricValue;
}

function CompanionMetric({ formattedCompanionMetric }) {
  return <span className={locals.companion}>({formattedCompanionMetric})</span>;
}
