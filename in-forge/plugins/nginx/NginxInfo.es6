import React from 'react';

import {DescriptionList, DescriptionItem} from 'in-components/DescriptionList';
import {formatDateTime} from 'in-services/formatters/date';


export default function NginxInfo({snapshot}) {
  const data = snapshot.get('data');
  return (
    <DescriptionList>
      <DescriptionItem title='Process ID'>
        {data.get('pid')}
      </DescriptionItem>
      <DescriptionItem title='Worker processes'>
        {data.get('worker_processes')}
      </DescriptionItem>
      <DescriptionItem title='Worker connections'>
        {data.get('worker_connections')}
      </DescriptionItem>
      <DescriptionItem title='Started At'>
        {formatDateTime(data.get('started_at'))}
      </DescriptionItem>
    </DescriptionList>
  );
}
