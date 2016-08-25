import React from 'react';

import {DescriptionList, DescriptionItem} from 'in-components/DescriptionList';
import {formatDateTime} from 'in-services/formatters/date';


export default function JettyInfo({snapshot}) {
  const data = snapshot.get('data');
  const startedAt = data.get('startedAt');
  if (!startedAt) {
    return null;
  }
  return (
    <DescriptionList>
      <DescriptionItem title='Version'>
        {data.get('version')}
      </DescriptionItem>
      <DescriptionItem title='Started At'>
        {formatDateTime(startedAt)}
      </DescriptionItem>
    </DescriptionList>
  );
}
