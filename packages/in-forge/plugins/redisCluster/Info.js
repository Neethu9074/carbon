import React from 'react';

import { DescriptionList, DescriptionItem } from 'in-sdk/components/sidebar/DescriptionList';
import ClusterStatusLabel from './ClusterStatusLabel';

export default function Info({ snapshot }) {
  const data = snapshot.get('data');

  return (
    <DescriptionList>
      <DescriptionItem title="ID">{data.get('cluster_id')}</DescriptionItem>
      <DescriptionItem title="Status">
        <ClusterStatusLabel status={data.get('cluster_state')} />
      </DescriptionItem>
    </DescriptionList>
  );
}
