import React from 'react';

import ClusterStatusLabel from 'in-forge/plugins/elasticsearchCluster/ClusterStatusLabel';
import { DescriptionList, DescriptionItem } from 'in-components/DescriptionList';

export default function Info({ snapshot }) {
  const data = snapshot.get('data');

  return (
    <DescriptionList>
      <DescriptionItem title="Name">
        {data.get('groupId')}
      </DescriptionItem>
      <DescriptionItem title="Status">
        <ClusterStatusLabel status={data.get('clusterState')} />
      </DescriptionItem>
    </DescriptionList>
  );
}
