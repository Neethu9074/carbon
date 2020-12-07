import React from 'react';

import { TimeShiftAwareChartSelectorWithUrlState } from 'in-applications/Dashboards/commonComponents/ChartSelectors';
import CallsErrorsChart from 'in-applications/Dashboards/commonComponents/CallsErrorsChart';
import HttpSections from 'in-applications/Dashboards/commonComponents/http/HttpSections';

const tabCallCount = {
  id: 'call',
  label: 'Call count'
};
const tabHttpStatusCodes = {
  id: 'http',
  label: 'HTTP status codes'
};

const allTabs = [tabHttpStatusCodes, tabCallCount];
const callsOnlyTab = [tabCallCount];

const allMetrics = [
  {
    id: '1xx',
    label: '1XX',
    value: 'http.1xx',
    tab: tabHttpStatusCodes.id
  },
  {
    id: '2xx',
    label: '2XX',
    value: 'http.2xx',
    tab: tabHttpStatusCodes.id,
    tabDefault: true
  },
  {
    id: '3xx',
    label: '3XX',
    value: 'http.3xx',
    tab: tabHttpStatusCodes.id
  },
  {
    id: '4xx',
    label: '4XX',
    value: 'http.4xx',
    tab: tabHttpStatusCodes.id
  },
  {
    id: '5xx',
    label: '5XX',
    value: 'http.5xx',
    tab: tabHttpStatusCodes.id
  },
  {
    id: 'nonHttp',
    label: 'Other',
    value: 'calls',
    tab: tabHttpStatusCodes.id
  },
  {
    id: 'calls',
    label: 'Calls',
    value: 'calls',
    tab: tabCallCount.id,
    tabDefault: true
  },
  {
    id: 'erroneousCalls',
    label: 'Erroneous Calls',
    value: 'erroneousCalls',
    tab: tabCallCount.id
  }
];

const allMetricsWithoutHttpOther = allMetrics.filter(metric => metric.id !== 'nonHttp');
const allMetricsWithoutHttp = allMetrics.filter(m => m.tab !== tabHttpStatusCodes.id);

export default function CallsAndHttp({
  applicationId,
  serviceId,
  endpointId,
  tagFilters,
  timeConfig,
  boundaryScope,
  cardTitle,
  callGroupByTag,
  renderPostChartContent,
  renderPostChartContentHttpStatus,
  showHttp,
  hasHttpAndOtherEndpoints,
  urlMatrixParamConfig,
  isSynthetic
}) {
  const tabs = showHttp ? allTabs : callsOnlyTab;
  const metrics = showHttp
    ? hasHttpAndOtherEndpoints
      ? allMetrics
      : allMetricsWithoutHttpOther
    : allMetricsWithoutHttp;

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
        callGroupByTag={callGroupByTag}
        renderPostChartContent={renderPostChartContent}
        renderPostChartContentHttpStatus={renderPostChartContentHttpStatus}
        hasHttpAndOtherEndpoints={hasHttpAndOtherEndpoints}
        isSynthetic={isSynthetic}
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
  callGroupByTag,
  renderPostChartContent,
  renderPostChartContentHttpStatus,
  hasHttpAndOtherEndpoints,
  selectedTabId, // passed implicitly by TimeShiftAwareChartSelectorWithUrlState
  selectedMetricValue, // passed implicitly by TimeShiftAwareChartSelectorWithUrlState
  timeShiftConfig, // passed implicitly by TimeShiftAwareChartSelectorWithUrlState
  isSynthetic
}) {
  return selectedTabId === tabCallCount.id ? (
    <CallsErrorsChart
      applicationId={applicationId}
      serviceId={serviceId}
      endpointId={endpointId}
      tagFilters={tagFilters}
      boundaryScope={boundaryScope}
      timeConfig={timeConfig}
      timeShiftConfig={timeShiftConfig}
      timeShiftMetric={selectedMetricValue}
      groupByTag={callGroupByTag}
      renderPostChartContent={renderPostChartContent}
      isSynthetic={isSynthetic}
    />
  ) : (
    <HttpSections
      applicationId={applicationId}
      serviceId={serviceId}
      endpointId={endpointId}
      tagFilters={tagFilters}
      boundaryScope={boundaryScope}
      timeConfig={timeConfig}
      timeShiftConfig={timeShiftConfig}
      timeShiftMetric={selectedMetricValue}
      groupByTag={{ name: 'call.http.status' }}
      renderPostChartContentHttpStatus={renderPostChartContentHttpStatus}
      hasHttpAndOtherEndpoints={hasHttpAndOtherEndpoints}
      showGraph
      isSynthetic={isSynthetic}
    />
  );
}
