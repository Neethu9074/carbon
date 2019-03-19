import React from 'react';

import ServiceInstancesList from 'in-sdk/components/sidebar/ServiceInstancesList';
import KeyValueOverlay from 'in-sdk/components/sidebar/KeyValueOverlay';
import Collapsible from 'in-sdk/components/sidebar/Collapsible';
import Separator from 'in-sdk/components/sidebar/Separator';

import CassandraCommunicationInfo from '../CassandraCommunicationInfo';
import CassandraTopologyInfo from '../CassandraTopologyInfo';
import Info from '../Info';

export default function CassandraSidebar({ snapshot }) {
  const tokens = snapshot.getIn(['data', 'tokens']);

  return (
    <div>
      <Separator />

      <Collapsible initiallyOpen>
        <Collapsible.Header>Info</Collapsible.Header>
        <Collapsible.Content>
          <Info snapshot={snapshot} />
        </Collapsible.Content>
      </Collapsible>

      <Separator />

      <Collapsible initiallyOpen>
        <Collapsible.Header>Topology</Collapsible.Header>
        <Collapsible.Content>
          <CassandraTopologyInfo snapshotId={snapshot.get('id')} snapshot={snapshot} />
        </Collapsible.Content>
      </Collapsible>

      <Separator />

      <Collapsible initiallyOpen>
        <Collapsible.Header>Communication</Collapsible.Header>
        <Collapsible.Content>
          <CassandraCommunicationInfo snapshot={snapshot} />
        </Collapsible.Content>
      </Collapsible>

      {tokens ? <KeyValueOverlay header="Tokens" data={tokens} /> : null}

      <ServiceInstancesList snapshot={snapshot} />
    </div>
  );
}
