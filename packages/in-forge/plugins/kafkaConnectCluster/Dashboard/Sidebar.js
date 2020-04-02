import React from 'react';

import Collapsible from 'in-sdk/components/sidebar/Collapsible';
import Info from 'in-forge/plugins/kafkaConnectCluster/Info';

export default function KafkaConnectClusterSidebar({ snapshot }) {
  return (
    <div>
      <Collapsible initiallyOpen>
        <Collapsible.Header>Cluster Info</Collapsible.Header>
        <Collapsible.Content>
          <Info snapshot={snapshot} />
        </Collapsible.Content>
      </Collapsible>
    </div>
  );
}
