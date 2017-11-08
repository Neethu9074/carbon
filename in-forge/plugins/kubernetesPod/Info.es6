import React from 'react';

import { DescriptionList, DescriptionItem } from 'in-components/DescriptionList';
import KeyValuePopup from 'in-sdk/components/sidebar/KeyValuePopup';
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
      <div>
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
          <KeyValuePopup header="Labels" data={data.get('labels')} />
        </DescriptionList>
      </div>
    );
  }
);
