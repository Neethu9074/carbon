import React from 'react';

import ServiceInstancesList from 'in-sdk/components/sidebar/ServiceInstancesList';
import { DescriptionList, DescriptionItem } from 'in-components/DescriptionList';
import Collapsible from 'in-sdk/components/sidebar/Collapsible';
import Separator from 'in-sdk/components/sidebar/Separator';

import Info from '../Info';

export default function CassandraClusterSidebar({ snapshot }) {
  const data = snapshot.get('data');
  const liveNodesCount = data.get('nodeCount');

  return (
    <div>
      <Separator />
      <Collapsible initiallyOpen>
        <Collapsible.Header>Cassandra Cluster</Collapsible.Header>
        <Collapsible.Content>
          <Info snapshot={snapshot} />
        </Collapsible.Content>
      </Collapsible>

      <Separator />

      <Collapsible>
        <Collapsible.Header>Nodes</Collapsible.Header>
        <Collapsible.Content>
          <DescriptionList>
            <DescriptionItem title="Live Nodes">
              {liveNodesCount}
            </DescriptionItem>
            <DescriptionItem title="Down Nodes">
              {unreachableNodesCount(data)}
            </DescriptionItem>
          </DescriptionList>
        </Collapsible.Content>
      </Collapsible>

      <ServiceInstancesList snapshotId={snapshot.get('id')} />
    </div>
  );
}

function unreachableNodesCount(data) {
  const unreachableNodes = data.get('unreachableNodes');
  if (unreachableNodes) {
    return unreachableNodes.size;
  } else {
    return null;
  }
}
