import React from 'react';

import ProcessStartedAtDescriptionItem from 'in-sdk/components/sidebar/ProcessStartedAtDescriptionItem';
import { DescriptionList, DescriptionItem } from 'in-components/DescriptionList';

export default function NodeJsInfo({ snapshot }) {
  const data = snapshot.get('data');

  return (
    <DescriptionList>
      <DescriptionItem title="Name">
        {data.get('name')}
      </DescriptionItem>
      <DescriptionItem title="Version">
        {data.get('version')}
      </DescriptionItem>
      <DescriptionItem title="Description">
        {data.get('description')}
      </DescriptionItem>
      <DescriptionItem title="Application Arguments">
        {data.get('args', []).join(' ')}
      </DescriptionItem>
      <DescriptionItem title="Runtime Arguments">
        {data.get('execArgs', []).join(' ')}
      </DescriptionItem>
      <ProcessStartedAtDescriptionItem snapshotId={snapshot.get('id')} />
      <DescriptionItem title="Process ID">
        {data.get('pid')}
      </DescriptionItem>
    </DescriptionList>
  );
}
