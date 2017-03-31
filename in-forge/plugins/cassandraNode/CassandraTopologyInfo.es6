import React from 'react';

import { DescriptionList, DescriptionItem } from 'in-components/DescriptionList';
import SnapshotLink from 'in-components/Link/SnapshotLink';
import { getLabel } from 'in-sdk/snapshot';
import getZone from 'in-hoc/getZone';

export default getZone(function CassandraTopologyInfo({ snapshot, zoneSnapshot }) {
  const data = snapshot.get('data');

  return (
    <DescriptionList>
      {zoneSnapshot
        ? <DescriptionItem title="Cluster">
            <SnapshotLink snapshotId={zoneSnapshot.get('id')}>
              {getLabel(zoneSnapshot)}
            </SnapshotLink>
          </DescriptionItem>
        : null}

      <DescriptionItem title="Datacenter">
        {data.get('datacenter')}
      </DescriptionItem>

      <DescriptionItem title="Rack">
        {data.get('rack')}
      </DescriptionItem>

      <DescriptionItem title="Host-Id">
        {data.get('hostId')}
      </DescriptionItem>

    </DescriptionList>
  );
});
