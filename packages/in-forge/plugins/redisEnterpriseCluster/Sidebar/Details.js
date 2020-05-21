import React, { Fragment } from 'react';

import ServiceInstancesList from 'in-sdk/components/sidebar/ServiceInstancesList';
import ClusterMemberList from 'in-sdk/components/sidebar/ClusterMemberList';
import Collapsible from 'in-sdk/components/sidebar/Collapsible';

import Info from 'in-forge/plugins/redisEnterpriseCluster/Info.js';

export default function RedisClusterSidebar({ snapshot }) {
  const snapshotId = snapshot.get('id');
  return (
    <Fragment>
      <Collapsible initiallyOpen>
        <Collapsible.Header>Redis Enterprise Cluster</Collapsible.Header>
        <Collapsible.Content>
          <Info snapshot={snapshot} />
        </Collapsible.Content>
      </Collapsible>

      <ClusterMemberList snapshotId={snapshotId} />

      <ServiceInstancesList snapshot={snapshot} />
    </Fragment>
  );
}
