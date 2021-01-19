/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import ServiceInstancesList from 'in-sdk/components/sidebar/ServiceInstancesList';
import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import SparkChartsSection from 'in-sdk/components/sidebar/SparkChartsSection';
import ClusterMemberList from 'in-sdk/components/sidebar/ClusterMemberList';
import Collapsible from 'in-sdk/components/sidebar/Collapsible';
import { siPrefix, bytes } from 'in-services/formatters/number';
import Info from '../Info';

export default function ElasticsearchClusterSidebar({ snapshot }) {
  const snapshotId = snapshot.get('id');

  return (
    <div>
      <Collapsible initiallyOpen>
        <Collapsible.Header>Elasticsearch Cluster</Collapsible.Header>
        <Collapsible.Content>
          <Info snapshot={snapshot} />
        </Collapsible.Content>
      </Collapsible>

      <SparkChartsSection
        snapshot={snapshot}
        metrics={[
          {
            metric: 'node_count',
            label: 'Nodes',
            formatter: siPrefix,
            aggregation: 'mean'
          },
          {
            metric: 'indices_count',
            label: 'Indices',
            formatter: siPrefix,
            aggregation: 'mean'
          },
          {
            metric: 'active_shards_count',
            label: 'Active Shards',
            formatter: siPrefix,
            aggregation: 'mean'
          },
          {
            metric: 'document_count',
            label: 'Documents',
            formatter: siPrefix,
            aggregation: 'mean'
          },
          {
            metric: 'store_size',
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
