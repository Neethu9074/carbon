import React from 'react';

import ProcessStartedAtDescriptionItem from 'in-sdk/components/sidebar/ProcessStartedAtDescriptionItem';
import { DescriptionList, DescriptionItem } from 'in-components/DescriptionList';
import { emptyArray } from 'in-services/fixedObjects';

export default function RubyInfo({ snapshot }) {
  const data = snapshot.get('data');

  return (
    <DescriptionList>
      <DescriptionItem title="Ruby Version">
        {data.get('ruby_version')}
      </DescriptionItem>
      <DescriptionItem title="Runtime Arguments">
        {data.get('exec_args', emptyArray).join(' ')}
      </DescriptionItem>
      <DescriptionItem title="Framework">
        {data.get('framework')}
      </DescriptionItem>
      <ProcessStartedAtDescriptionItem snapshotId={snapshot.get('id')} />
      <DescriptionItem title="Process ID">
        {data.get('pid')}
      </DescriptionItem>
    </DescriptionList>
  );
}
