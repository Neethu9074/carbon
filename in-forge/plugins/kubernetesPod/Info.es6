import React from 'react';

import { DescriptionList, DescriptionItem } from 'in-components/DescriptionList';
import SnapshotLink from 'in-components/Link/SnapshotLink';

import { getLabel } from 'in-sdk/snapshot';

import { getSnapshot } from 'in-stores/snapshot';
import { getZone } from 'in-stores/zone';

import connectTo from 'in-hoc/connectTo';

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
        <DescriptionItem title="Namespace">{data.get('namespace')}</DescriptionItem>
        <DescriptionItem title="Name">{data.get('name')}</DescriptionItem>
        <DescriptionItem title="Host IP">{data.get('hostIp')}</DescriptionItem>
        <DescriptionItem title="Pod IP">{data.get('podIp')}</DescriptionItem>
        <DescriptionItem title="Phase">{data.get('phase')}</DescriptionItem>
      </DescriptionList>
    );
  }
);
