import React from 'react';

import ProcessStartedAtDescriptionItem from 'in-sdk/components/sidebar/ProcessStartedAtDescriptionItem';
import {DescriptionList, DescriptionItem} from 'in-components/DescriptionList';


export default function OracleDBInfo({snapshot}) {
  const data = snapshot.get('data');

  return (
    <DescriptionList>
      <DescriptionItem title='Version'>
        {data.get('version')}
      </DescriptionItem>
      <DescriptionItem title='Oracle SID'>
        {data.get('databaseSID')}
      </DescriptionItem>
      <ProcessStartedAtDescriptionItem snapshotId={snapshot.get('id')} />
      <DescriptionItem title='CPU Count'>
        {data.get('cpuCount')}
      </DescriptionItem>
      <DescriptionItem title='Max Sessions'>
        {data.get('maxSessions')}
      </DescriptionItem>
      <DescriptionItem title='DB Block Size'>
        {data.get('dbBlockSize')}
      </DescriptionItem>
    </DescriptionList>
  );
}
