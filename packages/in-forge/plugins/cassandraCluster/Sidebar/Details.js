/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { t } from 'in-i18n';
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
            label: t('in-forge:plugins.cassandraCluster.sidebar.labelAvailableNodes'),
            formatter: number,
            aggregation: 'mean'
          },
          {
            metric: 'unreachableNodeCount',
            label: t('in-forge:plugins.cassandraCluster.sidebar.labelUnreachableNodes'),
            formatter: number,
            aggregation: 'mean'
          },
          {
            metric: 'keyspaceCount',
            label: t('in-forge:plugins.cassandraCluster.sidebar.labelKeyspaces'),
            formatter: siPrefix,
            aggregation: 'mean'
          },
          {
            metric: 'overallDiskSize',
            label: t('in-forge:plugins.cassandraCluster.sidebar.labelStoreSize'),
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
