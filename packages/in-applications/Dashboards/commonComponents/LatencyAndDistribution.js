import React, { useState } from 'react';

import { ComboChartMetricSelector, TabChartSelector } from 'in-applications/Dashboards/commonComponents/ChartSelectors';
import LatencyDistributionHistogram from 'in-applications/Dashboards/commonComponents/LatencyDistributionHistogram';
import Latency from 'in-applications/Dashboards/commonComponents/Latency';
import useTimeShiftConfig from 'in-hooks/useTimeShiftConfig';
import Card from 'in-new-components/Card';

const tabOverTime = 'Over Time';
const tabDistribution = 'Distribution';

const tabs = [tabOverTime, tabDistribution];
const metrics = [
  {
    label: '50th',
    value: 'P50',
    tab: tabOverTime
  },
  {
    label: '90th',
    value: 'P90',
    tab: tabOverTime
  },
  {
    label: '95th',
    value: 'P95',
    tab: tabOverTime
  },
  {
    label: '99th',
    value: 'P99',
    tab: tabOverTime
  },
  {
    label: 'Max',
    value: 'MAX',
    tab: tabOverTime
  },
  {
    label: 'Mean',
    value: 'MEAN',
    tab: tabOverTime
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
  renderPostChartContent
}) {
  const [activeTab, setActiveTab] = useState(tabs[0]);
  const [activeAggregation, setActiveAggregation] = useState(metrics[0].value);

  const timeShiftConfig = useTimeShiftConfig();

  const header = timeShiftConfig.offset ? (
    <ComboChartMetricSelector metrics={metrics} selected={activeAggregation} onChange={setActiveAggregation} />
  ) : (
    <TabChartSelector tabs={tabs} selected={activeTab} onChange={setActiveTab} />
  );

  const selectedTab = timeShiftConfig.offset ? metrics.find(o => o.value === activeAggregation).tab : activeTab;

  return (
    <Card title={cardTitle} header={header}>
      {selectedTab === tabOverTime && (
        <Latency
          applicationId={applicationId}
          serviceId={serviceId}
          endpointId={endpointId}
          tagFilters={tagFilters}
          boundaryScope={boundaryScope}
          timeConfig={timeConfig}
          timeShiftAggregation={timeShiftConfig.offset ? activeAggregation : null}
          groupByTag={percentileGroupBy}
          renderPostChartContent={renderPostChartContent}
        />
      )}
      {activeTab === 'Distribution' && (
        <LatencyDistributionHistogram
          applicationId={applicationId}
          serviceId={serviceId}
          endpointId={endpointId}
          timeConfig={timeConfig}
          boundaryScope={boundaryScope}
          includeSyntheticCalls={includeSyntheticCalls}
          renderPostChartContent={renderPostChartContent}
        />
      )}
    </Card>
  );
}
