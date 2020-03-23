import React from 'react';

import Collapsible from 'in-sdk/components/sidebar/Collapsible';
import Info from 'in-forge/plugins/kafkaConnectWorker/Info';

export default function KafkaConnectWorkerSidebar({ snapshot }) {
  return (
    <div>
      <Collapsible initiallyOpen>
        <Collapsible.Header>Worker Info</Collapsible.Header>
        <Collapsible.Content>
          <Info snapshot={snapshot} />
        </Collapsible.Content>
      </Collapsible>
    </div>
  );
}
