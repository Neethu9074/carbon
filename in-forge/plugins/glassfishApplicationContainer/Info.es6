import React from 'react';

import {DescriptionList, DescriptionItem} from 'in-components/DescriptionList';
import {formatDateTime} from 'in-services/formatters/date';

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
      <DescriptionItem title='Started at'>
        {formatDateTime(data.get('started_at'))}
      </DescriptionItem>
      <DescriptionItem title='Domain Name'>
        {data.get('domain_name')}
      </DescriptionItem>
      <DescriptionItem title='Applications'>
        {data.get('applications')}
      </DescriptionItem>
    </DescriptionList>
  );
}
