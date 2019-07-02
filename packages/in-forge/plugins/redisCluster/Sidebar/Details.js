import React, { Fragment } from 'react';

import ServiceInstancesList from 'in-sdk/components/sidebar/ServiceInstancesList';
import SparkChartsSection from 'in-sdk/components/sidebar/SparkChartsSection';
import ClusterMemberList from 'in-sdk/components/sidebar/ClusterMemberList';
import Collapsible from 'in-sdk/components/sidebar/Collapsible';
import { number } from 'in-services/formatters/number';

import Info from 'in-forge/plugins/redisCluster/Info.js';

export default function RedisClusterSidebar({ snapshot }) {
  const snapshotId = snapshot.get('id');
  return (
    <Fragment>
      <Collapsible initiallyOpen>
        <Collapsible.Header>Redis Cluster</Collapsible.Header>
        <Collapsible.Content>
          <Info snapshot={snapshot} />
        </Collapsible.Content>
      </Collapsible>

      <SparkChartsSection
        snapshot={snapshot}
        metrics={[
          {
            metric: 'cluster_known_nodes',
            label: 'Nodes',
            formatter: number.compact,
            aggregation: 'max'
          },
          {
            metric: 'cluster_size',
            label: 'Master nodes',
            formatter: number.compact,
            aggregation: 'max'
          }
        ]}
      />

      <ClusterMemberList snapshotId={snapshotId} />

      <ServiceInstancesList snapshot={snapshot} />
    </Fragment>
  );
}
