import React from 'react';

import {DescriptionList, DescriptionItem} from 'in-components/DescriptionList';
import {formatDateTime} from 'in-services/formatters/date';


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
      <DescriptionItem title='Started At'>
        {formatDateTime(data.get('startedAt'))}
      </DescriptionItem>
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
