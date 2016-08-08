import React from 'react';

import {DescriptionList, DescriptionItem} from 'in-components/DescriptionList';
import Collapsible from 'in-sdk/components/sidebar/Collapsible';
import Separator from 'in-sdk/components/sidebar/Separator';
import List from 'in-sdk/components/sidebar/List';

import CassandraCommunicationInfo from '../CassandraCommunicationInfo';
import CassandraTopologyInfo from '../CassandraTopologyInfo';


export default function CassandraSidebar({snapshot}) {
  const data = snapshot.get('data');
  const tokens = data.get('tokens');

  return (
    <div>
      <Collapsible initiallyOpen={true}>
        <Collapsible.Header>
          Info
        </Collapsible.Header>
        <Collapsible.Content>
          <DescriptionList>
            <DescriptionItem title='Version'>
              {data.get('version')}
            </DescriptionItem>
          </DescriptionList>
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

      <Separator />

      {tokens && tokens.size > 0 ?
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
        : null
      }
    </div>
  );
}
