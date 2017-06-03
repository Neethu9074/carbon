import React from 'react';

import ProcessStartedAtDescriptionItem from 'in-sdk/components/sidebar/ProcessStartedAtDescriptionItem';
import { DescriptionList, DescriptionItem } from 'in-components/DescriptionList';

export default function ProcessInfo({ snapshot }) {
  const data = snapshot.get('data');
  return (
    <DescriptionList>
      <DescriptionItem title="Executable">
        {data.get('exec')}
      </DescriptionItem>
      <DescriptionItem title="Process ID">
        {data.get('pid')}
      </DescriptionItem>
      <ProcessStartedAtDescriptionItem snapshotId={snapshot.get('id')} />
      <DescriptionItem title="User">
        {data.get('user')}
      </DescriptionItem>
      <DescriptionItem title="Group">
        {data.get('group')}
      </DescriptionItem>
      <DescriptionItem title="Job">
        {data.get('job')}
      </DescriptionItem>
    </DescriptionList>
  );
}
