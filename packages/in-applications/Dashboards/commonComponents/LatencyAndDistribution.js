/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { TimeShiftAwareChartSelectorWithUrlState } from 'in-applications/Dashboards/commonComponents/ChartSelectors';
import LatencyDistributionHistogram from 'in-applications/Dashboards/commonComponents/LatencyDistributionHistogram';
import Latency from 'in-applications/Dashboards/commonComponents/Latency';
import { t } from 'in-i18n';

const tabOverTime = {
  id: 'overTime',
  label: t('in-applications:labelOverTime')
};
const tabDistribution = {
  id: 'dist',
  label: t('in-applications:labelDistribution')
};

const tabs = [tabOverTime, tabDistribution];
const metrics = [
  {
    id: 'p50',
    label: t('in-mobile-apps:dashboard.tabs.50thLabel'),
    value: 'P50',
    tab: tabOverTime.id,
    tabDefault: true
  },
  {
    id: 'p90',
    label: t('in-mobile-apps:dashboard.tabs.90thLabel'),
    value: 'P90',
    tab: tabOverTime.id
  },
  {
    id: 'p95',
    label: t('in-mobile-apps:dashboard.tabs.95thLabel'),
    value: 'P95',
    tab: tabOverTime.id
  },
  {
    id: 'p99',
    label: t('in-mobile-apps:dashboard.tabs.99thLabel'),
    value: 'P99',
    tab: tabOverTime.id
  },
  {
    id: 'max',
    label: t('in-mobile-apps:dashboard.tabs.maxLabel'),
    value: 'MAX',
    tab: tabOverTime.id
  },
  {
    id: 'mean',
    label: t('in-mobile-apps:dashboard.tabs.meanLabel'),
    value: 'MEAN',
    tab: tabOverTime.id
  },
  {
    id: 'dist',
    label: t('in-applications:labelDistribution'),
    value: 'DISTRIBUTION',
    tab: tabDistribution.id,
    tabDefault: true
  }
];

export default function LatencyAndDistribution({
  applicationId,
  serviceId,
  endpointId,
  tagFilters,
  timeConfig,
  boundaryScope,
  syntheticCalls,
  cardTitle,
  percentileGroupBy,
  renderPostChartContent,
  urlMatrixParamConfig
}) {
  return (
    <TimeShiftAwareChartSelectorWithUrlState
      cardTitle={cardTitle}
      tabs={tabs}
      metrics={metrics}
      urlMatrixParamConfig={urlMatrixParamConfig}
    >
      <ChartPresenter
        applicationId={applicationId}
        serviceId={serviceId}
        endpointId={endpointId}
        tagFilters={tagFilters}
        timeConfig={timeConfig}
        boundaryScope={boundaryScope}
        syntheticCalls={syntheticCalls}
        percentileGroupBy={percentileGroupBy}
        renderPostChartContent={renderPostChartContent}
      />
    </TimeShiftAwareChartSelectorWithUrlState>
  );
}

function ChartPresenter({
  applicationId,
  serviceId,
  endpointId,
  tagFilters,
  timeConfig,
  boundaryScope,
  syntheticCalls,
  percentileGroupBy,
  renderPostChartContent,
  selectedTabId,
  selectedMetricValue,
  timeShiftConfig
}) {
  return selectedTabId === tabOverTime.id ? (
    <Latency
      applicationId={applicationId}
      serviceId={serviceId}
      endpointId={endpointId}
      tagFilters={tagFilters}
      boundaryScope={boundaryScope}
      timeConfig={timeConfig}
      timeShiftConfig={timeShiftConfig}
      timeShiftAggregation={selectedMetricValue}
      groupBy={percentileGroupBy}
      renderPostChartContent={renderPostChartContent}
      syntheticCalls={syntheticCalls}
    />
  ) : (
    <LatencyDistributionHistogram
      applicationId={applicationId}
      serviceId={serviceId}
      endpointId={endpointId}
      timeConfig={timeConfig}
      boundaryScope={boundaryScope}
      syntheticCalls={syntheticCalls}
    />
  );
}
