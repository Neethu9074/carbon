/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import ServiceInstancesList from 'in-sdk/components/sidebar/ServiceInstancesList';
import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import SparkChartsSection from 'in-sdk/components/sidebar/SparkChartsSection';
import ClusterMemberList from 'in-sdk/components/sidebar/ClusterMemberList';
import { bytes, number, siPrefix } from 'in-services/formatters/number';
import Collapsible from 'in-sdk/components/sidebar/Collapsible';
import Info from '../Info';

export default function CassandraClusterSidebar({ snapshot }) {
  const snapshotId = snapshot.get('id');
  return (
    <div>
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
            formatter: number,
            aggregation: 'mean'
          },
          {
            metric: 'unreachableNodeCount',
            label: 'Unreachable Nodes',
            formatter: number,
            aggregation: 'mean'
          },
          {
            metric: 'keyspaceCount',
            label: 'Keyspaces',
            formatter: siPrefix,
            aggregation: 'mean'
          },
          {
            metric: 'overallDiskSize',
            label: 'Store Size',
            formatter: bytes,
            aggregation: 'mean'
          }
        ]}
        renderPostChartContent={PluginDashboardsMarkerLanes}
      />

      <ClusterMemberList snapshotId={snapshotId} />

      <ServiceInstancesList snapshot={snapshot} />
    </div>
  );
}
