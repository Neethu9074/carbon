import React from 'react';

import ServiceInstancesList from 'in-sdk/components/sidebar/ServiceInstancesList';
import Collapsible from 'in-sdk/components/sidebar/Collapsible';
import List from 'in-sdk/components/sidebar/List';

import CassandraCommunicationInfo from '../CassandraCommunicationInfo';
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

      {tokens && tokens.size > 0 ? (
        <div>
          <Collapsible initiallyOpen={false}>
            <Collapsible.Header>Tokens ({tokens.size})</Collapsible.Header>
            <Collapsible.Content>
              <List>
                {tokens
                  .toArray()
                  .sort()
                  .map((token, i) => (
                    <List.Item key={i}>{token}</List.Item>
                  ))}
              </List>
            </Collapsible.Content>
          </Collapsible>
        </div>
      ) : null}

      <ServiceInstancesList snapshot={snapshot} />
    </div>
  );
}
