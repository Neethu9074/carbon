import React from 'react';

import ProcessStartedAtDescriptionItem from 'in-sdk/components/sidebar/ProcessStartedAtDescriptionItem';
import { DescriptionList, DescriptionItem } from 'in-components/DescriptionList';
import { emptyArray } from 'in-services/fixedObjects';

export default function CrystalInfo({ snapshot }) {
  const data = snapshot.get('data');

  return (
    <DescriptionList>
      <DescriptionItem title="CrystalVersion">
        {data.get('crystal_version')}
      </DescriptionItem>
      <DescriptionItem title="Runtime Arguments">
        {data.get('args', emptyArray).join(' ')}
      </DescriptionItem>
      <ProcessStartedAtDescriptionItem snapshotId={snapshot.get('id')} />
      <DescriptionItem title="Process ID">
        {data.get('pid')}
      </DescriptionItem>
    </DescriptionList>
  );
}
