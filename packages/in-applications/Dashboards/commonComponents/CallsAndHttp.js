import React, { useState } from 'react';

import HttpSections from 'in-applications/Dashboards/commonComponents/http/HttpSections';
import CallsErrors from 'in-applications/Dashboards/commonComponents/CallsErrors';
import ButtonGroup from 'in-new-components/ButtonGroup';
import Card from 'in-new-components/Card';

export default function CallsAndHttp({
  applicationId,
  serviceId,
  endpointId,
  timeConfig,
  boundaryScope,
  cardTitle,
  callGroupByTag,
  includeSyntheticCalls,
  renderPostChartContent,
  renderPostChartContentHttpStatus
}) {
  const tabs = ['Call count', 'HTTP status codes'];
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
      {activeTab === 'Call count' && (
        <CallsErrors
          applicationId={applicationId}
          serviceId={serviceId}
          endpointId={endpointId}
          boundaryScope={boundaryScope}
          timeConfig={timeConfig}
          groupByTag={callGroupByTag}
          includeSyntheticCalls={includeSyntheticCalls}
          renderPostChartContent={renderPostChartContent}
        />
      )}
      {activeTab === 'HTTP status codes' && (
        <HttpSections
          applicationId={applicationId}
          serviceId={serviceId}
          endpointId={endpointId}
          boundaryScope={boundaryScope}
          timeConfig={timeConfig}
          groupByTag={{ name: 'call.http.status' }}
          renderPostChartContentHttpStatus={renderPostChartContentHttpStatus}
          showGraph
        />
      )}
    </Card>
  );
}
