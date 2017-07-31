import React from 'react';

import { DescriptionList, DescriptionItem } from 'in-components/DescriptionList';
import SnapshotLink from 'in-components/Link/SnapshotLink';
import { getSnapshot } from 'in-stores/snapshot';
import { getLabel } from 'in-sdk/snapshot';
import { getZone } from 'in-stores/zone';
import connectTo from 'in-hoc/connectTo';

export default connectTo(
  props => {
    return {
      zoneSnapshot: getZone(props.snapshotId).flatMap(getSnapshot)
    };
  },
  function CassandraTopologyInfo({ snapshot, zoneSnapshot }) {
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
  }
);
