import React from 'react';

import { DescriptionList, DescriptionItem } from 'in-components/DescriptionList';
import SnapshotLink from 'in-components/Link/SnapshotLink';
import { getSnapshot } from 'in-stores/snapshot';
import { getLabel } from 'in-sdk/snapshot';
import connectTo from 'in-hoc/connectTo';
import { getZone } from 'in-stores/zone';

export default connectTo(
  props => {
    return {
      zoneSnapshot: getZone(props.snapshot.get('id')).flatMap(getSnapshot)
    };
  },
  function Info({ snapshot, zoneSnapshot }) {
    const data = snapshot.get('data');

    return (
      <DescriptionList>
        {zoneSnapshot ? (
          <DescriptionItem title="Cluster">
            <SnapshotLink snapshotId={zoneSnapshot.get('id')}>{getLabel(zoneSnapshot)}</SnapshotLink>
          </DescriptionItem>
        ) : null}
        <DescriptionItem title="Hostname">{data.get('hostname')}</DescriptionItem>
        <DescriptionItem title="Name">{data.get('name')}</DescriptionItem>
        <DescriptionItem title="Internal IP">{data.get('internalIp')}</DescriptionItem>
        <DescriptionItem title="Machine ID">{data.get('machineId')}</DescriptionItem>
        <DescriptionItem title="Labels">
          {(data.get('labels').map((v, k) => k + '=' + v) || []).join(', ')}
        </DescriptionItem>
      </DescriptionList>
    );
  }
);
