import React from 'react';

import ProcessStartedAtDescriptionItem from 'in-sdk/components/sidebar/ProcessStartedAtDescriptionItem';
import { DescriptionList, DescriptionItem } from 'in-components/DescriptionList';

export default function NginxInfo({ snapshot }) {
  const data = snapshot.get('data');
  return (
    <DescriptionList>
      <DescriptionItem title="Process ID">
        {data.get('pid')}
      </DescriptionItem>
      <DescriptionItem title="Worker processes">
        {data.get('worker_processes')}
      </DescriptionItem>
      <DescriptionItem title="Worker connections">
        {data.get('worker_connections')}
      </DescriptionItem>
      <ProcessStartedAtDescriptionItem snapshotId={snapshot.get('id')} />
    </DescriptionList>
  );
}
