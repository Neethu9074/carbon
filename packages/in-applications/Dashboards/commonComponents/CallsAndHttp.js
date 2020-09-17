import React, { useState } from 'react';

import { ComboChartMetricSelector, TabChartSelector } from 'in-applications/Dashboards/commonComponents/ChartSelectors';
import CallsErrorsChart from 'in-applications/Dashboards/commonComponents/CallsErrorsChart';
import HttpSections from 'in-applications/Dashboards/commonComponents/http/HttpSections';
import useTimeShiftConfig from 'in-hooks/useTimeShiftConfig';
import Card from 'in-new-components/Card';

const tabCallCount = 'Call count';
const tabHttpStatusCodes = 'HTTP status codes';

const tabs = [tabCallCount, tabHttpStatusCodes];
const metrics = [
  {
    label: 'Calls',
    value: 'calls',
    tab: tabCallCount
  },
  {
    label: 'Erroneous Calls',
    value: 'erroneousCalls',
    tab: tabCallCount
  },
  {
    label: '1XX',
    value: 'http.1xx',
    tab: tabHttpStatusCodes
  },
  {
    label: '2XX',
    value: 'http.2xx',
    tab: tabHttpStatusCodes
  },
  {
    label: '3XX',
    value: 'http.3xx',
    tab: tabHttpStatusCodes
  },
  {
    label: '4XX',
    value: 'http.4xx',
    tab: tabHttpStatusCodes
  },
  {
    label: '5XX',
    value: 'http.5xx',
    tab: tabHttpStatusCodes
  }
];

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
  renderPostChartContentHttpStatus
}) {
  const [activeTab, setActiveTab] = useState(tabs[0]);
  const [activeMetric, setActiveMetric] = useState(metrics[0].value);
  const timeShiftConfig = useTimeShiftConfig();

  const header = timeShiftConfig.offset ? (
    <ComboChartMetricSelector metrics={metrics} selected={activeMetric} onChange={setActiveMetric} />
  ) : (
    <TabChartSelector tabs={tabs} selected={activeTab} onChange={setActiveTab} />
  );

  const selectedTab = timeShiftConfig.offset ? metrics.find(o => o.value === activeMetric).tab : activeTab;
  return (
    <Card title={cardTitle} header={header}>
      {selectedTab === tabCallCount ? (
        <CallsErrorsChart
          applicationId={applicationId}
          serviceId={serviceId}
          endpointId={endpointId}
          tagFilters={tagFilters}
          boundaryScope={boundaryScope}
          timeConfig={timeConfig}
          timeShiftMetric={timeShiftConfig.offset ? activeMetric : null}
          groupByTag={callGroupByTag}
          renderPostChartContent={renderPostChartContent}
        />
      ) : (
        <HttpSections
          applicationId={applicationId}
          serviceId={serviceId}
          endpointId={endpointId}
          tagFilters={tagFilters}
          boundaryScope={boundaryScope}
          timeConfig={timeConfig}
          timeShiftMetric={timeShiftConfig.offset ? activeMetric : null}
          groupByTag={{ name: 'call.http.status' }}
          renderPostChartContentHttpStatus={renderPostChartContentHttpStatus}
          showGraph
        />
      )}
    </Card>
  );
}
