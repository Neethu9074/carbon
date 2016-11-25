import React from 'react';

import ServiceInstancesList from 'in-sdk/components/sidebar/ServiceInstancesList';
import Collapsible from 'in-sdk/components/sidebar/Collapsible';
import Separator from 'in-sdk/components/sidebar/Separator';
import List from 'in-sdk/components/sidebar/List';

import CassandraCommunicationInfo from '../CassandraCommunicationInfo';
import CassandraTopologyInfo from '../CassandraTopologyInfo';
import Info from '../Info';


export default function CassandraSidebar({snapshot}) {
  const data = snapshot.get('data');
  const tokens = data.get('tokens');

  return (
    <div>
      <Separator />

      <Collapsible initiallyOpen={true}>
        <Collapsible.Header>
          Info
        </Collapsible.Header>
        <Collapsible.Content>
          <Info snapshot={snapshot} />
        </Collapsible.Content>
      </Collapsible>

      <Separator />

      <Collapsible initiallyOpen={true}>
        <Collapsible.Header>
          Topology
        </Collapsible.Header>
        <Collapsible.Content>
          <CassandraTopologyInfo snapshotId={snapshot.get('id')}
                                 snapshot={snapshot} />
        </Collapsible.Content>
      </Collapsible>

      <Separator />

      <Collapsible initiallyOpen={true}>
        <Collapsible.Header>
          Communication
        </Collapsible.Header>
        <Collapsible.Content>
          <CassandraCommunicationInfo snapshot={snapshot} />
        </Collapsible.Content>
      </Collapsible>

      {tokens && tokens.size > 0 ?
        <div>
          <Separator />
          <Collapsible initiallyOpen={false}>
            <Collapsible.Header>
              Tokens ({tokens.size})
            </Collapsible.Header>
            <Collapsible.Content>
              <List>
                {tokens.toArray().sort().map((token, i) =>
                  <List.Item key={i}>{token}</List.Item>
                )}
              </List>
            </Collapsible.Content>
          </Collapsible>
        </div>
        : null
      }

      <ServiceInstancesList snapshotId={snapshot.get('id')} />
    </div>
  );
}
