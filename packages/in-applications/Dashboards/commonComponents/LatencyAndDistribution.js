import React from 'react';

import { TimeShiftAwareChartSelectorWithUrlState } from 'in-applications/Dashboards/commonComponents/ChartSelectors';
import LatencyDistributionHistogram from 'in-applications/Dashboards/commonComponents/LatencyDistributionHistogram';
import Latency from 'in-applications/Dashboards/commonComponents/Latency';

const tabOverTime = {
  id: 'overTime',
  label: 'Over Time'
};
const tabDistribution = {
  id: 'dist',
  label: 'Distribution'
};

const tabs = [tabOverTime, tabDistribution];
const metrics = [
  {
    id: 'p50',
    label: '50th',
    value: 'P50',
    tab: tabOverTime.id,
    tabDefault: true
  },
  {
    id: 'p90',
    label: '90th',
    value: 'P90',
    tab: tabOverTime.id
  },
  {
    id: 'p95',
    label: '95th',
    value: 'P95',
    tab: tabOverTime.id
  },
  {
    id: 'p99',
    label: '99th',
    value: 'P99',
    tab: tabOverTime.id
  },
  {
    id: 'max',
    label: 'Max',
    value: 'MAX',
    tab: tabOverTime.id
  },
  {
    id: 'mean',
    label: 'Mean',
    value: 'MEAN',
    tab: tabOverTime.id
  },
  {
    id: 'dist',
    label: 'Distribution',
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
  includeSyntheticCalls,
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
        includeSyntheticCalls={includeSyntheticCalls}
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
  includeSyntheticCalls,
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
      groupByTag={percentileGroupBy}
      renderPostChartContent={renderPostChartContent}
    />
  ) : (
    <LatencyDistributionHistogram
      applicationId={applicationId}
      serviceId={serviceId}
      endpointId={endpointId}
      timeConfig={timeConfig}
      boundaryScope={boundaryScope}
      includeSyntheticCalls={includeSyntheticCalls}
    />
  );
}
