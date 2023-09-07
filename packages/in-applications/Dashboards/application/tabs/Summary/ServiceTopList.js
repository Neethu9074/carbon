/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { Link } from '@instana/components';

import { useLinkToApplicationDashboard, useLinkToServiceDashboard } from 'in-applications/navigation/paths';
import { TopListWithUrlState, trackTopListNavigation } from 'in-components/TopListWithUrlState';
import { meanLatencyLargeInSeconds, number, percentage } from 'in-services/formatters/number';
import TopListCardPresenter from 'in-components/TopListCard/TopListCardPresenter';
import getTopServices from 'in-applications/subscriptions/getTopServices';
import theme from 'in-themes';
import { t } from 'in-i18n';

import locals from './ServiceTopList.mless';

const metrics = ['latency', 'calls', 'errors'];
const labels = [
  t('in-applications:labelLatency'),
  t('in-applications:labelCalls'),
  t('in-applications:titleErroneousCallRate')
];
const aggregations = ['MEAN', 'SUM', 'MEAN'];
const formatters = [meanLatencyLargeInSeconds.compact, number.compact, percentage.detailed];
const companionMetrics = [null, 'calls', 'erroneousCalls'];
const companionAggregations = [null, 'PER_SECOND', 'SUM'];
const companionFormatters = [null, number.perSecond.compact, number.compact];
const colors = [null, null, theme.lib.colors.failure];

export default function ServiceTopList({
  applicationId,
  boundaryScope,
  timeConfig,
  urlMatrixParamConfig,
  syntheticCalls,
  renderHistoricDataIndicator,
  renderWidgetNotSupportedIndicator
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
      renderHistoricDataIndicator={renderHistoricDataIndicator}
      renderWidgetNotSupportedIndicator={renderWidgetNotSupportedIndicator}
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
  selectedCompanionMetricAlias
}) {
  const metrics = {
    [selectedMetric]: {
      metric: selectedMetric,
      aggregation: selectedMetricAggregation
    }
  };

  if (selectedCompanionMetric) {
    if (selectedCompanionMetric === selectedMetric) {
      metrics[selectedCompanionMetricAlias] = {
        metric: selectedCompanionMetric,
        aggregation: selectedCompanionMetricAggregation
      };
    } else {
      metrics[selectedCompanionMetric] = {
        metric: selectedCompanionMetric,
        aggregation: selectedCompanionMetricAggregation
      };
    }
  }
  return getTopServices({
    pagination: {
      retrievalSize: 5
    },
    order: {
      by: selectedMetric,
      direction: 'DESC'
    },
    metrics: metrics,
    applicationBoundaryScope: boundaryScope,
    applicationId,
    timeConfig
  });
}

function ViewAll({ applicationId, boundaryScope, selectedMetric, syntheticCalls, className }) {
  const getLinkToApplicationDashboard = useLinkToApplicationDashboard();

  return (
    <Link
      className={className}
      href={getLinkToApplicationDashboard({
        applicationId,
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
  const getLinkToServiceDashboard = useLinkToServiceDashboard();

  return (
    <Link
      className={className}
      href={getLinkToServiceDashboard({ applicationId, serviceId: item.service.id, boundaryScope, syntheticCalls })}
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
