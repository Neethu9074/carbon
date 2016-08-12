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
      <DescriptionItem title='Started At'>
        {formatDateTime(data.get('startedAt'))}
      </DescriptionItem>
    </DescriptionList>
  );
}
