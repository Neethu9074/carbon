import React from 'react';

import { DescriptionList, DescriptionItem } from 'in-components/DescriptionList';
import ProcessStartedAtDescriptionItem from 'in-sdk/components/sidebar/ProcessStartedAtDescriptionItem';

export default function Info({ snapshot }) {
  const data = snapshot.get('data');
  return (
    <DescriptionList>
      <DescriptionItem title="clusterId">
        {data.get('clusterId')}
      </DescriptionItem>
      <DescriptionItem title="Version">
        {data.get('version')}
      </DescriptionItem>
      <DescriptionItem title="State">
        {data.get('state')}
      </DescriptionItem>
      <ProcessStartedAtDescriptionItem snapshotId={snapshot.get('id')} />
    </DescriptionList>
  );
}
