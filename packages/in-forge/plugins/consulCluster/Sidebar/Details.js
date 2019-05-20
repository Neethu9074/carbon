import React from 'react';

import Collapsible from 'in-sdk/components/sidebar/Collapsible';

import Info from '../Info';

export default function ConsulClusterSidebar({ snapshot }) {
  return (
    <div>
      <Collapsible initiallyOpen>
        <Collapsible.Header>Consul Cluster</Collapsible.Header>
        <Collapsible.Content>
          <Info snapshot={snapshot} />
        </Collapsible.Content>
      </Collapsible>
    </div>
  );
}
