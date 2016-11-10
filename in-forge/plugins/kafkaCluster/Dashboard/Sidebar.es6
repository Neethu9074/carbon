import React from 'react';

import ServiceInstancesList from 'in-sdk/components/sidebar/ServiceInstancesList';
import Collapsible from 'in-sdk/components/sidebar/Collapsible';
import Separator from 'in-sdk/components/sidebar/Separator';

import Info from '../Info';


export default function KafkaClusterSidebar({snapshot}) {

  return (
    <div>
      <Separator />
      <Collapsible initiallyOpen={true}>
        <Collapsible.Header>Kafka Cluster</Collapsible.Header>
        <Collapsible.Content>
          <Info snapshot={snapshot} />
        </Collapsible.Content>
      </Collapsible>

      <Separator />

      <ServiceInstancesList snapshotId={snapshot.get('id')} />
    </div>
  );
}
