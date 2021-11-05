/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { Link } from '@instana/components';

import { isSyntheticOption } from 'in-applications/Dashboards/commonComponents/includeSyntheticCalls';
import { TopListWithUrlState, trackTopListNavigation } from 'in-components/TopListWithUrlState';
import { meanLatencyLargeInSeconds, number, percentage } from 'in-services/formatters/number';
import { getEndpointDashboard, getServiceDashboard } from 'in-applications/navigation/paths';
import TopListCardPresenter from 'in-components/TopListCard/TopListCardPresenter';
import getEndpoints from 'in-applications/subscriptions/getEndpoints';
import theme from 'in-themes';
import { t } from 'in-i18n';

import locals from './EndpointTopList.mless';

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

export default function EndpointTopList({
  applicationId,
  serviceId,
  boundaryScope,
  timeConfig,
  urlMatrixParamConfig,
  syntheticCalls
}) {
  return (
    <TopListWithUrlState
      title={t('in-applications:titleTopEndpoints')}
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
      serviceId={serviceId}
      boundaryScope={boundaryScope}
      colors={colors}
      urlMatrixParamConfig={urlMatrixParamConfig}
      syntheticCalls={syntheticCalls}
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
      includeSyntheticCalls: isSyntheticOption(syntheticCalls),
      applicationBoundaryScope: boundaryScope,
      timeConfig
    }
  });
}

function ViewAll({ applicationId, serviceId, boundaryScope, selectedMetric, syntheticCalls, className }) {
  return (
    <Link
      className={className}
      href$={getServiceDashboard(serviceId, {
        applicationId,
        boundaryScope,
        syntheticCalls,
        tab: '/endpoints',
        tabMatrix: {
          'endpoint.orderBy': `${selectedMetric}Agg`,
          'endpoint.orderDirection': `DESC`
        }
      })}
    >
      {t('in-applications:linkViewAllEndpoints')}
    </Link>
  );
}

function Label({ item, applicationId, serviceId, boundaryScope, syntheticCalls, className }) {
  return (
    <Link
      className={className}
      href$={getEndpointDashboard(item.endpoint.id, { applicationId, serviceId, boundaryScope, syntheticCalls })}
      onClick={() => trackTopListNavigation()}
    >
      {item.endpoint.label}
    </Link>
  );
}

function Metric({ formattedMetricValue }) {
  return formattedMetricValue;
}

function CompanionMetric({ formattedCompanionMetric }) {
  return <span className={locals.companion}>({formattedCompanionMetric})</span>;
}
