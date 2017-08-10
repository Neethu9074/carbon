import React from 'react';

import { bytes, number, siPrefix } from 'in-services/formatters/number';
import ServiceInstancesList from 'in-sdk/components/sidebar/ServiceInstancesList';
import SparkChartsSection from 'in-sdk/components/sidebar/SparkChartsSection';
import ClusterMemberList from 'in-sdk/components/sidebar/ClusterMemberList';
import Collapsible from 'in-sdk/components/sidebar/Collapsible';
import Separator from 'in-sdk/components/sidebar/Separator';

import Info from '../Info';

export default function CassandraClusterSidebar({ snapshot }) {
  const snapshotId = snapshot.get('id');

  return (
    <div>
      <Separator />
      <Collapsible initiallyOpen>
        <Collapsible.Header>Cassandra Cluster</Collapsible.Header>
        <Collapsible.Content>
          <Info snapshot={snapshot} />
        </Collapsible.Content>
      </Collapsible>

      <SparkChartsSection
        snapshot={snapshot}
        metrics={[
          {
            metric: 'nodeCount',
            label: 'Available Nodes',
            formatter: number.compact
          },
          {
            metric: 'unreachableNodeCount',
            label: 'Unreachable Nodes',
            formatter: number.compact
          },
          {
            metric: 'keyspaceCount',
            label: 'Keyspaces',
            formatter: siPrefix
          },
          {
            metric: 'overallDiskSize',
            label: 'Store Size',
            formatter: bytes
          }
        ]}
      />

      <ClusterMemberList snapshotId={snapshotId} />

      <ServiceInstancesList snapshotId={snapshot.get('id')} />
    </div>
  );
}
