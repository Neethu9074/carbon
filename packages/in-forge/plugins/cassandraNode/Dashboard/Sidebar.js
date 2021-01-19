/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import ServiceInstancesList from 'in-sdk/components/sidebar/ServiceInstancesList';
import KeyValueOverlay from 'in-sdk/components/sidebar/KeyValueOverlay';
import CassandraCommunicationInfo from '../CassandraCommunicationInfo';
import Collapsible from 'in-sdk/components/sidebar/Collapsible';
import CassandraTopologyInfo from '../CassandraTopologyInfo';
import Info from '../Info';

export default function CassandraSidebar({ snapshot }) {
  const tokens = snapshot.getIn(['data', 'tokens']);

  return (
    <div>
      <Collapsible initiallyOpen>
        <Collapsible.Header>Info</Collapsible.Header>
        <Collapsible.Content>
          <Info snapshot={snapshot} />
        </Collapsible.Content>
      </Collapsible>

      <Collapsible initiallyOpen>
        <Collapsible.Header>Topology</Collapsible.Header>
        <Collapsible.Content>
          <CassandraTopologyInfo snapshotId={snapshot.get('id')} snapshot={snapshot} />
        </Collapsible.Content>
      </Collapsible>

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
