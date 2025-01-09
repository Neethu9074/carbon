/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { useState } from 'react';

import { BoundaryScope, EndpointType, Group, TagFilter, TimeConfig, TimeShift } from '@instana/types';

import { TimeShiftAwareChartSelectorWithUrlState } from 'in-components/ChartSelectors/ChartSelectors';
import CallsErrorsChart from 'in-applications/Dashboards/commonComponents/CallsErrorsChart';
import HttpSections from 'in-applications/Dashboards/commonComponents/http/HttpSections';
import { createGroupBy } from 'in-analyze/navigation/paths';
import { t } from 'in-i18n';

const tabCallCount = {
  id: 'call',
  label: t('in-applications:labelCallCount')
};
const tabHttpStatusCodes = {
  id: 'http',
  label: t('in-applications:labelHTTPStatusCodes')
};

const allTabs = [tabHttpStatusCodes, tabCallCount];
const callsOnlyTab = [tabCallCount];

const allMetrics = [
  {
    id: '1xx',
    label: t('in-websites:websiteDashboard.tabs.ajax.xhrRequestLabel1XX'),
    value: 'http.1xx',
    tab: tabHttpStatusCodes.id
  },
  {
    id: '2xx',
    label: t('in-websites:websiteDashboard.tabs.ajax.xhrRequestLabel2XX'),
    value: 'http.2xx',
    tab: tabHttpStatusCodes.id,
    tabDefault: true
  },
  {
    id: '3xx',
    label: t('in-websites:websiteDashboard.tabs.ajax.xhrRequestLabel3XX'),
    value: 'http.3xx',
    tab: tabHttpStatusCodes.id
  },
  {
    id: '4xx',
    label: t('in-websites:websiteDashboard.tabs.ajax.xhrRequestLabel4XX'),
    value: 'http.4xx',
    tab: tabHttpStatusCodes.id
  },
  {
    id: '5xx',
    label: t('in-websites:websiteDashboard.tabs.ajax.xhrRequestLabel5XX'),
    value: 'http.5xx',
    tab: tabHttpStatusCodes.id
  },
  {
    id: 'nonHttp',
    label: t('in-applications:labelNonHttp'),
    value: 'calls',
    tab: tabHttpStatusCodes.id
  },
  {
    id: 'calls',
    label: t('in-applications:labelCalls'),
    value: 'calls',
    tab: tabCallCount.id,
    tabDefault: true
  },
  {
    id: 'erroneousCalls',
    label: t('in-applications:titleErroneousCalls'),
    value: 'erroneousCalls',
    tab: tabCallCount.id
  }
];

const allMetricsWithoutNonHttp = allMetrics.filter(metric => metric.id !== 'nonHttp');
const allMetricsWithoutHttp = allMetrics.filter(m => m.tab !== tabHttpStatusCodes.id);

interface Props {
  applicationId: string;
  serviceId: string;
  endpointId: string;
  tagFilters: TagFilter[];
  timeConfig: TimeConfig;
  boundaryScope: BoundaryScope;
  cardTitle: string;
  callGroupBy: Group;
  renderPostChartContent: (lanesProps: any) => JSX.Element;
  renderPostChartContentHttpStatus: (lanesProps: any) => JSX.Element;
  hasHttpAndOtherEndpoints: boolean;
  endpointTypes: EndpointType[];
}

interface CallsAndHttpProps extends Props {
  showHttp: boolean;
  urlMatrixParamConfig: { path: string; paramTab: string; paramMetric: string };
}
export default function CallsAndHttp({
  applicationId,
  serviceId,
  endpointId,
  tagFilters,
  timeConfig,
  boundaryScope,
  cardTitle,
  callGroupBy,
  renderPostChartContent,
  renderPostChartContentHttpStatus,
  showHttp,
  hasHttpAndOtherEndpoints,
  urlMatrixParamConfig,
  endpointTypes
}: CallsAndHttpProps): JSX.Element {
  const tabs = showHttp ? allTabs : callsOnlyTab;
  const metrics = showHttp ? (hasHttpAndOtherEndpoints ? allMetrics : allMetricsWithoutNonHttp) : allMetricsWithoutHttp;
  const [tableOpen, setTableOpen] = useState(false);
  return (
    <TimeShiftAwareChartSelectorWithUrlState
      cardTitle={cardTitle}
      tabs={tabs}
      metrics={metrics}
      urlMatrixParamConfig={urlMatrixParamConfig}
      setTableOpen={() => setTableOpen(true)}
    >
      <ChartPresenter
        applicationId={applicationId}
        cardTitle={cardTitle}
        serviceId={serviceId}
        endpointId={endpointId}
        tagFilters={tagFilters}
        timeConfig={timeConfig}
        boundaryScope={boundaryScope}
        callGroupBy={callGroupBy}
        renderPostChartContent={renderPostChartContent}
        renderPostChartContentHttpStatus={renderPostChartContentHttpStatus}
        hasHttpAndOtherEndpoints={hasHttpAndOtherEndpoints}
        endpointTypes={endpointTypes}
        tableOpen={tableOpen}
        tableCloseHandler={() => setTableOpen(false)}
      />
    </TimeShiftAwareChartSelectorWithUrlState>
  );
}

interface ChartPresenterProps extends Props {
  selectedTabId?: string; // passed implicitly by TimeShiftAwareChartSelectorWithUrlState
  selectedMetricValue?: string; // passed implicitly by TimeShiftAwareChartSelectorWithUrlState
  timeShiftConfig?: TimeShift; // passed implicitly by TimeShiftAwareChartSelectorWithUrlState
  selectorComponent?: React.ReactElement;
  tableOpen?: boolean;
  tableCloseHandler?: Function;
}
function ChartPresenter({
  applicationId,
  serviceId,
  endpointId,
  tagFilters,
  timeConfig,
  boundaryScope,
  callGroupBy,
  renderPostChartContent,
  renderPostChartContentHttpStatus,
  hasHttpAndOtherEndpoints,
  selectedTabId, // passed implicitly by TimeShiftAwareChartSelectorWithUrlState
  selectedMetricValue, // passed implicitly by TimeShiftAwareChartSelectorWithUrlState
  timeShiftConfig, // passed implicitly by TimeShiftAwareChartSelectorWithUrlState
  cardTitle,
  selectorComponent,
  endpointTypes,
  tableOpen,
  tableCloseHandler
}: ChartPresenterProps) {
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
      groupBy={callGroupBy}
      renderPostChartContent={renderPostChartContent}
      endpointTypes={endpointTypes}
      cardTitle={cardTitle}
      rightHeaderContent={selectorComponent}
      tableOpen={tableOpen}
      tableCloseHandler={tableCloseHandler}
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
      groupBy={createGroupBy('call.http.status')}
      renderPostChartContentHttpStatus={renderPostChartContentHttpStatus}
      hasHttpAndOtherEndpoints={hasHttpAndOtherEndpoints}
      cardTitle={cardTitle}
      rightHeaderContent={selectorComponent}
      endpointTypes={endpointTypes}
      tableOpen={tableOpen}
      tableCloseHandler={tableCloseHandler}
    />
  );
}
