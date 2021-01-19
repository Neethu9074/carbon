/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import ServiceInstancesList from 'in-sdk/components/sidebar/ServiceInstancesList';
import ClusterMemberList from 'in-sdk/components/sidebar/ClusterMemberList';
import KeyValueOverlay from 'in-sdk/components/sidebar/KeyValueOverlay';
import Collapsible from 'in-sdk/components/sidebar/Collapsible';

import Info from '../Info';

export default function KafkaClusterSidebar({ snapshot }) {
  return (
    <div>
      <Collapsible initiallyOpen>
        <Collapsible.Header>Kafka Cluster</Collapsible.Header>
        <Collapsible.Content>
          <Info snapshot={snapshot} />
        </Collapsible.Content>
      </Collapsible>

      <ClusterMemberList snapshotId={snapshot.get('id')} />

      <KeyValueOverlay header="Topics/Partitions" data={snapshot.getIn(['data', 'partitions'])} />

      <ServiceInstancesList snapshot={snapshot} />
    </div>
  );
}
