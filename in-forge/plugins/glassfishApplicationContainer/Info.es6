import React from 'react';

import ProcessStartedAtDescriptionItem from 'in-sdk/components/sidebar/ProcessStartedAtDescriptionItem';
import {DescriptionList, DescriptionItem} from 'in-components/DescriptionList';

export default function GlassfishInfo({snapshot}) {
  const data = snapshot.get('data');
  return (
    <DescriptionList>
      <DescriptionItem title='Process ID'>
        {data.get('pid')}
      </DescriptionItem>
      <DescriptionItem title='Port'>
        {data.get('port')}
      </DescriptionItem>
      <DescriptionItem title='Version'>
        {data.get('version')}
      </DescriptionItem>
      <ProcessStartedAtDescriptionItem snapshotId={snapshot.get('id')} />
      <DescriptionItem title='Domain Name'>
        {data.get('domain_name')}
      </DescriptionItem>
    </DescriptionList>
  );
}
