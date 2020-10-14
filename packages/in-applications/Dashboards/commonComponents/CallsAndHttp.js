import React, { useEffect, useState } from 'react';

import { ComboChartMetricSelector, TabChartSelector } from 'in-applications/Dashboards/commonComponents/ChartSelectors';
import CallsErrorsChart from 'in-applications/Dashboards/commonComponents/CallsErrorsChart';
import HttpSections from 'in-applications/Dashboards/commonComponents/http/HttpSections';
import useTimeShiftConfig from 'in-hooks/useTimeShiftConfig';
import Card from 'in-new-components/Card';

const tabCallCount = 'Call count';
const tabHttpStatusCodes = 'HTTP status codes';

const allTabs = [tabHttpStatusCodes, tabCallCount];
const allMetrics = [
  {
    id: 'http.1xx',
    label: '1XX',
    value: 'http.1xx',
    tab: tabHttpStatusCodes
  },
  {
    id: 'http.2xx',
    label: '2XX',
    value: 'http.2xx',
    tab: tabHttpStatusCodes,
    tabDefault: true
  },
  {
    id: 'http.3xx',
    label: '3XX',
    value: 'http.3xx',
    tab: tabHttpStatusCodes
  },
  {
    id: 'http.4xx',
    label: '4XX',
    value: 'http.4xx',
    tab: tabHttpStatusCodes
  },
  {
    id: 'http.5xx',
    label: '5XX',
    value: 'http.5xx',
    tab: tabHttpStatusCodes
  },
  {
    id: 'calls.nonHttp',
    label: 'Other',
    value: 'calls',
    tab: tabHttpStatusCodes
  },
  {
    id: 'calls',
    label: 'Calls',
    value: 'calls',
    tab: tabCallCount,
    tabDefault: true
  },
  {
    id: 'erroneousCalls',
    label: 'Erroneous Calls',
    value: 'erroneousCalls',
    tab: tabCallCount
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
  renderPostChartContentHttpStatus,
  hideHttp,
  hasHttpAndOtherEndpoints
}) {
  const tabs = hideHttp ? allTabs.filter(tab => tab !== tabHttpStatusCodes) : allTabs;
  const metrics = hideHttp ? allMetrics.filter(m => m.tab !== tabHttpStatusCodes) : allMetrics;

  const findDefaultMetricByTab = tab => metrics.find(m => m.tab === tab && m.tabDefault).id;
  const findTabByMetric = metric => metrics.find(m => m.id === metric).tab;

  const [activeTab, setActiveTab] = useState(tabs[0]);
  const [activeMetric, setActiveMetric] = useState(findDefaultMetricByTab(activeTab));

  useEffect(() => {
    // if the active tab changes, the active metric must be updated
    if (activeTab !== findTabByMetric(activeMetric)) {
      setActiveMetric(findDefaultMetricByTab(activeTab));
    }
  }, [activeTab]);

  useEffect(() => {
    // if the active metric changes, the active tab may need to be updated
    const activeMetricTab = findTabByMetric(activeMetric);
    if (activeMetricTab !== activeTab) {
      setActiveTab(activeMetricTab);
    }
  }, [activeMetric]);

  const timeShiftConfig = useTimeShiftConfig();

  const header = timeShiftConfig.offset ? (
    <ComboChartMetricSelector
      metrics={hasHttpAndOtherEndpoints ? metrics : metrics.filter(metric => metric.id !== 'calls.nonHttp')}
      selected={activeMetric}
      onChange={setActiveMetric}
    />
  ) : (
    tabs.length > 1 && <TabChartSelector tabs={tabs} selected={activeTab} onChange={setActiveTab} />
  );

  const selectedTab = timeShiftConfig.offset ? findTabByMetric(activeMetric) : activeTab;
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
          timeShiftConfig={timeShiftConfig}
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
          timeShiftConfig={timeShiftConfig}
          timeShiftMetric={timeShiftConfig.offset ? activeMetric : null}
          groupByTag={{ name: 'call.http.status' }}
          renderPostChartContentHttpStatus={renderPostChartContentHttpStatus}
          showGraph
          hasHttpAndOtherEndpoints={hasHttpAndOtherEndpoints}
        />
      )}
    </Card>
  );
}
