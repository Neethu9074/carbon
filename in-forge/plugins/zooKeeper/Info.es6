import React from 'react';

import {DescriptionList, DescriptionItem} from 'in-components/DescriptionList';
import {formatDateTime} from 'in-services/formatters/date';

export default function Info({snapshot}) {
  const data = snapshot.get('data');
  return (
    <DescriptionList>
      <DescriptionItem title='Process'>
        {data.get('pid')}
      </DescriptionItem>
      <DescriptionItem title='Version'>
        {data.get('version')}
      </DescriptionItem>
      <DescriptionItem title='Client'>
        {data.get('client_port')}
      </DescriptionItem>
      <DescriptionItem title='Started At'>
        {formatDateTime(data.get('started_at'))}
      </DescriptionItem>
    </DescriptionList>
  );
}
