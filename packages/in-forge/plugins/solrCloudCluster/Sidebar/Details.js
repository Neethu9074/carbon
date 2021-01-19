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
import { number } from 'in-services/formatters/number';
import Info from '../Info';

export default function SolrCloudClusterSidebar({ snapshot }) {
  const snapshotId = snapshot.get('id');

  return (
    <div>
      <Collapsible initiallyOpen>
        <Collapsible.Header>Solr Cloud Cluster</Collapsible.Header>
        <Collapsible.Content>
          <Info snapshot={snapshot} />
        </Collapsible.Content>
      </Collapsible>

      <SparkChartsSection
        snapshot={snapshot}
        metrics={[
          {
            metric: 'cluster.requests',
            label: 'Average Requests',
            formatter: number,
            aggregation: 'sum'
          },
          {
            metric: 'cluster.evictions',
            label: 'Evictions',
            formatter: number,
            aggregation: 'sum'
          },
          {
            metric: 'cluster.errors',
            label: 'Errors',
            formatter: number,
            aggregation: 'sum'
          },
          {
            metric: 'cluster.docs_added',
            label: 'Documents added',
            formatter: number,
            aggregation: 'sum'
          },
          {
            metric: 'cluster.timeouts',
            label: 'Timeouts',
            formatter: number,
            aggregation: 'sum'
          },
          {
            metric: 'cluster.docs_pending',
            label: 'Documents pending',
            formatter: number,
            aggregation: 'sum'
          }
        ]}
        renderPostChartContent={PluginDashboardsMarkerLanes}
      />

      <ClusterMemberList snapshotId={snapshotId} />

      <ServiceInstancesList snapshot={snapshot} />
    </div>
  );
}
