import React from 'react';

import ProcessStartedAtDescriptionItem from 'in-sdk/components/sidebar/ProcessStartedAtDescriptionItem';
import {DescriptionList, DescriptionItem} from 'in-components/DescriptionList';

export default function EtcdInfo({snapshot}) {
  const data = snapshot.get('data');

  return (
    <DescriptionList>
      <DescriptionItem title='PID'>
        {data.get('pid')}
      </DescriptionItem>
      <DescriptionItem title='Cluster version'>
        {data.get('version_cluster')}
      </DescriptionItem>
      <DescriptionItem title='Server version'>
        {data.get('version_server')}
      </DescriptionItem>
      <DescriptionItem title='Id'>
        {data.get('id')}
      </DescriptionItem>
      <DescriptionItem title='Name'>
        {data.get('name')}
      </DescriptionItem>
      <DescriptionItem title='Leader id'>
        {data.get('leader_id')}
      </DescriptionItem>
      <DescriptionItem title='State'>
        {data.get('state')}
      </DescriptionItem>
      <ProcessStartedAtDescriptionItem snapshotId={snapshot.get('id')} />
    </DescriptionList>
  );
}
