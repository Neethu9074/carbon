/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import ServiceInstancesList from 'in-sdk/components/sidebar/ServiceInstancesList';
import Collapsible from 'in-sdk/components/sidebar/Collapsible';
import Info from 'in-forge/plugins/activeMQArtemis/Info';
import KeyValueOverlay from 'in-sdk/components/sidebar/KeyValueOverlay';
import AcceptorsInfo from 'in-forge/plugins/activeMQArtemis/AcceptorsInfo';

export default function ActiveMQArtemisSidebar({ snapshot }) {
  return (
    <div>
      <Collapsible initiallyOpen>
        <Collapsible.Header>Broker Info</Collapsible.Header>
        <Collapsible.Content>
          <Info snapshot={snapshot} />
        </Collapsible.Content>
      </Collapsible>

      <Collapsible initiallyOpen={false}>
        <Collapsible.Header>Transport Acceptors Info</Collapsible.Header>
        <Collapsible.Content>
          <AcceptorsInfo snapshot={snapshot} />
        </Collapsible.Content>
      </Collapsible>

      <KeyValueOverlay header="Addresses" data={snapshot.getIn(['data', 'addressNames'])} />
      <KeyValueOverlay header="Queues" data={snapshot.getIn(['data', 'queueNames'])} />
      <ServiceInstancesList snapshot={snapshot} />
    </div>
  );
}
