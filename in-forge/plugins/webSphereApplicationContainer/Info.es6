import React from 'react';

import {DescriptionList, DescriptionItem} from 'in-components/DescriptionList';


export default function WebSphereInfo({snapshot}) {
  const data = snapshot.get('data');
  return (
    <DescriptionList>
      <DescriptionItem title='Version'>
        {data.get('version')}
      </DescriptionItem>
      <DescriptionItem title='Node Name'>
        {data.get('nodeName')}
      </DescriptionItem>
      <DescriptionItem title='Server Name'>
        {data.get('serverName')}
      </DescriptionItem>
      <DescriptionItem title='Cell Name'>
        {data.get('cellName')}
      </DescriptionItem>
      <DescriptionItem title='State'>
        {data.get('state')}
      </DescriptionItem>
    </DescriptionList>
  );
}
