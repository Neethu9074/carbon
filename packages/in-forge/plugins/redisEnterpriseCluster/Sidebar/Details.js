/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React, { Fragment } from 'react';

import ServiceInstancesList from 'in-sdk/components/sidebar/ServiceInstancesList';
import ClusterNodeMemberList from 'in-forge/plugins/redisEnterpriseCluster/Sidebar/ClusterNodeMemberList';
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

      <ClusterNodeMemberList snapshotId={snapshotId} />

      <ServiceInstancesList snapshot={snapshot} />
    </Fragment>
  );
}
