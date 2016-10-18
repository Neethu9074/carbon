import React from 'react';

import {DescriptionList, DescriptionItem} from 'in-components/DescriptionList';
import {formatDateTime} from 'in-services/formatters/date';


export default function HttpdInfo({snapshot}) {
  const data = snapshot.get('data');
  return (
    <DescriptionList>
      <DescriptionItem title='Process ID'>
        {data.get('pid')}
      </DescriptionItem>
      <DescriptionItem title='Version'>
        {data.get('version')}
      </DescriptionItem>
      <DescriptionItem title='Architecture'>
        {data.get('architecture')}
      </DescriptionItem>
      <DescriptionItem title='Started at'>
        {formatDateTime(data.get('started_at'))}
      </DescriptionItem>
      <DescriptionItem title='Max workers'>
        {data.get('max_workers')}
      </DescriptionItem>
      <DescriptionItem title='MPM'>
        {data.get('mpm')}
      </DescriptionItem>
      <DescriptionItem title='Listen'>
        {data.get('ports', []).join(', ')}
      </DescriptionItem>
    </DescriptionList>
  );
}
