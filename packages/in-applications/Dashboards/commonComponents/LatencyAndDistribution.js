import React, { useState } from 'react';

import LatencyDistributionHistogram from 'in-applications/Dashboards/commonComponents/LatencyDistributionHistogram';
import Latency from 'in-applications/Dashboards/commonComponents/Latency';
import ButtonGroup from 'in-new-components/ButtonGroup';
import Card from 'in-new-components/Card';

export default function LatencyAndDistribution({
  applicationId,
  serviceId,
  endpointId,
  timeConfig,
  boundaryScope,
  includeSyntheticCalls,
  cardTitle,
  percentileGroupBy,
  callType,
  renderPostChartContent
}) {
  const tabs = ['Percentiles', 'Distribution'];
  const [activeTab, setActiveTab] = useState(tabs[0]);

  const header = (
    <ButtonGroup
      buttonPropsList={tabs.map(tab => ({
        text: tab,
        key: tab,
        kind: 'primaryv2',
        onClick: () => {
          setActiveTab(tab);
        }
      }))}
      activeKey={activeTab}
    />
  );

  return (
    <Card title={cardTitle} header={header}>
      {activeTab === 'Percentiles' && (
        <Latency
          applicationId={applicationId}
          serviceId={serviceId}
          endpointId={endpointId}
          boundaryScope={boundaryScope}
          includeSyntheticCalls={includeSyntheticCalls}
          timeConfig={timeConfig}
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
          callType={callType}
          renderPostChartContent={renderPostChartContent}
        />
      )}
    </Card>
  );
}
