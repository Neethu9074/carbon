/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import { DescriptionList, DescriptionItem } from 'in-sdk/components/sidebar/DescriptionList';
import ClusterStatusLabel from 'in-forge/plugins/elasticsearchCluster/ClusterStatusLabel';

export default function Info({ snapshot }) {
  const data = snapshot.get('data');

  return (
    <DescriptionList>
      <DescriptionItem title="Name">{data.get('groupId')}</DescriptionItem>
      <DescriptionItem title="Status">
        <ClusterStatusLabel status={data.get('clusterState')} />
      </DescriptionItem>
    </DescriptionList>
  );
}
