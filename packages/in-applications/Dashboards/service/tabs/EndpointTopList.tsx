/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { AggregationType, ApplicationBoundaryScope, BoundaryScope, TimeConfig } from '@instana/types';
import { themes } from '@instana/design-tokens';
import { EndpointItem } from '@instana/types';
import { Link } from '@instana/components';

// @ts-expect-error
import { TopListWithUrlState, trackTopListNavigation } from 'in-components/TopListWithUrlState';
import { useLinkToEndpointDashboard, useLinkToServiceDashboard } from 'in-applications/navigation/paths';
// @ts-expect-error
import TopListCardPresenter from 'in-components/TopListCard/TopListCardPresenter';
import { percentage, meanLatencyLargeInSeconds, number } from 'in-services/formatters/number';
import getEndpoints from 'in-applications/subscriptions/getEndpoints';
import { t } from 'in-i18n';

import locals from './EndpointTopList.mless';

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
const colors = [null, null, themes.default.ids.color.option.red['500']];

interface EndpointTopListProps {
  applicationId: string;
  serviceId: string;
  boundaryScope: BoundaryScope;
  timeConfig: TimeConfig;
  urlMatrixParamConfig: UrlMatrixParamConfig;
  renderHistoricDataIndicator: boolean;
  renderWidgetNotSupportedIndicator: boolean;
}

interface UrlMatrixParamConfig {
  path: string;
  paramTab: string;
  paramMetric: string;
}

export default function EndpointTopList({
  applicationId,
  serviceId,
  boundaryScope,
  timeConfig,
  urlMatrixParamConfig,
  renderHistoricDataIndicator,
  renderWidgetNotSupportedIndicator
}: EndpointTopListProps) {
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
      renderHistoricDataIndicator={renderHistoricDataIndicator}
      renderWidgetNotSupportedIndicator={renderWidgetNotSupportedIndicator}
    />
  );
}

interface GetListProps {
  applicationId: string;
  serviceId: string;
  boundaryScope: ApplicationBoundaryScope;
  timeConfig: TimeConfig;
  selectedMetric: string;
  selectedMetricAggregation: AggregationType;
  selectedCompanionMetric: string;
  selectedCompanionMetricAggregation: AggregationType;
  selectedCompanionMetricAlias: string;
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
  selectedCompanionMetricAlias
}: GetListProps) {
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
      applicationBoundaryScope: boundaryScope,
      timeConfig,
      includeInternalCalls: false,
      includeSyntheticCalls: false,
      useLongTermDataOnly: false
    },
    supportedOrderByCriteria: false
  });
}

interface ViewAllProps {
  applicationId: string;
  serviceId: string;
  boundaryScope: BoundaryScope;
  selectedMetric: string;
  className: string;
}

function ViewAll({ applicationId, serviceId, boundaryScope, selectedMetric, className }: ViewAllProps) {
  const getLinkToServiceDashboard = useLinkToServiceDashboard();

  return (
    <Link
      className={className}
      href={getLinkToServiceDashboard({
        applicationId,
        serviceId,
        boundaryScope,
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

interface LabelProps {
  item: EndpointItem;
  applicationId: string;
  serviceId: string;
  boundaryScope: BoundaryScope;
  className: string;
}

function Label({ item, applicationId, serviceId, boundaryScope, className }: LabelProps) {
  const getLinkToEndpointDashboard = useLinkToEndpointDashboard();

  return (
    <Link
      className={className}
      href={getLinkToEndpointDashboard({
        applicationId,
        serviceId,
        endpointId: item.endpoint.id,
        boundaryScope
      })}
      onClick={() => trackTopListNavigation()}
    >
      {item.endpoint.label}
    </Link>
  );
}

interface MetricProps {
  formattedMetricValue: string;
}

function Metric({ formattedMetricValue }: MetricProps) {
  return formattedMetricValue;
}

interface CompanionMetricProps {
  formattedCompanionMetric: string;
}

function CompanionMetric({ formattedCompanionMetric }: CompanionMetricProps) {
  return <span className={locals.companion}>({formattedCompanionMetric})</span>;
}
