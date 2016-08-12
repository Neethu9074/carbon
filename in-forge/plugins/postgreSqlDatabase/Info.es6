import React from 'react';

import {DescriptionList, DescriptionItem} from 'in-components/DescriptionList';
import {formatDateTime} from 'in-services/formatters/date';


export default function PostgreSqlInfo({snapshot}) {
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
        {data.get('variables.VERSION')}
      </DescriptionItem>
      <DescriptionItem title='Started At'>
        {formatDateTime(data.get('variables.started_at'))}
      </DescriptionItem>
    </DescriptionList>
  );
}
