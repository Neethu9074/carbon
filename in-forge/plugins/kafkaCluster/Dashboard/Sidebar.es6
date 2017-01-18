import React from 'react';

import ServiceInstancesList from 'in-sdk/components/sidebar/ServiceInstancesList';
import ClusterMemberList from 'in-sdk/components/sidebar/ClusterMemberList';
import Collapsible from 'in-sdk/components/sidebar/Collapsible';
import KeyValuePopup from 'in-sdk/components/sidebar/KeyValuePopup';
import Separator from 'in-sdk/components/sidebar/Separator';

import Info from '../Info';

export default function KafkaClusterSidebar({snapshot}) {

  return (
    <div>
      <Separator />
      <Collapsible initiallyOpen>
        <Collapsible.Header>Kafka Cluster</Collapsible.Header>
        <Collapsible.Content>
          <Info snapshot={snapshot} />
        </Collapsible.Content>
      </Collapsible>

      <ClusterMemberList snapshotId={snapshot.get('id')} />

      <KeyValuePopup header='Topics/Partitions'
                     data={snapshot.getIn(['data', 'partitions'])} />

      <ServiceInstancesList snapshotId={snapshot.get('id')} />
    </div>
  );
}
