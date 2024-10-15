/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import LatencyDistributionHistogram from 'in-applications/Dashboards/commonComponents/LatencyDistributionHistogram';
import { TimeShiftAwareChartSelectorWithUrlState } from 'in-components/ChartSelectors/ChartSelectors';
import Latency from 'in-applications/Dashboards/commonComponents/Latency';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
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
  endpointTypes,
  cardTitle,
  percentileGroupBy,
  renderPostChartContent,
  urlMatrixParamConfig,
  renderWidgetNotSupportedIndicator,
  customChartSkeletonHeight
}) {
  const { location } = useNavigation();
  return (
    <TimeShiftAwareChartSelectorWithUrlState
      cardTitle={cardTitle}
      tabs={tabs}
      metrics={metrics}
      urlMatrixParamConfig={urlMatrixParamConfig}
      disabledWidgetInLive={
        renderWidgetNotSupportedIndicator &&
        location.matrix[urlMatrixParamConfig.path]['latencyTab'] === tabDistribution.id
      }
    >
      <ChartPresenter
        applicationId={applicationId}
        serviceId={serviceId}
        endpointId={endpointId}
        tagFilters={tagFilters}
        timeConfig={timeConfig}
        boundaryScope={boundaryScope}
        syntheticCalls={syntheticCalls}
        endpointTypes={endpointTypes}
        percentileGroupBy={percentileGroupBy}
        renderPostChartContent={renderPostChartContent}
        renderWidgetNotSupportedIndicator={renderWidgetNotSupportedIndicator}
        customChartSkeletonHeight={customChartSkeletonHeight}
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
  endpointTypes,
  percentileGroupBy,
  renderPostChartContent,
  selectedTabId,
  selectedMetricValue,
  timeShiftConfig,
  cardTitle,
  selectorComponent,
  renderWidgetNotSupportedIndicator,
  customChartSkeletonHeight
}) {
  return selectedTabId === tabOverTime.id ? (
    <Latency
      applicationId={applicationId}
      cardTitle={cardTitle}
      rightHeaderContent={selectorComponent}
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
      endpointTypes={endpointTypes}
      customChartSkeletonHeight={customChartSkeletonHeight}
    />
  ) : (
    <LatencyDistributionHistogram
      applicationId={applicationId}
      cardTitle={cardTitle}
      rightHeaderContent={selectorComponent}
      serviceId={serviceId}
      endpointId={endpointId}
      timeConfig={timeConfig}
      boundaryScope={boundaryScope}
      syntheticCalls={syntheticCalls}
      endpointTypes={endpointTypes}
      renderHistoricDataIndicator
      renderWidgetNotSupportedIndicator={renderWidgetNotSupportedIndicator}
    />
  );
}
