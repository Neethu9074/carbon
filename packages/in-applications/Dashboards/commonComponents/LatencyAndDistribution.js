import React, { useEffect, useState } from 'react';

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
  },
  {
    label: 'Distribution',
    value: 'DISTRIBUTION',
    tab: tabDistribution
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
  const findAggregationByTab = tab => metrics.find(m => m.tab === tab).value;
  const findTabByAggregation = aggregation => metrics.find(m => m.value === aggregation).tab;

  const [activeTab, setActiveTab] = useState(tabs[0]);
  const [activeAggregation, setActiveAggregation] = useState(findAggregationByTab(activeTab));

  useEffect(() => {
    // if the active tab changes, the active aggregation must be updated
    if (findTabByAggregation(activeAggregation) !== activeTab) {
      setActiveAggregation(findAggregationByTab(activeTab));
    }
  }, [activeTab]);

  useEffect(() => {
    // if the active aggregation changes, the active tab may need to be updated
    const activeAggregationTab = findTabByAggregation(activeAggregation);
    if (activeAggregationTab !== activeTab) {
      setActiveTab(activeAggregationTab);
    }
  }, [activeAggregation]);

  const timeShiftConfig = useTimeShiftConfig();

  const header = timeShiftConfig.offset ? (
    <ComboChartMetricSelector metrics={metrics} selected={activeAggregation} onChange={setActiveAggregation} />
  ) : (
    <TabChartSelector tabs={tabs} selected={activeTab} onChange={setActiveTab} />
  );

  const selectedTab = timeShiftConfig.offset ? findTabByAggregation(activeAggregation) : activeTab;

  return (
    <Card title={cardTitle} header={header}>
      {selectedTab === tabOverTime ? (
        <Latency
          applicationId={applicationId}
          serviceId={serviceId}
          endpointId={endpointId}
          tagFilters={tagFilters}
          boundaryScope={boundaryScope}
          timeConfig={timeConfig}
          timeShiftConfig={timeShiftConfig}
          timeShiftAggregation={timeShiftConfig.offset ? activeAggregation : null}
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
      )}
    </Card>
  );
}
