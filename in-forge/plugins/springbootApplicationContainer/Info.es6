import React from 'react';

import {DescriptionList, DescriptionItem} from 'in-components/DescriptionList';
import {formatDateTime} from 'in-services/formatters/date';
import {emptyList} from 'in-services/fixedImmutables';


export default function SpringbootInfo({snapshot}) {
  const data = snapshot.get('data');
  const ports = data.get('ports', emptyList);

  return (
    <DescriptionList>
      <DescriptionItem title='Name'>
        {data.get('name')}
      </DescriptionItem>
      <DescriptionItem title='Version'>
        {data.get('version')}
      </DescriptionItem>
      <DescriptionItem title='Springboot Version'>
        {data.get('springBootVersion')}
      </DescriptionItem>
      <DescriptionItem title='Started At'>
        {formatDateTime(data.get('startedAt'))}
      </DescriptionItem>
      <DescriptionItem title='Status'>
        {data.get('status')}
      </DescriptionItem>
      <DescriptionItem title='Port'>
        {ports ? ports.valueSeq().join(', ') : null}
      </DescriptionItem>
      <DescriptionItem title='HTTP Sessions Max'>
        {data.get('httpsessionsMax')}
      </DescriptionItem>
    </DescriptionList>
  );
}
