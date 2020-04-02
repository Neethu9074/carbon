import React from 'react';

import Collapsible from 'in-sdk/components/sidebar/Collapsible';
import Info from 'in-forge/plugins/kafkaConnectConnector/Info';

export default function KafkaConnectConnectorSidebar({ snapshot }) {
  return (
    <div>
      <Collapsible initiallyOpen>
        <Collapsible.Header>Connector Info</Collapsible.Header>
        <Collapsible.Content>
          <Info snapshot={snapshot} />
        </Collapsible.Content>
      </Collapsible>
    </div>
  );
}
