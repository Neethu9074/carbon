import React from 'react';

import {DescriptionList, DescriptionItem} from 'in-components/DescriptionList';
import {setSelectedSnapshotId} from 'in-stores/snapshot';
import getZone from 'in-hoc/getZone';


export default getZone(function CassandraTopologyInfo({snapshot, zoneSnapshot}) {
  const clusterId = zoneSnapshot ? zoneSnapshot.get('id') : undefined;
  const data = snapshot.get('data');

  return (
    <DescriptionList>
      <DescriptionItem onClick={() => setSelectedSnapshotId(clusterId)}
                       title='Cluster'>
        {data.get('clusterName')}
      </DescriptionItem>

      <DescriptionItem title='Datacenter'>
        {data.get('datacenter')}
      </DescriptionItem>

      <DescriptionItem title='Rack'>
        {data.get('rack')}
      </DescriptionItem>

      <DescriptionItem title='Host-Id'>
        {data.get('hostId')}
      </DescriptionItem>

    </DescriptionList>
  );
});
