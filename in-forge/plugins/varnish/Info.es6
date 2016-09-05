import React from 'react';

import {formatDateTime} from 'in-services/formatters/date';
import {DescriptionList, DescriptionItem} from 'in-components/DescriptionList';

export default function VarnishInfo({snapshot}) {
  const data = snapshot.get('data');

  return (
    <DescriptionList>
      <DescriptionItem title='Port'>
        {data.get('port')}
      </DescriptionItem>
      <DescriptionItem title='Version'>
        {data.get('version')}
      </DescriptionItem>
      <DescriptionItem title='Started at'>
        {formatDateTime(data.get('started_at'))}
      </DescriptionItem>
      <DescriptionItem title='Thread pools'>
        {data.get('thread_pools')}
      </DescriptionItem>
    </DescriptionList>
  );
}
